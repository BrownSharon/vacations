import { REGISTER, LOGIN, LOGOUT } from './actions'
import { usersData } from './states'
import { combineReducers } from "redux"

function usersReducer(state = usersData, { type, payload }) {
    switch (type) {
        case REGISTER:
            usersData.user = payload
            return state
        case LOGIN:
            usersData.user = payload
            return state
        case LOGOUT:
            usersData.user.login = false
            return state
        default:
            return state
    }

}


export let rootReducers = combineReducers({
    usersReducer,

}) 