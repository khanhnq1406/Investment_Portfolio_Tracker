const User = require("../models/User");
const {
  STATUS_CODE,
  OTP_EXPIRE,
  FORGOT_PASSWORD_KEY,
} = require("../utils/constants");

const redis = require("redis");
const generateOTP = require("../utils/otp_generator");
const { sendEmail } = require("../utils/nodemailer");
const connectRedis = require("../utils/redis");

const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
class AuthController {
  // [GET] /
  async index(req, res) {
    try {
      const email = req.email;
      const user = await User.findOne({ email });
      if (user) {
        return res.status(STATUS_CODE.OK).json({ name: user.fullname });
      } else {
        return res
          .status(STATUS_CODE.NOT_FOUND)
          .json({ message: "User not found" });
      }
    } catch (error) {
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  }
  // [POST] /login
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const findUser = await User.findOne({ email: email });
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
          .status(STATUS_CODE.OK)
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
        const client = await connectRedis();
        const subject = "Email Verification";
        const message = `Your OTP code is: ${otp}`;

        // sendEmail(email, subject, message);
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
      const client = await connectRedis();
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
    const client = await connectRedis();
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
      return res
        .status(STATUS_CODE.CREATED)
        .json({ message: "User successfully created" });
    } else {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: "Invalid OTP" });
    }
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const clientRedis = await connectRedis();
      const redisKey = `${FORGOT_PASSWORD_KEY}_${email}`;
      async function setOtp(key) {
        const otp = generateOTP();
        await clientRedis.set(key, otp);
        clientRedis.expire(key, OTP_EXPIRE);
        return otp;
      }

      const userRedis = JSON.parse(await clientRedis.get(redisKey));
      if (userRedis === null) {
        const userDb = await User.findOne({ email });
        if (userDb === null) {
          return res
            .status(STATUS_CODE.NOT_FOUND)
            .json({ message: "User not found" });
        } else {
          const otp = await setOtp(redisKey);
          console.log("OTP from DB");
          const subject = "Email Verification";
          const message = `Your OTP code is: ${otp}`;
          // const sendEmail = await sendEmail(email, subject, message);
          return res
            .status(STATUS_CODE.CREATED)
            .json({ message: "OTP successfully sent" });
        }
      } else {
        const otp = await setOtp(redisKey);
        console.log("OTP from Redis");

        const subject = "Email Verification";
        const message = `Your OTP code is: ${otp}`;
        // const sendEmail = await sendEmail(email, subject, message);
        return res
          .status(STATUS_CODE.CREATED)
          .json({ message: "OTP successfully sent" });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "An error occurred while sending OTP" });
    }
  }

  async resendRecoveryOtp(req, res) {
    const { email } = req.body;
    try {
      const redisKey = `${FORGOT_PASSWORD_KEY}_${email}`;
      const otp = generateOTP();
      console.log("resendRecoveryOtp: ", otp);
      const client = await connectRedis();
      const subject = "Email Verification";
      const message = `Your OTP code is: ${otp}`;

      // sendEmail(email, subject, message);
      const oldOtpValues = JSON.parse(await client.get(redisKey));
      if (oldOtpValues === null) {
        return res
          .status(STATUS_CODE.NOT_FOUND)
          .json({ message: "Register session has expired" });
      }
      const newOtpValues = {
        email: oldOtpValues.email,
        otp: otp,
      };
      await client.set(redisKey, JSON.stringify(newOtpValues));
      client.expire(redisKey, OTP_EXPIRE);
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
}

module.exports = new AuthController();
