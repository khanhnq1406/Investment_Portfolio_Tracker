import { REDUX_TYPE } from "./types";

export const addUserReducer = (state = { user: null }, action) => {
  switch (action.type) {
    case REDUX_TYPE.ADD_USER: {
      return {
        user: action.payload,
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
      return { display: "block", cryptoName: action.payload.cryptoName };
    }
    case REDUX_TYPE.UNHIDE_TRANSACTION: {
      return { display: "none", cryptoName: null };
    }
    default:
      return state;
  }
};
