import "./AddTransaction.css";
import { useState } from "react";
import { store } from "../../redux/store";
import { unhideAddTransaction } from "../../redux/actions";
const AddTransaction = () => {
  const [transactionInfo, setTransactionInfo] = useState(
    store.getState().addTransactionDisplayReducer
  );
  store.subscribe(() => {
    setTransactionInfo(store.getState().addTransactionDisplayReducer);
  });

  function handleAddTransaction(event) {
    event.preventDefault();
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
            ></input>
          </div>
          <div className="form-group total-spent">
            <div>Total spent</div>
            <input type="text" name="total"></input>
          </div>
          <div className="form-group quantity">
            <div>Quantity</div>
            <input type="text" name="quantity"></input>
          </div>
          <div className="form-group price-per-coin">
            <div>Price per coin</div>
            <input type="text" name="price"></input>
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
