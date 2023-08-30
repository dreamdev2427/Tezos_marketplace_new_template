import { FOLLOW_SUCCESS, FOLLOW_FAILED, IS_FOLLOWING_EXISTS, UPDATE_FOLLOW_LIST, UPDATE_FOLLOWING_LIST } from "./action.types";
import config, { BACKEND_URL } from '../../config';
import axios from 'axios';

 const toggleFollow = (my_id, target_id) => dispatch => {

    axios.post(`${BACKEND_URL}/api/follow/toggle_follow`, { my_id, target_id }, {
        headers:
        {
            "x-access-token": localStorage.getItem("jwtToken")
        }
    }).then((result) => {
        dispatch({
            type: FOLLOW_SUCCESS,
            payload: { follow_status: true }
        })
    }).catch(() => {
        dispatch({
            type: FOLLOW_FAILED,
            payload: { follow_status: false }
        })
    });
}

 const getFollowList = (user_id, limit) => dispatch => {
    axios.post(`${BACKEND_URL}/api/follow/get_follows`,
        { limit: limit, my_id: user_id}, {
            headers:
            {
                "x-access-token": localStorage.getItem("jwtToken")
            }
        })
        .then((result) => {
            dispatch({
                type: UPDATE_FOLLOW_LIST,
                payload: result.data.data
            });
        }).catch(() => {

    });
}

 const getFollowingList = (user_id, limit) => dispatch => {
    axios.post(`${BACKEND_URL}/api/follow/get_followings`,
        { limit: limit , my_id: user_id}, {
            headers:
            {
                "x-access-token": localStorage.getItem("jwtToken")
            }
        })
        .then((result) => {
            dispatch({
                type: UPDATE_FOLLOWING_LIST,
                payload: result.data.data
            });
        }).catch(() => {

        });
}

 const getIsExists = (user_id, target_id) => dispatch =>
{
    axios.post(`${BACKEND_URL}/api/follow/get_isExists`,
        { user_id, target_id}, {
            headers:
            {
                "x-access-token": localStorage.getItem("jwtToken")
            }
        })
        .then((result) => {
            dispatch({
                type: IS_FOLLOWING_EXISTS,
                payload: result.data.data
            });
        }).catch(() => {

        });    
}
