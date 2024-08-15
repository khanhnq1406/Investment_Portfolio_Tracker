import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
const Home = () => {
  const { logoutUser } = useContext(AuthContext);
  return (
    <div>
      <h1>This is Home</h1>
      <button onClick={(e) => logoutUser()}>Logout</button>
    </div>
  );
};
export default Home;
