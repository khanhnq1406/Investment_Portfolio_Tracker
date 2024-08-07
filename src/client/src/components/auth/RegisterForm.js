import "./css/RegisterForm.css";
import { useState } from "react";
import axios from "axios";
const bcrypt = require("bcryptjs");

const RegisterForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
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
    const saltRounds = 10;
    const hashedPasword = await bcrypt.hash(password, saltRounds);
    console.log(hashedPasword);
    try {
      const response = await axios.post("http://localhost:5000/register", {
        name: name,
        email: email,
        password: password,
      });
      if (response.status === 201) {
        setErrorMessage("");
      }
      console.log(response);
    } catch (error) {
      console.log(error);
      if (error.response.status === 400) {
        const elementMessage = (
          <div className="error-msg">{error.response.data.message}</div>
        );
        return setErrorMessage(elementMessage);
      }
    }
  }
  return (
    <div className="wrapper">
      <div className="container register">
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
            Already a member? <a href="#">Login</a>
          </div>
        </div>
        <div className="image register">
          <img src="resources/signup_stock_image.png" alt="" />
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
