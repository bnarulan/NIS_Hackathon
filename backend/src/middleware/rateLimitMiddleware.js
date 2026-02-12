// rateLimitMiddleware.js placeholder
import { createClient } from "redis";
import { REDIS_URL } from "../config.js";

const redisClient = createClient({ url: REDIS_URL });
redisClient.connect().catch(console.error);

export function rateLimit({ keyPrefix = "rl:", limit = 60, windowSec = 60 }) {
  return async (req, res, next) => {
    try {
      const key =
        keyPrefix +
        (req.user?.id || req.ip.replace(/[:.]/g, "_") || "anonymous");

      const tx = redisClient.multi();
      tx.incr(key);
      tx.expire(key, windowSec);
      const [count] = await tx.exec();
      const current = Number(count);

      if (current > limit) {
        return res
          .status(429)
          .json({ error: "Too many requests, please slow down." });
      }

      next();
    } catch (e) {
      console.error("RateLimit error", e);
      next();
    }
  };
}