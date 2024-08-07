const User = require("../models/User");
const { STATUS_CODE } = require("../utils/constants");
const { OTP_EXPIRE } = require("../utils/constants");

const redis = require("redis");
const generateOTP = require("../utils/otp_generator");
const { sendEmail } = require("../utils/nodemailer");
class AuthController {
  // [POST] /register
  async register(req, res, next) {
    const { name, email, password } = req.body;
    const hasEmail = await User.findOne({ email: email });
    try {
      if (hasEmail === null) {
        const otp = generateOTP();
        const values = {
          name: name,
          email: email,
          password: password,
          otp: otp,
          is_verified: false,
        };
        const client = redis.createClient({
          url: "redis://host.docker.internal:6379",
        });
        const subject = "Email Verification";
        const message = `Your OTP code is: ${otp}`;

        sendEmail(email, subject, message);
        await client.connect();
        await client.set(email, JSON.stringify(values));
        client.expire(email, OTP_EXPIRE);
        // const user = new User({ name, email, password });
        // await user.save();
        return res
          .status(STATUS_CODE.CREATED)
          .json({ message: "User successfully created" });
      } else {
        return res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ message: "Email already exists" });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "An error occurred while creating the user" });
    }
  }

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
      url: "redis://host.docker.internal:6379",
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
}

module.exports = new AuthController();
