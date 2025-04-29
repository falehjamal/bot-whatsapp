import { makeWASocket, DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys';
import { incomingMessage } from './src/controllers/incomingMessage.js';
import express from 'express';
import bodyParser from 'body-parser';
import qrCode from 'qrcode-terminal';
import { route } from './src/routes/route.js';
import { setSock } from './src/utils/whatsapp.js';
import { Worker } from 'bullmq';
import IORedis from 'ioredis';

// Bull Board dependencies
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter.js';

// Queues
import { messageQueue } from './src/queues/queue.js';

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Redis connection for BullMQ
const connection = new IORedis({
  host: '127.0.0.1',
  port: 6379,
  maxRetriesPerRequest: null,
});

const initializeBot = async () => {
  const { state, saveCreds } = await useMultiFileAuthState('./auth');
  const sock = makeWASocket({ auth: state });
  setSock(sock);

  sock.ev.on('connection.update', update => {
    const { connection, qr } = update;
    if (qr) {
      console.log('Scan QR Code below:');
      qrCode.generate(qr, { small: true });
    }
    if (connection === 'close') {
      const shouldReconnect = update.lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('Connection closed. Reconnecting...', shouldReconnect);
      if (shouldReconnect) initializeBot();
    } else if (connection === 'open') {
      console.log('✅ Bot is ready!');
    }
  });

  sock.ev.on('creds.update', saveCreds);

  // Handle incoming messages via queue
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const message = messages[0];
    if (!message.key.fromMe) {
      await incomingMessage(sock, message);
    }
  });

  // Worker to send WhatsApp messages
  new Worker('whatsapp-message', async job => {
    const { jid, message } = job.data;
    try {
      console.log(`📤 Kirim ke ${jid}: ${message}`);
      await sock.sendMessage(jid, { text: message });
    } catch (err) {
      console.error('❌ Gagal kirim:', err);
    }
  }, { connection })
  .on('failed', (job, err) => console.error(`❌ Job gagal [${job.id}]:`, err.message));
};

initializeBot();

// Express routing
app.use('/', route);

// Setup Bull Board Dashboard
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/dashboard');
createBullBoard({
  queues: [
    new BullMQAdapter(messageQueue)
  ],
  serverAdapter,
});
app.use('/dashboard', serverAdapter.getRouter());

// Start server Express
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
