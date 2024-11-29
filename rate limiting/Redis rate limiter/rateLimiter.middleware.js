import { redisClient } from "./redisConfig.js";

export function rateLimiter({ MaxRequestNo, timeDuration }) {
    return async function (req, res, next) {
console.log(MaxRequestNo, timeDuration)
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
        const key = `${req.url}-${ip}`;

        const requests = await redisClient.incr(key);

        let ttl;

        if (requests === 1) {
            await redisClient.expire(key, timeDuration);
            ttl = timeDuration;
            console.log("ttl : ", ttl);
        }
        else {
            // time to leave -- ttl
            ttl = await redisClient.ttl(key);
            console.log("ttl after : ", ttl)
        }


        if (requests > MaxRequestNo) {
            return res.send({
                response: "Max Requests made wait for some time",
                requestNo: requests,
                ttl: ttl,
                success: false
            });
        } else {
            req.requests = requests;
            req.ttl = ttl;
            next();
        }
    }
}