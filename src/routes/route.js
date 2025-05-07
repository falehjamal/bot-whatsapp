import express from 'express';
import * as messageController from '../controllers/message.js';
import { checkWhatsAppNumber } from '../controllers/checkNumber.js';
import {
  getConnectionStatus,
  getQrData,
  setConnectionInfo,
  getSockInstance
} from '../utils/state.js';
import { initializeBot } from '../utils/initializeBot.js';
import fs from 'fs';
import path from 'path';
import { disconnectSock } from '../utils/whatsapp.js';

const route = express.Router();

// WhatsApp Message Endpoints
route.post('/send-private', messageController.message);
route.post('/send-group', messageController.group);
route.post('/send-broadcast', messageController.broadcast);

// Check WhatsApp Number
route.get('/check-number', checkWhatsAppNumber);

// Logout Endpoint: reset connection and optionally clear auth
route.get('/logout', async (req, res) => {
    await disconnectSock();
    const authPath = path.resolve('./auth');
  
    // hapus folder ./auth biar tidak auto login
    if (fs.existsSync(authPath)) {
      fs.rmSync(authPath, { recursive: true, force: true });
    }
  
    // set status disconnect
    setConnectionInfo(null, 'disconnected');
  
    res.redirect('/');
  });
  
  // Scan ulang: restart bot
  route.get('/rescan', (req, res) => {
    setConnectionInfo(null, 'disconnected');
    initializeBot();
    return res.redirect('/');
  });
  
  // Status plain
  route.get('/status', (req, res) => {
    return res.json({ status: getConnectionStatus() });
  });
  
  // QR code data
  route.get('/qr', (req, res) => {
    const qr = getQrData();
    if (qr) return res.json({ qr });
    return res.status(404).json({ error: 'QR belum tersedia' });
  });
  
  // Combined untuk frontend polling
  route.get('/api/status', (req, res) => {
    return res.json({
      connectionStatus: getConnectionStatus(),
      qrData: getQrData()
    });
  });
  
  export { route };
