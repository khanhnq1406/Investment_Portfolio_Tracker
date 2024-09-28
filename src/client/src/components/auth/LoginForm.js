import { STATUS_CODE } from "../../utils/constants";

import { AuthContext } from "../../contexts/AuthContext";
import "./AuthForm.css";

import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../layout/Loading";
import { hideLoading, unhideLoading } from "../../utils/SetLoading";

const LoginForm = () => {
  const { loginUser } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const loadingContainer =
    document.getElementsByClassName("loading-container")[0];
  async function handleSubmitLogin(event) {
    event.preventDefault();
    const email = event.target["email"].value;
    const password = event.target["password"].value;
    document.getElementsByClassName("loading-container")[0].style.display =
      "flex";
    const response = await loginUser(email, password);
    if (response.status !== STATUS_CODE.OK) {
      document.getElementsByClassName("loading-container")[0].style.display =
        "none";
      setErrorMessage(response.message);
    } else {
      document.getElementsByClassName("loading-container")[0].style.display =
        "none";
    }
  }
  const redirectToRegister = () => {
    navigate("/register");
  };

  const redirectToForgotPassword = () => {
    navigate("/forgot-password");
  };
  return (
    <div className="wrapper">
      <Loading />
      <div className="container login">
        <div className="form login">
          <div className="title">Login to continue</div>
          <form onSubmit={handleSubmitLogin}>
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
            {errorMessage}
            <div className="form-group submit">
              <input type="submit" value="Login"></input>
            </div>
          </form>
          <div className="login-redirect forgot-password">
            <a onClick={redirectToForgotPassword}>Forgot Password</a>
          </div>
          <div className="login-redirect">
            New here? <a onClick={redirectToRegister}>Sign up now</a>
          </div>
        </div>
        <div className="image login">
          <img src="resources/login_stock_image.png" alt="" />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
