import { createStore, combineReducers } from "redux";
import { addUserReducer, addTransactionDisplayReducer } from "./reducer";
const rootReducer = combineReducers({
  addUserReducer,
  addTransactionDisplayReducer,
});
export const store = createStore(rootReducer);
