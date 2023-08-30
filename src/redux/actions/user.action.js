import { UPDATE_POPULAR_USERS, SET_AVAX_PRICE, SET_THEME_THEME } from "./action.types";
import config, { BACKEND_URL } from '../../config';
import axios from 'axios';
import { getNftDetail } from "./nft.actions";

export const getPopularUserList = (time, limit) => dispatch => {
    // time : timeframe, 0: all, 1: today, 2: this month, 3: 3 months, 4: year

    axios.post(`${BACKEND_URL}/api/users/get_popular_user_list`, { limit: limit, time: time }, {
        headers:
        {
            "x-access-token": localStorage.getItem("jwtToken")
        }
    }).then((result) => {
        dispatch({
            type: UPDATE_POPULAR_USERS,
            payload: { popular: result.data.data }
        });
    }).catch((error) => {
        // console.log("error:", error);
    })
}

export const setFavItem = (target_id, user_id) => dispatch => {
    axios.post(`${BACKEND_URL}/api/users/set_fav_item`, { target_id: target_id, user_id: user_id }, {
        headers:
        {
            "x-access-token": localStorage.getItem("jwtToken")
        }
    }).then((result) => {
        getNftDetail(target_id)(dispatch);
    });
}

export const putSale = (item_id, user_id, price, instant, period) => dispatch => {

    axios.post(`${BACKEND_URL}/api/users/put_sale`, { item_id, user_id, price, instant, period }, {
        headers:
        {
            "x-access-token": localStorage.getItem("jwtToken")
        }
    }).then((result) => {
        getNftDetail(item_id)(dispatch);
    }).catch(() => {

    });
}

export const removeSale = (item_id, user_id) => dispatch => {

    axios.post(`${BACKEND_URL}/api/users/remove_sale`, { item_id, user_id }, {
        headers:
        {
            "x-access-token": localStorage.getItem("jwtToken")
        }
    }).then((result) => {
        getNftDetail(item_id)(dispatch);
    }).catch(() => {

    });
}

export const setAvaxPrice = (price) => dispatch => {
    dispatch({
        type: SET_AVAX_PRICE,
        payload: { avax: price }
    })
}

export const setThemeMode = (mode) => dispatch => {
    dispatch({
        type: SET_THEME_THEME,
        payload: { themeMode: mode }
    })
}

export const report = (user_id, target_id, type, content) => dispatch => {
    axios.post(`${BACKEND_URL}/api/utils/report`, { user_id, target_id, type, content }, {
        headers:
        {
            "x-access-token": localStorage.getItem("jwtToken")
        }
    }).then((result) => {
    }).catch(() => {
    });
}