import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import Loading from "../components/layout/Loading";
const Auth = ({ authRoute }) => {
  const {
    authState: { authLoading, isAuthenticated },
  } = useContext(AuthContext);

  let body;
  if (authLoading)
    body = (
      <div>
        <Loading display="flex" />
      </div>
    );
  else if (isAuthenticated) return <Navigate to="/" />;
  else
    body = (
      <>
        {authRoute === "login" && <LoginForm />}
        {authRoute === "register" && <RegisterForm />}
        {authRoute === "forgot-password" && <ForgotPasswordForm />}
      </>
    );
  return body;
};
export default Auth;
