// index.js
import express from 'express';
import { route } from './src/routes/route.js';
import { initializeBot } from './src/utils/initializeBot.js';
import dotenv from 'dotenv';

import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter.js';
import { messageQueue } from './src/queues/queue.js';

dotenv.config();

const app = express();
app.use(express.static('public'));
app.use(express.json());

// kick everything off
initializeBot();

// mount all our routes
app.use('/', route);

// bull-board dashboard
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/queue');
createBullBoard({
  queues: [new BullMQAdapter(messageQueue)],
  serverAdapter,
});
app.use('/queue', serverAdapter.getRouter());

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
