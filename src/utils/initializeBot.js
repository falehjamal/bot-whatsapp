// src/utils/initializeBot.js

import { makeWASocket, useMultiFileAuthState } from '@whiskeysockets/baileys';
import { incomingMessage } from '../controllers/incomingMessage.js';
import { setConnectionInfo, setSockInstance } from './state.js';
import { setSock } from './whatsapp.js';
import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { messageQueue } from '../queues/queue.js';
import dotenv from 'dotenv';
dotenv.config();

// Redis connection untuk BullMQ
const redisConnection = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
});

export async function initializeBot() {
  try {
    const { state, saveCreds } = await useMultiFileAuthState('./auth');
    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: true, // Memudahkan debug
      defaultQueryTimeoutMs: 60000 // Timeout yang lebih panjang untuk permintaan WhatsApp
    });

    // share instance ke util lain
    setSock(sock);
    setSockInstance(sock);

    // update status / QR di state
    sock.ev.on('connection.update', ({ connection, qr, lastDisconnect }) => {
      console.log('Connection update:', connection);
      
      if (qr) {
        // baru dapat QR: tunggu scan
        console.log('QR code received, waiting for scan');
        setConnectionInfo(qr, 'qr');
      } else if (connection === 'open') {
        // sudah terhubung
        console.log('Connected successfully!');
        setConnectionInfo(null, 'connected');
      } else if (connection === 'close') {
        // putus koneksi
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        console.log('Connection closed, status code:', statusCode);
        
        // Jika logoff yang disengaja (status 428), jangan auto-reconnect
        if (statusCode !== 428) {
          console.log('Reconnecting in 3 seconds...');
          setTimeout(initializeBot, 3000);
        } else {
          setConnectionInfo(null, 'disconnected');
        }
      }
    });

    // simpan kredensial otomatis
    sock.ev.on('creds.update', saveCreds);

    // handle incoming WA message
    sock.ev.on('messages.upsert', async ({ messages }) => {
      try {
        const msg = messages[0];
        if (!msg.key.fromMe && msg.message) {
          await incomingMessage(sock, msg);
        }
      } catch (err) {
        console.error('Error processing incoming message:', err);
      }
    });

    // worker untuk kirim queue
    new Worker(
      'whatsapp-message',
      async job => {
        try {
          const { jid, message } = job.data;
          await sock.sendMessage(jid, { text: message });
          return { success: true, timestamp: new Date() };
        } catch (error) {
          console.error(`Error sending message to ${job.data.jid}:`, error);
          throw error; // Membuat job gagal, akan di-retry oleh BullMQ
        }
      },
      { connection: redisConnection }
    ).on('failed', (job, err) => {
      console.error(`Job ${job.id} failed:`, err.message);
    });
    
    return sock;
  } catch (err) {
    console.error('Failed to initialize bot:', err);
    setConnectionInfo(null, 'disconnected');
    
    // Auto-retry setelah 5 detik jika inisialisasi gagal
    setTimeout(initializeBot, 5000);
  }
}
