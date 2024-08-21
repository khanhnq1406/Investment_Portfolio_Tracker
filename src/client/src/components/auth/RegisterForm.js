import "./css/AuthForm.css";
import {
  STATUS_CODE,
  REGISTER_STATE,
  BACKEND_URL,
} from "../../utils/constants";

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [registerState, setRegisterState] = useState(REGISTER_STATE.Register);
  const [registerData, setRegisterData] = useState(null);
  const navigate = useNavigate();

  async function handleSubmitRegister(event) {
    event.preventDefault();
    const name = event.target["name"].value;
    const email = event.target["email"].value;
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

    // Email validation
    try {
      const response = await axios.post(`${BACKEND_URL}/auth/register`, {
        name: name,
        email: email,
        password: password,
      });
      if (response.status === STATUS_CODE.CREATED) {
        setRegisterData({ name: name, email: email, password: password });
        setRegisterState(REGISTER_STATE.OTP);
        setErrorMessage("");
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === STATUS_CODE.BAD_REQUEST) {
        const elementMessage = (
          <div className="error-msg">{error.response.data.message}</div>
        );
        return setErrorMessage(elementMessage);
      }
    }
  }

  async function handleResendOtp(event) {
    event.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL}/auth/resendOtp`, {
        email: registerData.email,
      });
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
          "Your register session has expired. Please refresh the page";
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

  async function handleSubmitOtp(event) {
    event.preventDefault();
    const otp = event.target["otp"].value;
    try {
      const response = await axios.post(`${BACKEND_URL}/auth/verifyOtp`, {
        otp: otp,
        email: registerData.email,
      });
      if (response.status === STATUS_CODE.CREATED) {
        setRegisterState(REGISTER_STATE.Success);
      }
    } catch (error) {
      if (error.response.status === STATUS_CODE.NOT_FOUND) {
        const message =
          "Your register session has expired. Please refresh the page";
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
  }

  const redirectToLogin = () => {
    navigate("/login");
  };
  return (
    <div className="wrapper">
      <div className="container register">
        {registerState === REGISTER_STATE.Register ? (
          <div className="form register">
            <div className="title">Create new account</div>
            <form onSubmit={handleSubmitRegister}>
              <div className="form-group name">
                <div>
                  Name<span className="required">*</span>
                </div>
                <input
                  type="text"
                  placeholder="Enter your name"
                  name="name"
                  required={true}
                ></input>
              </div>
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
              <div className="form-group password">
                <div>
                  Password<span className="required">*</span>
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
                  Retype Password<span className="required">*</span>
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
                <input type="submit" value="Register"></input>
              </div>
            </form>
            <div className="login-redirect">
              Already a member? <a onClick={redirectToLogin}>Login</a>
            </div>
          </div>
        ) : registerState === REGISTER_STATE.OTP ? (
          <div className="form register">
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
        ) : (
          <div className="form success">
            <div className="title">Success!</div>
            <div>
              Congratulations, your account has been successfully created.{" "}
              <br></br>
              <br></br>
              Please login to access the website
            </div>
            <button onClick={redirectToLogin}>Go to login</button>
          </div>
        )}
        <div className="image register">
          <img src="resources/signup_stock_image.png" alt="" />
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
