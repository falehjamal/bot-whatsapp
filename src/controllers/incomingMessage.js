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
