import "./css/RegisterForm.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  function handleSubmitLogin(event) {
    event.preventDefault();
    const email = event.target["email"].value;
    const password = event.target["password"].value;
  }
  const redirectToRegister = () => {
    navigate("/register");
  };

  const redirectToForgotPassword = () => {
    navigate("/forgot-password");
  };
  return (
    <div className="wrapper">
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
