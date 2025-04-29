// src/controllers/message.js
import {  addMessageJob } from '../queues/queue.js';

export const message = async (req, res) => {
    const { number, message } = req.body;
    const jid = `${number}@s.whatsapp.net`;
    try {
        await addMessageJob(jid, message);
        res.status(200).json({ status: 'queued', message });
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message });
    }
};

export const broadcast = async (req, res) => {
    const { numbers, message } = req.body;
    const errors = [];
    for (const number of numbers) {
        const jid = `${number}@s.whatsapp.net`;
        try {
            await addMessageJob(jid, message);
        } catch (err) {
            errors.push({ number, error: err.message });
        }
    }
    if (errors.length === 0) {
        res.status(200).json({ status: 'queued', message: 'Broadcast sent to queue!' });
    } else {
        res.status(500).json({ status: 'partial-fail', errors });
    }
};

export const group = async (req, res) => {
    const { groupId, message } = req.body;
    const jid = `${groupId}@g.us`;
    try {
        await addMessageJob(jid, message);
        res.status(200).json({ status: 'queued', message });
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message });
    }
};
