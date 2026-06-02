import { createClient } from "redis";
declare global {
  var redisClient: ReturnType<typeof createClient> | undefined;
}
export const redis =
  global.redisClient ??
  createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    },
  });
if (!global.redisClient) {
  globalThis.redisClient = redis;
  redis.on("error", (err) => {
    console.log("Redis Error : ", err);
  });
  (async () => {
    if (!redis.isOpen) {
      await redis.connect();
      console.log("Redis Connected");
    }
  })();
  async function shutdown() {
    console.log("Closing Redis connection...");
    await redis.quit();
    process.exit(0);
  }

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}
