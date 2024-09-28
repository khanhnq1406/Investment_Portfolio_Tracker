import "./Confirmation.css";
import {
  BACKEND_URL,
  CONFIRMATION_TYPE,
  STATUS_CODE,
} from "../../utils/constants";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "./Loading";
import { hideLoading, unhideLoading } from "../../utils/SetLoading";
const Confirmation = ({ closeConfirmationBox, payload }) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const loadingContainer =
    document.getElementsByClassName("loading-container")[0];
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
      document.getElementsByClassName("loading-container")[0].style.display =
        "flex";
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
          document.getElementsByClassName(
            "loading-container"
          )[0].style.display = "none";
          window.location.reload();
        }
      } catch (error) {
        document.getElementsByClassName("loading-container")[0].style.display =
          "none";
        alert("Failed to delete transaction. Please try again.");
      }
    }
  };
  return (
    <div className="confirmation-container">
      <div className="confirmation-popup">
        <Loading />
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
