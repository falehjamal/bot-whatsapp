// src/controllers/checkNumber.js
import { getSock } from "../utils/whatsapp.js";

export const checkWhatsAppNumber = async (req, res) => {
  const number = req.query.number;

  if (!number) {
    return res.status(400).json({ error: '❌ Parameter "number" wajib diisi.' });
  }

  try {
    const sock = getSock();

    if (!sock) {
      return res.status(503).json({ error: '❌ Bot belum terkoneksi. Coba lagi nanti.' });
    }

    const jid = `${number}@s.whatsapp.net`;
    const result = await sock.onWhatsApp(jid);
    console.log(result)

    if (result?.[0]?.exists) {
      res.json({ success: true, number, message: `✅ Nomor ${number} terdaftar di WhatsApp.` });
    } else {
      res.json({ success: false, number, message: `❌ Nomor ${number} TIDAK terdaftar.` });
    }
  } catch (err) {
    console.error('❌ Error saat memeriksa nomor:', err);
    res.status(500).json({ error: 'Terjadi kesalahan saat memeriksa nomor WhatsApp.' });
  }
};
