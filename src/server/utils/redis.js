async function connectRedis() {
  const redis = require("redis");
  const client = redis.createClient({
    url: "redis://host.docker.internal:6379",
  });
  await client.connect();
  return client;
}
module.exports = connectRedis;
