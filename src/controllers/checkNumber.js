import { getSock } from "../utils/whatsapp.js";

export const checkWhatsAppNumber = async (req, res) => {
    const number = req.query.number; 
    // console.log(req);
    try {
        let sock = getSock();
        const jid = `${number}@s.whatsapp.net`; // Format nomor yang akan dicek
        const result = await sock.onWhatsApp(jid); // Mengecek keberadaan nomor
        
        if (result && result[0]?.exists) {            
            res.send(`Ok, nomor ${number} terdaftar di WhatsApp.`)
        } else {
            res.send(`Maaf, nomor ${number} TIDAK TERDAFTAR.`)
        }
    } catch (err) {
        console.error('Error saat memeriksa nomor:', err);
    }
};
