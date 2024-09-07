import "./AddTransaction.css";
import { useState } from "react";
import { store } from "../../redux/store";
import { unhideAddTransaction } from "../../redux/actions";
const AddTransaction = () => {
  const [transactionInfo, setTransactionInfo] = useState(
    store.getState().addTransactionDisplayReducer
  );
  const [cryptoPrice, setCryptoPrice] = useState(null);
  store.subscribe(() => {
    setTransactionInfo(store.getState().addTransactionDisplayReducer);
  });

  function handleAddTransaction(event) {
    event.preventDefault();
    const coinName = event.target["coin"].value;
    const total = event.target["total"].value;
    const quantity = event.target["quantity"].value;
    const price = event.target["price"].value;
    const datetime = event.target["datetime"].value;
    const submitButton = event.nativeEvent.submitter.name;

    console.log(coinName, total, quantity, price, datetime, submitButton);
  }

  async function getPriceFromMarket(event) {
    event.preventDefault();
    const url = `https://api.binance.com/api/v1/ticker/price?symbol=${transactionInfo.cryptoName}USDT`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      const price = data.price;
      setCryptoPrice(price);
    } catch (error) {
      alert("Failed to load coin price. Please try again.");
    }
  }

  return (
    <div
      className="add-transaction-container"
      style={{ display: `${transactionInfo.display}` }}
    >
      <div className="transaction-popup">
        <button
          className="close-btn"
          onClick={(e) => {
            store.dispatch(unhideAddTransaction());
            setCryptoPrice("");
          }}
        >
          <img src="icon/cross.png" />
        </button>

        <div className="transaction-title">Add Transaction</div>

        <form className="transaction-form" onSubmit={handleAddTransaction}>
          <div className="form-group coin">
            <div>Select coin</div>
            <input
              type="text"
              name="coin"
              value={transactionInfo.cryptoName}
              onChange={(event) => {
                setTransactionInfo((currentTransactionInfo) => ({
                  ...currentTransactionInfo,
                  cryptoName: event.target.value,
                }));
              }}
            ></input>
          </div>
          <div className="form-group total-spent">
            <div>Total spent (USD)</div>
            <input type="text" name="total"></input>
          </div>
          <div className="form-group quantity">
            <div>Quantity</div>
            <input type="text" name="quantity"></input>
          </div>
          <div className="form-group price-per-coin">
            <div>
              Price per coin (USD){" "}
              <a href="#" onClick={getPriceFromMarket}>
                Use Market
              </a>
            </div>
            <input type="text" name="price" value={cryptoPrice}></input>
          </div>
          <div className="form-group date-time">
            <div>Date & Time</div>
            <input type="datetime-local" name="datetime"></input>
          </div>
          <div className="form-group submit">
            <input type="submit" value="Buy" className="buy" name="buy"></input>
            <input
              type="submit"
              value="Sell"
              className="sell"
              name="sell"
            ></input>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;
