import { useReducer, useEffect, createContext } from "react";
import { LOCAL_STORAGE_TOKEN_NAME, STATUS_CODE } from "../utils/constants";
import setAuthTokenHeader from "../utils/setHeaderToken";
import { authReducer } from "./AuthReducer";
import axios from "axios";
export const AuthContext = createContext();
const AuthContextProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, {
    authLoading: true,
    isAuthenticated: false,
    user: null,
  });
  const loadUser = async () => {
    if (localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME)) {
      setAuthTokenHeader(localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME));
    }
    try {
      const response = await axios.get("http://localhost:5000/auth/");

      if (response.status === STATUS_CODE.OK) {
        dispatch({
          type: "SET_AUTH",
          payload: {
            authLoading: false,
            isAuthenticated: true,
            user: response.data.name,
          },
        });
      }
    } catch (error) {
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
      setAuthTokenHeader(null);
      dispatch({
        type: "SET_AUTH",
        payload: { isAuthenticated: false, user: null },
      });
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // Login
  const loginUser = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        email: email,
        password: password,
      });
      if (response.status === STATUS_CODE.OK) {
        localStorage.setItem(
          LOCAL_STORAGE_TOKEN_NAME,
          response.data.accessToken
        );
        await loadUser();

        return { status: STATUS_CODE.OK, message: null };
      }
    } catch (error) {
      console.log(error);
      const status = error.response.status;
      if (
        status === STATUS_CODE.BAD_REQUEST ||
        status === STATUS_CODE.NOT_FOUND
      ) {
        const elementMessage = (
          <div className="error-msg">{error.response.data.message}</div>
        );
        return { status: STATUS_CODE.BAD_REQUEST, message: elementMessage };
      }
    }
  };

  // Logout
  const logoutUser = async () => {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
    dispatch({
      type: "SET_AUTH",
      payload: { isAuthenticated: false, user: null },
    });
  };

  // Context data
  const authContextData = { loginUser, logoutUser, authState };

  // Return provider
  return (
    <AuthContext.Provider value={authContextData}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContextProvider;
