const { DOCKER_HOST } = require("./constants");

async function connectRedis() {
  const redis = require("redis");
  const client = redis.createClient({
    url: `redis://${DOCKER_HOST}:6379`,
  });
  await client.connect();
  return client;
}
module.exports = connectRedis;
