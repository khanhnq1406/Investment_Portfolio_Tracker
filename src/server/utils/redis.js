const { REDIS_URL } = require("./constants");

async function connectRedis() {
  const redis = require("redis");
  const client = redis.createClient({
    url: REDIS_URL,
  });
  await client.connect();
  return client;
}
module.exports = connectRedis;
