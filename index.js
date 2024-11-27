const { makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const express = require('express');
const bodyParser = require('body-parser');
const qrCode = require('qrcode-terminal');

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Inisialisasi session auth
let sock;
const initializeBot = async () => {
    const { state, saveCreds } = await useMultiFileAuthState('./auth');
    sock = makeWASocket({
        auth: state,
    });

    // Event QR Code
    sock.ev.on('connection.update', (update) => {
        const { connection, qr } = update;
        if (qr) {
            console.log('Scan QR Code below:');
            qrCode.generate(qr, { small: true });
        }
        if (connection === 'close') {
            const shouldReconnect = update.lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Connection closed. Reconnecting...', shouldReconnect);
            if (shouldReconnect) initializeBot();
        } else if (connection === 'open') {
            console.log('Bot is ready!');
        }
    });

    // Simpan session credentials
    sock.ev.on('creds.update', saveCreds);

    // Event handler untuk pesan masuk
    sock.ev.on('messages.upsert', async (messages) => {
        messages = messages.messages[0]
        console.log(messages)

        if (!messages.key.fromMe) {
            const pesan = messages;
            const { remoteJid: noWa, fromMe } = pesan.key;
        
            const textMessage = pesan.message?.conversation?.toLowerCase() || 
                                pesan.message?.extendedTextMessage?.text?.toLowerCase() || "";
        
            await sock.readMessages([pesan.key]);
        
            if (!fromMe) {
                let balasan;
        
                if (textMessage === "ping") {
                    balasan = "Pong";
                } else if (textMessage === "id group") {
                    balasan = `ID Grup ini: ${noWa}`;
                }
        
                if (balasan) {
                    await sock.sendMessage(noWa, { text: balasan }, { quoted: pesan });
                }else{
                    await sock.sendMessage(noWa, { text: textMessage }, { quoted: pesan });
                }
            }
        }
        
        
    });
};

// Inisialisasi bot
initializeBot();

// Endpoint untuk mengirim pesan pribadi
app.post('/send-private', async (req, res) => {
    const { number, message } = req.body;
    try {
        const jid = `${number}@s.whatsapp.net`;
        await sock.sendMessage(jid, { text: message });
        res.status(200).json({ status: 'success', message });
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message });
    }
});

// Endpoint untuk broadcast
app.post('/send-broadcast', async (req, res) => {
    const { numbers, message } = req.body;
    try {
        for (const number of numbers) {
            const jid = `${number}@s.whatsapp.net`;
            await sock.sendMessage(jid, { text: message });
        }
        res.status(200).json({ status: 'success', message: 'Broadcast sent!' });
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message });
    }
});

// Endpoint untuk mengirim pesan ke grup
app.post('/send-group', async (req, res) => {
    const { groupId, message } = req.body;
    try {
        const jid = `${groupId}@g.us`;
        await sock.sendMessage(jid, { text: message });
        res.status(200).json({ status: 'success', message });
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message });
    }
});

// Start server Express
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
