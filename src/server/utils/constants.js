const STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const OTP_EXPIRE = 60;

const FORGOT_PASSWORD_KEY = "forgotPassword";

const os = require("os")
console.log(os.type());
const DOCKER_HOST = os.type() === "Linux" ? "172.18.0.1": "host.docker.internal"

exports.STATUS_CODE = STATUS_CODE;
exports.OTP_EXPIRE = OTP_EXPIRE;
exports.FORGOT_PASSWORD_KEY = FORGOT_PASSWORD_KEY;
exports.DOCKER_HOST = DOCKER_HOST;