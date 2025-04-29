// src/controllers/incomingMessage.js
import { addMessageJob } from '../queues/queue.js';

/**
 * Handler for incoming WhatsApp messages.
 * Pesan dibaca lalu dibalas melalui queue pengiriman.
 */
export const incomingMessage = async (sock, message) => {
  // Hanya proses pesan dari user lain (bukan dari bot)
  if (!message.key.fromMe) {
    try {
      // Tandai pesan sebagai dibaca
      await sock.readMessages([message.key]);

      const { remoteJid: noWa } = message.key;
      const textMessage = (
        message.message?.conversation ||
        message.message?.extendedTextMessage?.text ||
        ''
      ).toLowerCase();

      // Tentukan balasan
      let balasan;
      if (textMessage === 'ping') {
        balasan = 'Pong';
      } else if (textMessage === 'nomor') {
        balasan = `ID ini: ${noWa}`;
      } 

      if (balasan) {
        // Enqueue balasan ke queue pengiriman jika balasan ada
        await addMessageJob(noWa, balasan);
        console.log('📩 Balasan telah dimasukkan ke antrean:', balasan);
      }
    } catch (err) {
      console.error('❌ Gagal memproses incoming message:', err);
    }
  }
};
