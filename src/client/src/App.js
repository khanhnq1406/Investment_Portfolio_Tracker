import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegisterForm from "./components/auth/RegisterForm";
import "./App.css";
function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/register" element={<RegisterForm />} />
      </Routes>
    </Router>
  );
}

export default App;
