export const REGISTER_STATE = Object.freeze({
  Register: 1,
  OTP: 2,
  Success: 3,
});

export const RECOVERY_PASS_STATE = Object.freeze({
  Input: 1,
  OTP: 2,
  CreateNewPassword: 3,
  Success: 4,
});

export const STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const LOCAL_STORAGE_TOKEN_NAME = "token";

export const BACKEND_URL = "http://localhost:5000";

export default REGISTER_STATE;
