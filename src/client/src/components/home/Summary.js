import { io } from "socket.io-client";
import { useEffect } from "react";
import axios from "axios";
import Holdings from "./Holdings";
import Performance from "./Performance";
import "./Summary.css";
import { BACKEND_URL } from "../../utils/constants";
import { store } from "../../redux/store";

const socket = io.connect(BACKEND_URL);

const Summary = () => {
  useEffect(() => {
    const email = store.getState().addUserReducer.email;

    (async () => {
      const response = await axios.get(`${BACKEND_URL}/fetch/summary`, {
        params: { email: email },
      });
      console.log(response);
      return response;
    })().catch(console.error);

    const interval = setInterval(() => {
      socket.emit("getPrice", {
        email: email,
      });
    }, 50000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="summary">
      <div className="title">
        <div className="content">My Portfolio</div>
        <button>
          <img src="icon/plus.png" />
          <div>Add coin</div>
        </button>
      </div>

      <div className="grid-container">
        <div className="total-invested">
          <div className="value">$23,800.05</div>
          <div className="title">Total Invested</div>
        </div>
        <div className="current-balance">
          <div className="value">$50,653.71</div>
          <div className="title">Current Balance</div>
        </div>
        <div className="profit-lost">
          <div className="value">+$26,853.66</div>
          <div className="title">Total Profit / Lost</div>
        </div>
        <div className="portfolio-change">
          <div className="value">+$619.37</div>
          <div className="title">24h Portfolio Change</div>
        </div>
        <div className="holdings">
          <Holdings />
        </div>
        <div className="performance">
          <Performance />
        </div>
      </div>
    </div>
  );
};

export default Summary;
