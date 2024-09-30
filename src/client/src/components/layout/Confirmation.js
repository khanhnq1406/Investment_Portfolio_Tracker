import "./Confirmation.css";
import {
  BACKEND_URL,
  CONFIRMATION_TYPE,
  STATUS_CODE,
} from "../../utils/constants";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "./Loading";

const Confirmation = ({ closeConfirmationBox, payload }) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    switch (payload.type) {
      case CONFIRMATION_TYPE.DELETE_TRANSACTION:
        setTitle("Delete the transaction?");
        setMessage("You will not be able to recover it");
        setSubmitMessage("Yes, delete it");
        break;

      case CONFIRMATION_TYPE.EDIT_TOTAL_INVESTED:
        setTitle("Change the total invested value?");
        setMessage("You will not be able to recover it");
        setSubmitMessage("Yes, change it");
        break;
      default:
        break;
    }
  }, []);

  const submitBtnHandle = async (event) => {
    event.preventDefault();

    if (payload.type === CONFIRMATION_TYPE.DELETE_TRANSACTION) {
      document.getElementsByClassName("loading-container")[0].style.display =
        "flex";
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
    } else if (payload.type === CONFIRMATION_TYPE.EDIT_TOTAL_INVESTED) {
      console.log("edit");
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
