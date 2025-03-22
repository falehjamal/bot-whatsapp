export const incomingMessage = async (sock,message) => {
    if (!message.key.fromMe) {
        const { remoteJid: noWa, fromMe } = message.key;
        const textMessage =
            message.message?.conversation?.toLowerCase() ||
            message.message?.extendedTextMessage?.text?.toLowerCase() ||
            "";

        await sock.readMessages([message.key]); // Tandai pesan sebagai dibaca

        if (!fromMe) {
            let balasan;

            // Respon otomatis berdasarkan teks
            if (textMessage === "ping") {
                balasan = "Pong";
            } else if (textMessage === "nomor") {
                balasan = `ID ini: ${noWa}`;
            }

            if (balasan) {
                await sock.sendMessage(noWa, { text: balasan }, { quoted: message });
            } else {
                await sock.sendMessage(noWa, { text: "Saya belum mengerti maksud kamu,saya masih perlu banyak belajar." }, { quoted: message });
            }

            console.log(balasan);
        }
    }
}

export const bangau = async (sock, message) => {
    if (!message.key.fromMe) {
        const { remoteJid: noWa, fromMe } = message.key;
        const textMessage =
            message.message?.conversation ||
            message.message?.extendedTextMessage?.text ||
            "";

        // Tandai pesan sebagai dibaca
        await sock.readMessages([message.key]);

        if (!fromMe) {
            // Periksa apakah pesan sesuai pola
            const messageLines = textMessage.split('\n');
            // const messageResult = messageLines[1].replace('#', ''); // Hapus karakter '#' dari pesan
            if (
                messageLines.length >= 2 && // Memastikan ada dua baris
                /^[A-Za-z]+$/.test(messageLines[0]) && // Baris pertama hanya satu kata
                /^[\d\*]+(\*\d+)*#$/.test(messageLines[1]) // Baris kedua sesuai pola angka*bintang dengan '#' di akhir
            ) {
                // const groupJid = "120363374154864152@g.us"; // Ganti dengan ID grup tujuan
                const groupJid = "120363348239754353@g.us"; // Ganti dengan ID grup tujuan
                await sock.sendMessage(groupJid, { text: textMessage }); // Forward pesan ke grup
                // await sock.sendMessage(groupJid,{ text: messageResult });

                console.log(`Pesan diforward ke grup: ${groupJid}`);
            } else {
                console.log("Pesan tidak sesuai pola, tidak diforward.");
            }
        }
    }
};
