import { REDUX_TYPE } from "./types";

export const addUserReducer = (state = {user:null}, action) => {
    switch (action.type) {
        case REDUX_TYPE.ADD_USER: {
            return {
                user: action.payload
            }
        }
        default:
            return state;
    }
}