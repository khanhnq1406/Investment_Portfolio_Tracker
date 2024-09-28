import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Loading from "../components/layout/Loading";

const ProtectedRoute = ({ children, redirectTo }) => {
  const {
    authState: { authLoading, isAuthenticated },
  } = useContext(AuthContext);

  if (authLoading)
    return (
      <div>
        <Loading display="flex" />
      </div>
    );

  return isAuthenticated ? children : <Navigate to={redirectTo} />;
};

export default ProtectedRoute;
