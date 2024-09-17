import { useParams } from "react-router";
import Navbar from "../components/layout/Navbar";

const Details = () => {
  const { id } = useParams();
  return (
    <div className="transaction-details">
      <Navbar />
      <hr className="navbar-line" />
      <div className="details-container"></div>
    </div>
  );
};
export default Details;
