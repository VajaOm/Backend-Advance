import { createClient } from 'redis';

let redisClient;

export async function connectToRedis() {
    if (!redisClient) { // Ensure the client is initialized only once
        redisClient = createClient({ url: `redis://localhost:8000` });
        redisClient.on('error', (err) => console.error('Redis Client Error', err));
        await redisClient.connect();
        console.log('Connected to Redis');
    }
    return redisClient;
}

export { redisClient };
