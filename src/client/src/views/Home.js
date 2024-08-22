import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import "../components/css/Home.css";

import Navbar from "../components/layout/Navbar";
const Home = () => {
  const { logoutUser } = useContext(AuthContext);
  return (
    <div className="home">
      <Navbar />
    </div>
  );
};
export default Home;
