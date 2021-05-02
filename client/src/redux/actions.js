
export const REGISTER = "REGISTER"
export const LOGIN = "LOGIN"
export const LOGOUT = "LOGOUT"
export const SET = "SET"
export const DELETE = "DELETE"

export function registerUser(user) {
    return {
        type: REGISTER,
        payload: user
    }
}

export function loginUser(user) {
    return {
        type: LOGIN,
        payload: user
    }
}

export function logoutUser(userID) {
    return {
        type: LOGOUT,
        payload: userID
    }
}

export function setVacation(vacation) {
    return {
        type: SET,
        payload: vacation
    }
}

export function deleteVacation(id) {
    return {
        type: DELETE,
        payload: id
    }
}






        



