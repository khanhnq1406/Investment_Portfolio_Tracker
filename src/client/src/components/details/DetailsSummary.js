import axios from "axios";
import { useEffect, useState } from "react";
import { store } from "../../redux/store";
import { socket } from "../../views/Details";
import { BACKEND_URL } from "../../utils/constants";

const DetailsSummary = (props) => {
  const [symbol, setSymbol] = useState("");
  const [price, setPrice] = useState();
  const [summaryData, setSummaryData] = useState(null);

  useEffect(() => {
    axios
      .get(
        `https://www.binance.com/bapi/composite/v1/public/marketing/tardingPair/detail?symbol=${props.id}`
      )
      .then((response) => {
        setSymbol(response.data.data[0].symbol);
      })
      .catch(console.error());

    const email = store.getState().addUserReducer.email;
    axios
      .get(`${BACKEND_URL}/fetch/details`, {
        params: { email: email, symbol: props.id },
      })
      .then((response) => {
        const data = response.data;
        setSummaryData(data);
      })
      .catch(console.error());

    socket.emit("getPrice", {
      currency: props.id,
    });

    const interval = setInterval(() => {
      socket.emit("getPrice", {
        currency: props.id,
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    socket.on("getPriceResponse", (price) => {
      setPrice(parseFloat(Number(price)));
    });
  }, [socket]);

  useEffect(() => {
    if (summaryData !== null) {
      const holdingValue = parseFloat(
        (Number(price) * Number(summaryData.holdingQuantity)).toFixed(2)
      );
      const profit = parseFloat(
        (Number(holdingValue) - Number(summaryData.totalCost)).toFixed(2)
      );
      setSummaryData((prev) => {
        const current = {
          ...prev,
          profit: profit,
          holdingValue: holdingValue,
        };
        return current;
      });
    }
  }, [price]);
  return (
    <div className="details-summary">
      <div className="coin-name">
        <p className="symbol">{symbol}</p>
        <p className="pair-symbol">{props.id}</p>
      </div>
      <div className="detail-price">${price}</div>
      {summaryData !== null ? (
        <div className="details-grid-container">
          <div className="holding-value">
            <div className="value">${summaryData.holdingValue}</div>
            <div className="title">Holding Value</div>
          </div>
          <div className="holding-quantity">
            <div className="value">{summaryData.holdingQuantity}</div>
            <div className="title">Holding Quantity</div>
          </div>
          <div className="total-cost">
            <div className="value">${summaryData.totalCost}</div>
            <div className="title">Total Cost</div>
          </div>
          <div className="average-cost">
            <div className="value">${summaryData.avgCost}</div>
            <div className="title">Average Net Cost</div>
          </div>
          <div className="total-profit">
            <div
              className="value"
              style={{
                color:
                  Number(summaryData.profit) > 0
                    ? "#00A445"
                    : Number(summaryData.profit) < 0
                    ? "#C3151C"
                    : "#F5F7FD",
              }}
            >
              ${summaryData.profit}
            </div>
            <div className="title">Total Profit / Loss</div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default DetailsSummary;
