const User = require("../models/User");
const { STATUS_CODE } = require("../utils/constants");
const { OTP_EXPIRE } = require("../utils/constants");

const redis = require("redis");
const generateOTP = require("../utils/otp_generator");
const { sendEmail } = require("../utils/nodemailer");

const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
class AuthController {
  // [POST] /login
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const findUser = await User.findOne({ email: email });
      console.log(findUser);
      if (!findUser) {
        return res
          .status(STATUS_CODE.NOT_FOUND)
          .json({ message: "User not found!" });
      }
      const isPasswordValid = await argon2.verify(findUser.password, password);
      if (isPasswordValid) {
        const accessToken = await jwt.sign(
          { email: email },
          process.env.ACCESS_TOKEN_SECRET
        );
        return res
          .status(STATUS_CODE.CREATED)
          .json({ message: "Login successful", accessToken: accessToken });
      } else {
        return res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ message: "Password incorrect" });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  }

  // [POST] /register
  async register(req, res, next) {
    const { name, email, password } = req.body;
    const hashedPassword = await argon2.hash(password);
    const hasEmail = await User.findOne({ email: email });
    try {
      if (hasEmail === null) {
        const otp = generateOTP();
        const values = {
          name: name,
          email: email,
          password: hashedPassword,
          otp: otp,
          is_verified: false,
        };
        const client = redis.createClient({
          url: "redis://host.docker.internal:6379",
        });
        const subject = "Email Verification";
        const message = `Your OTP code is: ${otp}`;

        // sendEmail(email, subject, message);
        await client.connect();
        await client.set(email, JSON.stringify(values));
        client.expire(email, OTP_EXPIRE);
        console.log(otp);

        return res
          .status(STATUS_CODE.CREATED)
          .json({ message: "OTP successfully sent" });
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

  // [GET] resendOtp
  async resendOtp(req, res) {
    const { email } = req.body;
    try {
      const otp = generateOTP();
      console.log(otp);
      const client = redis.createClient({
        url: "redis://host.docker.internal:6379",
      });
      await client.connect();
      const subject = "Email Verification";
      const message = `Your OTP code is: ${otp}`;

      // sendEmail(email, subject, message);
      const oldOtpValues = JSON.parse(await client.get(email));
      if (oldOtpValues === null) {
        return res
          .status(STATUS_CODE.NOT_FOUND)
          .json({ message: "Register session has expired" });
      }
      const newOtpValues = {
        name: oldOtpValues.name,
        email: oldOtpValues.email,
        password: oldOtpValues.password,
        otp: otp,
        is_verified: false,
      };
      await client.set(email, JSON.stringify(newOtpValues));
      client.expire(email, OTP_EXPIRE);
      return res
        .status(STATUS_CODE.CREATED)
        .json({ message: "OTP successfully re-sent" });
    } catch (error) {
      console.log(error);
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "An error occurred while re-sending OTP" });
    }
  }

  async verifyOtp(req, res) {
    const { otp, email } = req.body;
    const client = redis.createClient({
      url: "redis://host.docker.internal:6379",
    });
    await client.connect();

    const userRedis = JSON.parse(await client.get(email));
    if (userRedis === null) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json({ message: "Register session has expired" });
    }
    if (otp === userRedis.otp) {
      const fullname = userRedis.name;
      const email = userRedis.email;
      const password = userRedis.password;
      const createUser = new User({ fullname, email, password });
      const userCreated = await createUser.save();
      console.log(userCreated);
      return res
        .status(STATUS_CODE.CREATED)
        .json({ message: "User successfully created" });
    } else {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: "Invalid OTP" });
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

  async getAllData(req, res) {
    const client = redis.createClient({
      url: "redis://host.docker.internal:6379",
    });
    await client.connect();
    const keys = await client.keys("*");
    keys.forEach(async (key) => {
      const value = await client.get(key);
      console.log(`${key}: ${value}`);
    });

    return res.send("Success");
  }
}

module.exports = new AuthController();
