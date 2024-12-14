import { makeWASocket, DisconnectReason, useMultiFileAuthState, downloadMediaMessage } from '@whiskeysockets/baileys';
import express from 'express';
import bodyParser from 'body-parser';
import qrCode from 'qrcode-terminal';
import fs from 'fs';
import { route } from './src/routes/route.js';
import { incomingMessage } from './src/controllers/IncomingMessage.js';
import { setSock } from './src/utils/whatsapp.js';

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Inisialisasi session auth
const initializeBot = async () => {
    const { state, saveCreds } = await useMultiFileAuthState('./auth');
    const newSock = makeWASocket({
        auth: state,
    });

    setSock(newSock);
    // Event QR Code
    newSock.ev.on('connection.update', (update) => {
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
    newSock.ev.on('creds.update', saveCreds);

    // Event handler untuk pesan masuk
    newSock.ev.on('messages.upsert', async (messages) => {
        const message = messages.messages[0];
        console.log(message);

        await incomingMessage(newSock,message);
    });
};

// Inisialisasi bot
initializeBot();
app.use('/',route);


// Start server Express
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
