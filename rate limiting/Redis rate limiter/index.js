import express from 'express';
import cors from 'cors';
import { rateLimiter } from './rateLimiter.middleware.js';
import { connectToRedis } from './redisConfig.js';

const PORT = 3005;

const app = express();

app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: 'GET',
    allowedHeaders: ['Content-Type', 'Authorization']
}));

let redisClient;

(async () => {
    redisClient = await connectToRedis();
})();

// Routes
app.get('/', (req, res) => {
    res.send({
        response: "Main route",
        success: true
    });
});

app.get('/api1', rateLimiter({ MaxRequestNo: 5, timeDuration: 60 }), async (req, res) => {

    try {
        res.send({
            response: "Api 1 route",
            requestNo: req.requests,
            ttl: req.ttl,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
});

app.get('/api2', (req, res) => {
    res.send({
        response: "Api 2 route",
        success: true
    });
});

app.get('/api3', (req, res) => {
    res.send({
        response: "Api 3 route",
        success: true
    });
});

app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server running at ${PORT} port.`);
    }
});

process.on('SIGINT', () => {
    server.close(() => {
        console.log('Server shut down gracefully');
        process.exit(0);
    });
});
