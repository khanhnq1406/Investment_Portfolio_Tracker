const RegisterState = Object.freeze({
  Register: 1,
  OTP: 2,
  Success: 3,
});
const STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export default RegisterState;

export { STATUS_CODE };
