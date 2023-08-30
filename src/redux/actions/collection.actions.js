import { UPDATE_COLLECTION_BANNER_LIST, GET_COLLECTION_DETAIL, SET_CONSIDERING_COLLECTION_ID, UPDATE_COLLECTION_LIST, BUY_COLLECTION_SUCCESS, GET_HOT_COLLECTION } from "./action.types";
import { BACKEND_URL } from '../../config';
import axios from 'axios';

export const getCollectionBannerList = (limit) => dispatch => {
    axios.post(`${BACKEND_URL}/api/collection/get_banner_list`, { limit: limit }, {
        headers:
        {
            "x-access-token": localStorage.getItem("jwtToken")
        }
    }).then((result) => {
        dispatch({
            type: UPDATE_COLLECTION_BANNER_LIST,
            payload: { banner: result.data.data }
        })
    }).catch(() => {

    });
}

export const getCollectionDetail = (id) => dispatch => {
    axios.post(`${BACKEND_URL}/api/collection/detail`, {id}, {
        headers:
        {
            "x-access-token": localStorage.getItem("jwtToken")
        }
    }).then((result) => {
        dispatch({
            type: GET_COLLECTION_DETAIL,
            payload: result.data
        });
    }).catch(() => {

    });
}

export const buyCollection = (item_id, price, owner, buyer) => dispatch => {
    axios.post(`${BACKEND_URL}/api/sale/buy`,
        { item_id: item_id, price: price, owner: owner, buyer: buyer },
        {
            headers:
            {
                "x-access-token": localStorage.getItem("jwtToken")
            }
        })
        .then((result) => {
            dispatch({
                type: BUY_COLLECTION_SUCCESS,
                payload: { buy: result.data }
            });
        }).catch(() => {

        });
}

export const getCollections = (limit, currentUserId) => dispatch => {
    axios.post(`${BACKEND_URL}/api/collection/getUserCollections`, { limit: limit, userId: currentUserId}, {
        headers:
        {
            "x-access-token": localStorage.getItem("jwtToken")
        }
    }).then((result) => {
        dispatch({
            type: UPDATE_COLLECTION_LIST,
            payload: result.data
        });
    }).catch(() => {

    });
}

export const setConsideringCollectionId = (collectionId) => dispatch => {
    dispatch({
        type: SET_CONSIDERING_COLLECTION_ID,
        payload: collectionId
    })
}


export const getHotCollections = (limit) => dispatch => {
    axios.post(`${BACKEND_URL}/api/collection/get_hot_collections`,
        { limit: limit })
        .then((result) => {
            dispatch({
                type: GET_HOT_COLLECTION,
                payload: { hots: result.data.data }
            });
        }).catch(() => {

        });
}

