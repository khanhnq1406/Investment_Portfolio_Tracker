import "./AddTransaction.css";
import {
  ADD_TRANSACTION_STATE,
  BACKEND_URL,
  STATUS_CODE,
} from "../../utils/constants";
import axios from "axios";
import { useState } from "react";
import Loading from "./Loading";
import { hideLoading, unhideLoading } from "../../utils/SetLoading";
const EditTransaction = ({ closeEditBox, payload }) => {
  const [cryptoPrice, setCryptoPrice] = useState(payload.price);
  const [payloadState, setPayloadState] = useState(payload);
  const [addTransactionState, setAddTransactionState] = useState(
    ADD_TRANSACTION_STATE.Input
  );
  const loadingContainer =
    document.getElementsByClassName("loading-container")[0];
  async function handleAddTransaction(event) {
    event.preventDefault();
    unhideLoading(loadingContainer);
    const coinName = event.target["coin"].value;
    const total = event.target["total"].value;
    const quantity = event.target["quantity"].value;
    const price = event.target["price"].value;
    let datetime = event.target["datetime"].value;
    const type = event.target["type"].value;
    if (datetime === "") {
      const now = new Date();
      const year = now.getFullYear();
      const month =
        now.getMonth() + 1 > 10
          ? now.getMonth() + 1
          : "0" + (now.getMonth() + 1);
      const date = now.getDate() > 10 ? now.getDate() : "0" + now.getDate();
      const hour = now.getHours();
      const minute =
        now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
      datetime = year + "-" + month + "-" + date;
      datetime += "T" + hour + ":" + minute;
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/transaction/edit`, {
        _id: payload.id,
        coinName: coinName,
        cost: total,
        quantity: quantity,
        price: price,
        datetime: datetime,
        type: type, // 'buy' or 'sell'
      });
      if (response.status === STATUS_CODE.OK) {
        // setAddTransactionState(ADD_TRANSACTION_STATE.Success);
        hideLoading(loadingContainer);
        console.log(response);
        window.location.reload();
      }
    } catch (error) {
      hideLoading(loadingContainer);
      alert("Failed to edit transaction. Please try again.");
    }
  }

  async function getPriceFromMarket(event) {
    event.preventDefault();
    const url = `https://api.binance.com/api/v1/ticker/price?symbol=${payloadState.symbol}USDT`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      const price = data.price;
      setCryptoPrice(price);
    } catch (error) {
      alert("Failed to load coin price. Please try again.");
    }
  }

  function handleChangeCryptoPrice(event) {
    setCryptoPrice(event.target.value);
  }
  return (
    <div className="add-transaction-container" style={{ display: "flex" }}>
      <Loading />
      {addTransactionState === ADD_TRANSACTION_STATE.Input ? (
        <div className="transaction-popup">
          <button
            className="close-btn"
            onClick={(e) => {
              closeEditBox();
            }}
          >
            <img src="/icon/cross.png" />
          </button>

          <div className="transaction-title">Edit Transaction</div>

          <form className="transaction-form" onSubmit={handleAddTransaction}>
            <div className="form-group coin">
              <div>Select coin</div>
              <input
                type="text"
                name="coin"
                value={payloadState.symbol}
                onChange={(e) => {
                  setPayloadState((prev) => {
                    return { ...prev, symbol: e.target.value };
                  });
                }}
                required
              ></input>
            </div>
            <div className="form-group total-spent">
              <div>Total spent (USD)</div>
              <input
                type="text"
                name="total"
                value={payloadState.cost}
                onChange={(e) => {
                  setPayloadState((prev) => {
                    return { ...prev, cost: e.target.value };
                  });
                }}
                required
              ></input>
            </div>
            <div className="form-group quantity">
              <div>Quantity</div>
              <input
                type="text"
                name="quantity"
                value={payloadState.quantity}
                onChange={(e) => {
                  setPayloadState((prev) => {
                    return { ...prev, quantity: e.target.value };
                  });
                }}
                required
              ></input>
            </div>
            <div className="form-group price-per-coin">
              <div>
                Price per coin (USD){" "}
                <a href="#" onClick={getPriceFromMarket}>
                  Use Market
                </a>
              </div>
              <input
                type="text"
                name="price"
                value={cryptoPrice}
                onChange={handleChangeCryptoPrice}
                required
              ></input>
            </div>
            <div className="form-group date-time">
              <div>Date & Time</div>
              <input
                type="datetime-local"
                name="datetime"
                value={payloadState.datetime}
                onChange={(e) => {
                  setPayloadState((prev) => {
                    return { ...prev, datetime: e.target.value };
                  });
                }}
              ></input>
            </div>
            <div className="form-group type">
              <div>Type</div>
              <select
                name="type"
                value={payloadState.type}
                onChange={(e) => {
                  setPayloadState((prev) => {
                    return { ...prev, type: e.target.value };
                  });
                }}
              >
                <option>Buy</option>
                <option>Sell</option>
              </select>
            </div>
            <div className="form-group submit">
              <input
                type="submit"
                value="Edit Transaction"
                className="buy"
                style={{ marginRight: "0" }}
              ></input>
            </div>
          </form>
        </div>
      ) : (
        <div className="transaction-popup">
          <div className="form success">
            <div className="title">Success!</div>
            <div>
              Congratulations, the transaction has been successfully added.{" "}
            </div>
            <button
              onClick={(e) => {
                window.location.reload();
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditTransaction;
