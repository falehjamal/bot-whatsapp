import { getSock } from "../utils/whatsapp.js";

let sock = getSock();

async function sendMessage(jid, message) {
    try {
        await sock.sendMessage(jid, { text: message });
        return { success: true };
    } catch (err) {
        console.error(err);
        return { success: false, error: err.message };
    }
}

export const message = async (req, res) => {
    const { number, message } = req.body;
    const jid = `${number}@s.whatsapp.net`;
    const result = await sendMessage(jid, message);
    if (result.success) {
        res.status(200).json({ status: 'success', message });
    } else {
        res.status(500).json({ status: 'error', error: result.error });
    }
}

export const broadcast = async (req, res) => {
    const { numbers, message } = req.body;
    const errors = [];
    for (const number of numbers) {
        const jid = `${number}@s.whatsapp.net`;
        const result = await sendMessage(jid, message);
        if (!result.success) errors.push({ number, error: result.error });
    }
    if (errors.length === 0) {
        res.status(200).json({ status: 'success', message: 'Broadcast sent!' });
    } else {
        res.status(500).json({ status: 'error', errors });
    }
}

export const group = async (req, res) => {
    const { groupId, message } = req.body;
    const jid = `${groupId}@g.us`;
    const result = await sendMessage(jid, message);
    if (result.success) {
        res.status(200).json({ status: 'success', message });
    } else {
        res.status(500).json({ status: 'error', error: result.error });
    }
}
