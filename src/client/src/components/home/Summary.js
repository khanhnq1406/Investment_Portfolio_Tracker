import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import axios from "axios";
import Holdings from "./Holdings";
import Performance from "./Performance";
import "./Summary.css";
import { BACKEND_URL } from "../../utils/constants";
import { store } from "../../redux/store";
import { addSummaryData } from "../../redux/actions";

const socket = io.connect(BACKEND_URL);

const Summary = () => {
  const [data, setData] = useState({});
  useEffect(() => {
    const email = store.getState().addUserReducer.email;

    (async () => {
      const response = await axios.get(`${BACKEND_URL}/fetch/summary`, {
        params: { email: email },
      });
      const totalProfit =
        Number(response.data.currentBalance) -
        Number(response.data.totalInvested);
      setData({
        ...response.data,
        totalProfit: Math.floor(totalProfit * 100) / 100,
      });
      store.dispatch(
        addSummaryData({
          ...response.data,
          totalProfit: Math.floor(totalProfit * 100) / 100,
        })
      );
    })().catch(console.error);

    const interval = setInterval(() => {
      socket.emit("getPrice", {
        email: email,
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    socket.on("getPriceResponse", (data) => {
      const totalProfit =
        Number(data.currentBalance) - Number(data.totalInvested);
      setData({
        ...data,
        totalProfit: Math.floor(totalProfit * 100) / 100,
      });
      store.dispatch(
        addSummaryData({
          ...data,
          totalProfit: Math.floor(totalProfit * 100) / 100,
        })
      );
    });
  }, [socket]);
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
          <div className="value">
            ${Math.floor(Number(data.totalInvested) * 100) / 100}
          </div>
          <div className="title">Total Invested</div>
        </div>
        <div className="current-balance">
          <div className="value">
            ${Math.floor(Number(data.currentBalance) * 100) / 100}
          </div>
          <div className="title">Current Balance</div>
        </div>
        <div className="profit-lost">
          {Number(data.totalProfit) > 0 ? (
            <div className="value" style={{ color: "#00A445" }}>
              +${data.totalProfit}
            </div>
          ) : Number(data.totalProfit) < 0 ? (
            <div className="value" style={{ color: "#C3151C" }}>
              -${data.totalProfit}
            </div>
          ) : (
            <div className="value">{data.totalProfit}</div>
          )}
          <div className="title">Total Profit / Lost</div>
        </div>
        <div className="portfolio-change">
          <div className="value">Coming Soon</div>
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
