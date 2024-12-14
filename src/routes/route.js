import express from 'express';
import * as messageController from '../controllers/message.js';
import { checkWhatsAppNumber } from '../controllers/checkNumber.js';
const route = express.Router();

route.post('/send-private', messageController.message);
route.post('/send-broadcast', messageController.broadcast);
route.post('/send-group', messageController.group);
route.get('/check-number', checkWhatsAppNumber);

export {route};
