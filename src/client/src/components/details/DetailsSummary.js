import axios from "axios";
import { useEffect, useState } from "react";
import { store } from "../../redux/store";
import { socket } from "../../views/Details";
import { BACKEND_URL, EDIT_TYPE } from "../../utils/constants";
import EditData from "../layout/EditData";

const DetailsSummary = (props) => {
  const [symbol, setSymbol] = useState("");
  const [price, setPrice] = useState();
  const [summaryData, setSummaryData] = useState(null);
  const [editBox, setEditBox] = useState();

  useEffect(() => {
    fetch(
      `https://www.binance.com/bapi/composite/v1/public/marketing/tardingPair/detail?symbol=${props.id}`
    )
      .then(async (response) => {
        const json = await response.json();
        setSymbol(json.data[0].symbol);
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

    fetch(`https://www.binance.com/api/v3/ticker/price?symbol=${props.id}USDT`)
      .then(async (response) => {
        const json = await response.json();
        setPrice(parseFloat(Number(json.price)));
      })
      .catch(console.error());
    // socket.emit("getPrice", {
    //   currency: props.id,
    // });

    // const interval = setInterval(() => {
    //   socket.emit("getPrice", {
    //     currency: props.id,
    //   });
    // }, 10000);
    // return () => clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   socket.on("getPriceResponse", (price) => {
  //     setPrice(parseFloat(Number(price)));
  //   });
  // }, [socket]);

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

  const closeEditBox = () => {
    setEditBox();
  };
  const handleEditBox = (event, type) => {
    let value = 0;
    switch (type) {
      case EDIT_TYPE.HOLDING_QUANTITY:
        value = summaryData.holdingQuantity;
        break;
      case EDIT_TYPE.TOTAL_COST:
        value = summaryData.totalCost;
        break;
      case EDIT_TYPE.AVG_COST:
        value = summaryData.avgCost;
        break;
      default:
        break;
    }
    setEditBox(
      <EditData
        type={type}
        payload={{ value: value, symbol: props.id }}
        close={closeEditBox}
      />
    );
  };
  return (
    <div className="details-summary">
      {editBox}
      <div className="coin-name">
        <p className="symbol">{symbol}</p>
        <p className="pair-symbol">{props.id}</p>
      </div>
      <div className="detail-price">${price}</div>
      {summaryData !== null ? (
        <div className="details-grid-container">
          <div className="holding-value">
            <div className="value">
              ${parseFloat(Number(summaryData.holdingValue).toFixed(2))}
            </div>
            <div className="title">Holding Value</div>
          </div>
          <div className="holding-quantity">
            <button
              className="edit-btn"
              onClick={(e) => handleEditBox(e, EDIT_TYPE.HOLDING_QUANTITY)}
            >
              <img src="/icon/editing.png" />
            </button>
            <div className="value">
              {parseFloat(Number(summaryData.holdingQuantity).toFixed(8))}
            </div>
            <div className="title">Holding Quantity</div>
          </div>
          <div className="total-cost">
            <button
              className="edit-btn"
              onClick={(e) => handleEditBox(e, EDIT_TYPE.TOTAL_COST)}
            >
              <img src="/icon/editing.png" />
            </button>
            <div className="value">
              ${parseFloat(Number(summaryData.totalCost).toFixed(2))}
            </div>
            <div className="title">Total Cost</div>
          </div>
          <div className="average-cost">
            <button
              className="edit-btn"
              onClick={(e) => handleEditBox(e, EDIT_TYPE.AVG_COST)}
            >
              <img src="/icon/editing.png" />
            </button>
            <div className="value">
              ${parseFloat(Number(summaryData.avgCost).toFixed(2))}
            </div>
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
