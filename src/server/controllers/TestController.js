const User = require("../models/User");
const { STATUS_CODE, DOCKER_HOST } = require("../utils/constants");

const redis = require("redis");

class TestController {
  async deleteUser(req, res, next) {
    const { email } = req.body;
    try {
      const deletedUser = await User.findOneAndDelete({ email: email });
      if (!deletedUser) {
        return res
          .status(STATUS_CODE.NOT_FOUND)
          .json({ message: "User not found" });
      }
      return res
        .status(STATUS_CODE.OK)
        .json({ message: "User successfully deleted" });
    } catch (error) {
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "An error occurred while deleting the user" });
    }
  }

  async getAllUser(req, res, next) {
    try {
      const users = await User.find();
      res.status(STATUS_CODE.OK).json(users);
    } catch (error) {
      res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "An error occurred while fetching users" });
    }
  }

  async redisTesting(req, res) {
    const client = redis.createClient({
      url: `redis://${DOCKER_HOST}:6379`,
    });
    await client.connect();
    // const value = await client.del("testingKey");
    const value = await client.get("testingKey");
    if (!value) {
      await client.set(
        "testingKey",
        JSON.stringify({ value1: "testingValue1", value2: 1 })
      );
      const expireTime = 10;
      client.expire("testingKey", expireTime);
    } else {
      console.log(value);
    }
    res.json(JSON.parse(value));
  }

  async getAllData(req, res) {
    const client = redis.createClient({
      url: `redis://${DOCKER_HOST}:6379`,
    });
    await client.connect();
    const keys = await client.keys("*");
    keys.forEach(async (key) => {
      const value = await client.get(key);
      console.log(`${key}: ${value}`);
    });

    return res.send(keys);
  }
}

module.exports = new TestController();
