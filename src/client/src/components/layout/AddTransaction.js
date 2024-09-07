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
  return (
    <div
      className="add-transaction-container"
      style={{ display: `${transactionInfo.display}` }}
    >
      <h1>Add Transaction</h1>
      <button
        onClick={(e) => {
          store.dispatch(unhideAddTransaction());
        }}
      >
        Unhide
      </button>
    </div>
  );
};

export default AddTransaction;
