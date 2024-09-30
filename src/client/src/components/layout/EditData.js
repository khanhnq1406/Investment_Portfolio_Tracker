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

      default:
        break;
    }
  }, []);

  const closeConfirmationBox = () => {
    setConfirmationBox();
  };

  const handleEdit = (event) => {
    event.preventDefault();
    setConfirmationBox(
      <Confirmation
        closeConfirmationBox={closeConfirmationBox}
        payload={{ type: CONFIRMATION_TYPE.EDIT_TOTAL_INVESTED }}
      />
    );
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
