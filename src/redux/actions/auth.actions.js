import { AUTH_LOGOUT, AUTH_SUCCESS, GET_USER_DETAIL, SET_CHAIN_ID, UPDATE_USER_BALANCE, UPDATE_WALLET_STATUS,  SET_OTHER_USER_DETAIL, SET_WALLET_ADDR, CURRENT_USER } from "./action.types"
import axios from "axios";
import  { BACKEND_URL } from "../../config";

export const authSet = (payload) => dispatch => {
    dispatch({
        type: AUTH_SUCCESS,
        payload: payload
    })
}

export const authLogout = () => dispatch => {
    dispatch({
        type: AUTH_LOGOUT,
        payload: {}
    })
}

export const getCurrentUser = () => dispatch => {
    dispatch({
        type: CURRENT_USER,
        payload: {}
    })
}

export const getDetailedUserInfo = (userId, isForMine = true) => dispatch => {
    axios.post(`${BACKEND_URL}/api/users/findOne`, { userId }, {
        headers:
        {
            "x-access-token": localStorage.getItem("jwtToken")
        }
    }).then((result) => {
        if (isForMine) {
            dispatch({
                type: GET_USER_DETAIL,
                payload: result.data.data
            })
        }
        else {
            dispatch({
                type: SET_OTHER_USER_DETAIL,
                payload: result.data.data
            })
        }
    }).catch(() => {
        console.log("Get detailed userInfo failed.");
    });
}

export const setConnectedWalletAddress = (address) => dispatch => {
    dispatch({
        type: SET_WALLET_ADDR,
        payload: address
    })
}

export const setConnectedChainId = (chainId) => dispatch => {
    dispatch({
        type: SET_CHAIN_ID,
        payload: chainId
    })
}

export const updateBalanceOfUser =  (balance) => dispatch =>
{
    //UPDATE_USER_BALANCE
    dispatch({
        type: UPDATE_USER_BALANCE,
        payload: balance
    })
}

export const setWalletStatus = (status) => dispatch => 
{
    dispatch({
        type: UPDATE_WALLET_STATUS,
        payload: status
    })
}