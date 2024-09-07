const { REDUX_TYPE } = require("./types");
export const addUser = (payload) => {
  return {
    type: REDUX_TYPE.ADD_USER,
    payload: payload,
  };
};

export const hideAddTransaction = (payload) => {
  return {
    type: REDUX_TYPE.HIDE_TRANSACTION,
    payload: payload,
  };
};

export const unhideAddTransaction = () => {
  return {
    type: REDUX_TYPE.UNHIDE_TRANSACTION,
  };
};
