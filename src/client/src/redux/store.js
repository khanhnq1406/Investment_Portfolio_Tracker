import { createStore, combineReducers } from "redux";
import {
  addUserReducer,
  addTransactionDisplayReducer,
  addSummaryDataReducer,
} from "./reducer";
const rootReducer = combineReducers({
  addUserReducer,
  addTransactionDisplayReducer,
  addSummaryDataReducer,
});
export const store = createStore(rootReducer);
