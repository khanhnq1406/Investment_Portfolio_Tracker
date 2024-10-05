import { useEffect, useState, version } from "react";
import "./EditData.css";
import { CONFIRMATION_TYPE, EDIT_TYPE } from "../../utils/constants";
import Confirmation from "./Confirmation";

const EditData = (props) => {
  const { type, payload, close } = props;
  const [title, setTitle] = useState();
  const [confirmationBox, setConfirmationBox] = useState();
  const [value, setValue] = useState(payload.value);

  useEffect(() => {
    switch (type) {
      case EDIT_TYPE.TOTAL_INVESTED:
        setTitle("Total Invested");
        break;

      case EDIT_TYPE.HOLDING_QUANTITY:
        setTitle("Holding Quantity");
        break;

      case EDIT_TYPE.TOTAL_COST:
        setTitle("Total Cost");
        break;

      case EDIT_TYPE.AVG_COST:
        setTitle("Average Cost");
        break;

      default:
        break;
    }
  }, []);

  const closeConfirmationBox = () => {
    setConfirmationBox();
  };

  const handleEdit = (event) => {
    event.preventDefault();
    switch (type) {
      case EDIT_TYPE.TOTAL_INVESTED:
        setConfirmationBox(
          <Confirmation
            closeConfirmationBox={closeConfirmationBox}
            payload={{
              type: CONFIRMATION_TYPE.EDIT_TOTAL_INVESTED,
              value: value,
            }}
          />
        );
        break;

      case EDIT_TYPE.HOLDING_QUANTITY:
      case EDIT_TYPE.TOTAL_COST:
      case EDIT_TYPE.AVG_COST:
        let confirmationType = 0;
        switch (type) {
          case EDIT_TYPE.HOLDING_QUANTITY:
            confirmationType = CONFIRMATION_TYPE.HOLDING_QUANTITY;
            break;

          case EDIT_TYPE.TOTAL_COST:
            confirmationType = CONFIRMATION_TYPE.TOTAL_COST;
            break;

          case EDIT_TYPE.AVG_COST:
            confirmationType = CONFIRMATION_TYPE.AVG_COST;
            break;

          default:
            break;
        }
        setConfirmationBox(
          <Confirmation
            closeConfirmationBox={closeConfirmationBox}
            payload={{
              type: confirmationType,
              value: value,
              symbol: payload.symbol,
            }}
          />
        );
        break;
      default:
        break;
    }
  };
  return (
    <div className="edit-container">
      {confirmationBox}
      <div className="edit-popup">
        <button
          className="close-btn"
          onClick={(e) => {
            close();
          }}
        >
          <img src="/icon/cross.png" />
        </button>
        <div className="transaction-title">Edit {title}</div>
        <form className="transaction-form" onSubmit={handleEdit}>
          <div className="form-group">
            <div>{title}</div>
            <input
              type="text"
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
              }}
              required
            ></input>
          </div>
          <div className="form-group submit">
            <input
              type="submit"
              value={`Edit ${title}`}
              className="buy"
              style={{ marginRight: "0" }}
            ></input>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditData;
