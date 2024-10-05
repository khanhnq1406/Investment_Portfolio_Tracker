require("dotenv").config();

const STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

exports.STATUS_CODE = STATUS_CODE;

const OTP_EXPIRE = 60;
exports.OTP_EXPIRE = OTP_EXPIRE;

const FORGOT_PASSWORD_KEY = "forgotPassword";
exports.FORGOT_PASSWORD_KEY = FORGOT_PASSWORD_KEY;

const os = require("os");
const DOCKER_HOST =
  os.type() === "Linux" ? "172.18.0.1" : "host.docker.internal";
exports.DOCKER_HOST = DOCKER_HOST;

const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const MONGODB_ADDRESS = process.env.MONGODB_ADDRESS;
const MONGODB_URI = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_ADDRESS}`;
exports.MONGODB_URI = MONGODB_URI;

const COLLECTION = {
  USER: "users",
  HOLDING: "CoinHolding",
  TRANSACTION: "Transaction",
};
exports.COLLECTION = COLLECTION;

const CRYPTO_PRICE_URL = "https://api.binance.com/api/v1/ticker/price?symbol=";
exports.CRYPTO_PRICE_URL = CRYPTO_PRICE_URL;

const REDIS_URL =
  process.env.NODE_ENV === "development"
    ? `redis://${DOCKER_HOST}:6379`
    : process.env.REDIS_URL;
exports.REDIS_URL = REDIS_URL;

const SOCKET =
  process.env.NODE_ENV === "development"
    ? `http://localhost:3000`
    : `${process.env.CLIENT_HOST}`;
exports.SOCKET = SOCKET;

const EDIT_TYPE = {
  HOLDING_QUANTITY: 3,
  TOTAL_COST: 4,
  AVG_COST: 5,
};
exports.EDIT_TYPE = EDIT_TYPE;
