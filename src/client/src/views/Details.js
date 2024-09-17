import "../components/details/Details.css";
import { useParams } from "react-router";
import Navbar from "../components/layout/Navbar";
import DetailsSummary from "../components/details/DetailsSummary";
import { BACKEND_URL } from "../utils/constants";
import { io } from "socket.io-client";

export const socket = io.connect(BACKEND_URL);
const Details = () => {
  const { id } = useParams();
  return (
    <div className="transaction-details">
      <Navbar />
      <hr className="navbar-line" />
      <div className="details-container">
        <DetailsSummary id={id} />
      </div>
    </div>
  );
};
export default Details;
