import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import "../components/css/Home.css";
import { store } from "../redux/store";

import Navbar from "../components/layout/Navbar";
const Home = () => {
  const { logoutUser } = useContext(AuthContext);
  console.log(store.getState());
  return (
    <div className="home">
      <Navbar />
      <hr className="navbar-line"/>
    </div>
  );
};
export default Home;
