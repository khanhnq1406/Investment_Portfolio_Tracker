import {createStore} from "redux";
import { addUserReducer } from "./reducer";
export const store = createStore(addUserReducer); // createStore(reducerA, reducerB);