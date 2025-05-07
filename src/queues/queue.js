// src/queues/queue.js
import { Queue } from 'bullmq';
import redis from '../config/redis.js';

// Queue untuk pengiriman pesan WhatsApp
export const messageQueue = new Queue('whatsapp-message', {
  connection: redis,
});

/**
 * Tambah job kirim pesan ke queue whatsapp-message
 * @param {string} jid - WhatsApp JID tujuan, misal '6281234567890@s.whatsapp.net'
 * @param {string} message - Isi pesan yang akan dikirim
 */
export const addMessageJob = async (jid, message) => {
  await messageQueue.add('send-message', { jid, message });
};
