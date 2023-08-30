import { UPDATE_NFT_BANNER_LIST, GET_NFT_DETAIL, BUY_NFT_SUCCESS, SET_NFT_TRADING_RESULT, UPDATE_ITEMS_OF_USER_BY_CONDITION, UPDATE_ITEMS_OF_COLLECTION } from "./action.types";
import config, { BACKEND_URL } from '../../config';
import axios from 'axios';

export const getNftBannerList = (limit) => dispatch => {
    axios.post(`${BACKEND_URL}/api/item/get_banner_list`, { limit: limit }, {
        headers:
        {
            "x-access-token": localStorage.getItem("jwtToken")
        }
    }).then((result) => {
        dispatch({
            type: UPDATE_NFT_BANNER_LIST,
            payload: { banner: result.data.data }
        })
    }).catch(() => {

    });
}

export const getNftDetail = (id) => dispatch => {
    axios.post(`${BACKEND_URL}/api/item/get_detail`, { id: id }, {
        headers:
        {
            "x-access-token": localStorage.getItem("jwtToken")
        }
    }).then((result) => {
        dispatch({
            type: GET_NFT_DETAIL,
            payload: { detail: result.data.data }
        });
    }).catch(() => {

    });

    axios.post(`${BACKEND_URL}/api/item/get_owner_history`, { item_id: id }, {
        headers:
        {
            "x-access-token": localStorage.getItem("jwtToken")
        }
    }).then((result) => {
        dispatch({
            type: GET_NFT_DETAIL,
            payload: { history: result.data.data }
        });
    }).catch(() => {

    });
}

export const buyNft = (item_id, price, owner, buyer) => dispatch => {
    axios.post(`${BACKEND_URL}/api/sale/buy`,
        { item_id: item_id, price: price, owner: owner, buyer: buyer }, {
            headers:
            {
                "x-access-token": localStorage.getItem("jwtToken")
            }
        })
        .then((result) => {
            dispatch({
                type: BUY_NFT_SUCCESS,
                payload: { buy: result.data }
            });
        }).catch(() => {

        });
}

// export const getHotCollections = (limit) => dispatch => {
//     axios.post(`${BACKEND_URL}/api/collection/get_hot_collections`, { limit: limit }).then((result) => {
//         dispatch({
//             type: UPDATE_HOT_COLLECTION_LIST,
//             payload: { detail: result.data }
//         });
//     }).catch(() => {

//     });
// }

export const getItemsOfCollection = (params, colllectionId) => dispatch => {
    axios.post(`${BACKEND_URL}/api/item/get_items_of_collection`, {...params, colId : colllectionId}, {
        headers:
        {
            "x-access-token": localStorage.getItem("jwtToken")
        }
    }).then((result) => {
        dispatch({
            type: UPDATE_ITEMS_OF_COLLECTION,
            payload: result.data.data
        });
    }).catch(() => {

    });
}


export const getItemsOfUserByConditions = (params, userId) => dispatch => {
    axios.post(`${BACKEND_URL}/api/item/get_items_of_user`, {...params, userId : userId}, {
        headers:
        {
            "x-access-token": localStorage.getItem("jwtToken")
        }
    }).then((result) => {
        dispatch({
            type: UPDATE_ITEMS_OF_USER_BY_CONDITION,
            payload: result.data.data
        });
    }).catch(() => {

    });
}

export const setNFTTradingResult  = (functionName, success, message) => dispatch =>
{    
    dispatch({
        type: SET_NFT_TRADING_RESULT,
        payload: {
            function : functionName,
            success : success,
            message : message
        }
    });
}

export const emptyNFTTradingResult = () => dispatch =>
{
    dispatch({
        type: SET_NFT_TRADING_RESULT,
        payload: null
    });
}
