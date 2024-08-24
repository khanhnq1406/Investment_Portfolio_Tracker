const { REDUX_TYPE } = require("./types")
export const addUser = (payload) => {
    return {
        type: REDUX_TYPE.ADD_USER,
        payload: payload
    }
}