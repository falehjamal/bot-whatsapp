import express from 'express';
import * as messageController from '../controllers/message.js';
const route = express.Router();

route.post('/send-private', messageController.message);
route.post('/send-broadcast', messageController.broadcast);
route.post('/send-group', messageController.group);

export {route};
