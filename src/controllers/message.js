export const message = async (req, res) => {
    const { number, message } = req.body;
    try {
        const jid = `${number}@s.whatsapp.net`;
        await sock.sendMessage(jid, { text: message });
        res.status(200).json({ status: 'success', message });
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message });
    }
}

export const broadcast = async (req, res) => {
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
}

export const group = async (req, res) => {
    const { groupId, message } = req.body;
    try {
        const jid = `${groupId}@g.us`;
        await sock.sendMessage(jid, { text: message });
        res.status(200).json({ status: 'success', message });
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message });
    }
}
