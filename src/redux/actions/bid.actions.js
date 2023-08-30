import { BID_SUCCESS, BID_FAILED, UPDATE_HOT_BID_LIST } from "./action.types";
import config from '../../config';
import axios from 'axios';
import { getNftDetail } from "./nft.actions";

export const setBid = (item_id, user_id, price) => dispatch => {

    axios.post(`${BACKEND_URL}/api/bid/set_bid`, { item_id, user_id, price }, {
        headers:
        {
            "x-access-token": localStorage.getItem("jwtToken")
        }
    }).then((result) => {
        dispatch({
            type: BID_SUCCESS,
            payload: { bid_status: true }
        })
        getNftDetail(item_id)(dispatch);
    }).catch(() => {
        dispatch({
            type: BID_FAILED,
            payload: { bid_status: false }
        })
    });
}




export const getHotBidList = (limit) => dispatch => {
    axios.post(`${BACKEND_URL}/api/bid/get_hot_bids`,
        { limit: limit }, {
            headers:
            {
                "x-access-token": localStorage.getItem("jwtToken")
            }
        })
        .then((result) => {
            dispatch({
                type: UPDATE_HOT_BID_LIST,
                payload: { hot_bids: result.data }
            });
        }).catch(() => {

        });
}

export const acceptBid = (item_id) => dispatch => {
    axios.post(`${BACKEND_URL}/api/bid/accept_bid`,
        { item_id: item_id }, {
            headers:
            {
                "x-access-token": localStorage.getItem("jwtToken")
            }
        })
        .then((result) => {
            getNftDetail(item_id)(dispatch);
        }).catch(() => {

        });
}
