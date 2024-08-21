import {
  RECOVERY_PASS_STATE,
  STATUS_CODE,
  BACKEND_URL,
} from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const ForgotPasswordForm = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [recoveryState, setRecoveryState] = useState(RECOVERY_PASS_STATE.Input);
  const [recoveryInfo, setRecoveryInfo] = useState(null);
  const navigate = useNavigate();

  async function handleSubmitEmail(event) {
    event.preventDefault();
    const email = event.target["email"].value;
    console.log("Debug");
    try {
      const response = await axios.post(`${BACKEND_URL}/auth/forgotPassword`, {
        email: email,
      });
      if (response.status === STATUS_CODE.CREATED) {
        setRecoveryInfo({ email: email });
        setRecoveryState(RECOVERY_PASS_STATE.OTP);
        setErrorMessage("");
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === STATUS_CODE.NOT_FOUND) {
        const elementMessage = (
          <div className="error-msg">{error.response.data.message}</div>
        );
        return setErrorMessage(elementMessage);
      }
    }
  }

  const handleSubmitOtp = async (event) => {
    event.preventDefault();
    const otp = event.target["otp"].value;
    try {
      const response = await axios.post(`${BACKEND_URL}/auth/verifyRecoveryOtp`, {
        otp: otp,
        email: recoveryInfo.email,
      });
      if (response.status === STATUS_CODE.OK) {
        setRecoveryState(RECOVERY_PASS_STATE.CreateNewPassword);
        setErrorMessage(null);
      }
    } catch (error) {
      if (error.response.status === STATUS_CODE.NOT_FOUND) {
        const message =
          "Your recovery password session has expired. Please refresh the page";
        const elementMessage = <div className="error-msg">{message}</div>;
        setErrorMessage(elementMessage);
      } else if (error.response.status === STATUS_CODE.BAD_REQUEST) {
        const message = "Invalid OTP! Please retry";
        const elementMessage = <div className="error-msg">{message}</div>;
        setErrorMessage(elementMessage);
      }
      else {
        const message = "The server cannot be reached, please try again.";
        const elementMessage = <div className="error-msg">{message}</div>;
        setErrorMessage(elementMessage);
      }
    }
  };
  async function handleResendOtp(event) {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${BACKEND_URL}/auth/resendRecoveryOtp`,
        {
          email: recoveryInfo.email,
        }
      );
      if (response.status === STATUS_CODE.CREATED) {
        const message = "The OTP is re-sent to your email";
        const elementMessage = (
          <div className="error-msg notification">{message}</div>
        );
        setErrorMessage(elementMessage);
      }
    } catch (error) {
      if (error.response.status === STATUS_CODE.NOT_FOUND) {
        const message =
          "Your recovery password session has expired. Please refresh the page";
        const elementMessage = (
          <div className="error-msg" style={{ textAlign: "center" }}>
            {message}
          </div>
        );
        setErrorMessage(elementMessage);
      } else {
        const elementMessage = (
          <div className="error-msg" style={{ textAlign: "center" }}>
            {error.response.data.message}
          </div>
        );
        return setErrorMessage(elementMessage);
      }
    }
  }
  const handleSubmitPassword = async (event) => {
    event.preventDefault();
    const password = event.target["password"].value;
    const retype = event.target["retype"].value;
    // Password validation
    if (password.length < 6) {
      const message = "Password length must be at least 6 characters";
      const elementMessage = <div className="error-msg">{message}</div>;
      return setErrorMessage(elementMessage);
    } else if (password !== retype) {
      const message = "Passwords do not match";
      const elementMessage = <div className="error-msg">{message}</div>;
      return setErrorMessage(elementMessage);
    }
    try {
      const response = await axios.post(`${BACKEND_URL}/auth/createNewPassword`,
      {
        email: recoveryInfo.email,
        password: password
      })
      if (response.status === STATUS_CODE.CREATED) {
        setRecoveryState(RECOVERY_PASS_STATE.Success);
      }
    } catch (error) {
      if (error.response.status === STATUS_CODE.NOT_FOUND) {
        const message =
          "Your recovery password session has expired. Please refresh the page";
        const elementMessage = <div className="error-msg">{message}</div>;
        setErrorMessage(elementMessage);
      } else if (error.response.status === STATUS_CODE.BAD_REQUEST) {
        const message = "Unable to reset password. Please try again";
        const elementMessage = <div className="error-msg">{message}</div>;
        setErrorMessage(elementMessage);
      }
      else {
        const message = "The server cannot be reached, please try again.";
        const elementMessage = <div className="error-msg">{message}</div>;
        setErrorMessage(elementMessage);
      }
    }
  };
  const redirectToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="wrapper">
      {recoveryState === RECOVERY_PASS_STATE.Input ? (
        <div className="container login">
          <div className="form recovery">
            <div className="title">Forgot Password?</div>
            <form onSubmit={handleSubmitEmail}>
              <div className="form-group email">
                <div>
                  Email<span className="required">*</span>
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  required={true}
                ></input>
              </div>
              {errorMessage}
              <div className="form-group submit">
                <input type="submit" value="Send Recovery Code"></input>
              </div>
            </form>
            <div className="login-redirect">
              Remember password? <a onClick={redirectToLogin}>Login</a>
            </div>
          </div>
          <div className="image login">
            <img src="resources/forgot.png" alt="" />
          </div>
        </div>
      ) : recoveryState === RECOVERY_PASS_STATE.OTP ? (
        <div className="container login">
          <div className="form recovery">
            <div className="title">OTP Verification</div>
            <div>Please enter the OTP sent to your email</div>
            <form onSubmit={handleSubmitOtp}>
              <div className="form-group otp">
                <input type="text" name="otp" maxLength={6}></input>
              </div>
              <div className="form-group submit">
                <input type="submit" value="Submit"></input>
              </div>
            </form>
            <div className="login-redirect otp">
              Didn't receive an OTP? <a onClick={handleResendOtp}>Resend OTP</a>
            </div>
            {errorMessage}
          </div>
          <div className="image login">
            <img src="resources/forgot.png" alt="" />
          </div>
        </div>
      ) : recoveryState === RECOVERY_PASS_STATE.CreateNewPassword ? (
        <div className="container login">
          <div className="form recovery">
            <div className="title">Create New Password</div>
            <form onSubmit={handleSubmitPassword}>
              <div className="form-group password">
                <div>
                  New Password<span className="required">*</span>
                </div>
                <input
                  type="password"
                  placeholder="Enter your password"
                  name="password"
                  required={true}
                ></input>
              </div>
              <div className="form-group retype">
                <div>
                  Retype New Password<span className="required">*</span>
                </div>
                <input
                  type="password"
                  placeholder="Retype your password"
                  name="retype"
                  required={true}
                ></input>
              </div>
              {errorMessage}
              <div className="form-group submit">
                <input type="submit" value="Continue"></input>
              </div>
            </form>
            <div className="login-redirect">
              Remember password? <a onClick={redirectToLogin}>Login</a>
            </div>
          </div>
          <div className="image login">
            <img src="resources/forgot.png" alt="" />
          </div>
        </div>
      ) : (
        <div className="container login">
          <div className="form success">
            <div className="title">Password Changed!</div>
            <div>
              Congratulations, your password has been successfully changed.{" "}
              <br></br>
              <br></br>
              Please login to access the website
            </div>
            <button onClick={redirectToLogin}>Go to login</button>
          </div>
          <div className="image checked">
            <img src="resources/checked.png" alt="" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
