import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthContextProvider from "./contexts/AuthContext";
import Auth from "./views/Auth";
import Home from "./views/Home";
import ProtectedRoute from "./utils/ProtectedRoute";
import "./App.css";
function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Auth authRoute="login" />} />
          <Route path="/register" element={<Auth authRoute="register" />} />
          <Route
            path="/forgot-password"
            element={<Auth authRoute="forgot-password" />}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute redirectTo="/login">
                <Home />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthContextProvider>
  );
}

export default App;