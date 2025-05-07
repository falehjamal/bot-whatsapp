import dotenv from 'dotenv';
dotenv.config();
import IORedis from 'ioredis';

const redis = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
});

export default redis; 
