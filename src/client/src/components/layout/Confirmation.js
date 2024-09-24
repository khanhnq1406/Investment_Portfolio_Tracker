import "./Confirmation.css";
import {
  BACKEND_URL,
  CONFIRMATION_TYPE,
  STATUS_CODE,
} from "../../utils/constants";
import { useEffect, useState } from "react";
import axios from "axios";
const Confirmation = ({ closeConfirmationBox, payload }) => {
  console.log(payload);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    if (payload.type === CONFIRMATION_TYPE.DELETE_TRANSACTION) {
      setTitle("Delete the transaction?");
      setMessage("You will not be able to recover it");
      setSubmitMessage("Yes, delete it");
    }
  }, []);

  const submitBtnHandle = async (event) => {
    event.preventDefault();
    if (payload.type === CONFIRMATION_TYPE.DELETE_TRANSACTION) {
      console.log(payload);
      try {
        const response = await axios.post(`${BACKEND_URL}/transaction/delete`, {
          id: payload.id,
          cost: payload.cost,
          price: payload.price,
          quantity: payload.quantity,
          symbol: payload.symbol,
        });

        if (response.status === STATUS_CODE.OK) {
          window.location.reload();
        }
      } catch (error) {
        alert("Failed to delete transaction. Please try again.");
      }
    }
  };
  return (
    <div className="confirmation-container">
      <div className="confirmation-popup">
        <div className="content">
          <div className="confirmation-title">{title}</div>
          <div className="confirmation-message">{message}</div>
        </div>
        <div className="confirmation-buttons">
          <button
            className="cancel-btn"
            onClick={(e) => closeConfirmationBox()}
          >
            Cancel
          </button>
          <button className="submit-btn" onClick={submitBtnHandle}>
            {submitMessage}
          </button>
        </div>
      </div>
    </div>
  );
};
export default Confirmation;
