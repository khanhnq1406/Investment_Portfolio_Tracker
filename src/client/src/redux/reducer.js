import { REDUX_TYPE } from "./types";

export const addUserReducer = (state = { user: null, email: null }, action) => {
  switch (action.type) {
    case REDUX_TYPE.ADD_USER: {
      return {
        user: action.payload.name,
        email: action.payload.email,
      };
    }
    default:
      return state;
  }
};

export const addTransactionDisplayReducer = (
  state = { display: "none" },
  action
) => {
  switch (action.type) {
    case REDUX_TYPE.HIDE_TRANSACTION: {
      return { display: "flex", cryptoName: action.payload.cryptoName };
    }
    case REDUX_TYPE.UNHIDE_TRANSACTION: {
      return { display: "none", cryptoName: null };
    }
    default:
      return state;
  }
};

export const addSummaryDataReducer = (state = { data: null }, action) => {
  switch (action.type) {
    case REDUX_TYPE.ADD_SUMMARY_DATA: {
      return { data: action.payload };
    }
    default:
      return state;
  }
};
