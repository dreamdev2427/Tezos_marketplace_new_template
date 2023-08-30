import { UPDATE_NOTIFY_LIST , GET_NOTIFIES_BY_FILTERS, MARK_ALL_NOTIFIES_AS_READ} from "./action.types";
import config, { BACKEND_URL } from '../../config';
import axios from 'axios';

export const getNotifiesByLimit = (limit, userId, filter=[]) => dispatch => 
{    
    axios.post(`${BACKEND_URL}/api/notify/getlist`, {limit, userId, filter}, {
        headers:
        {
            "x-access-token": localStorage.getItem("jwtToken")
        }
    }).then((result) => {
        dispatch({
            type: UPDATE_NOTIFY_LIST,
            payload: result.data.data 
        })
    }).catch(() => {
    });
}

export const markAllAsRead = (notifyIds, userId) => dispatch =>
{
    axios.post(`${BACKEND_URL}/api/notify/markAllAsRead`, {notifyIds, userId }, {
        headers:
        {
            "x-access-token": localStorage.getItem("jwtToken")
        }
    }).then((result) => {
        dispatch({
            type: MARK_ALL_NOTIFIES_AS_READ,
            payload: result.data.code === 0? true: false 
        })
    }).catch(() => {
    });    
}

export const getNotifiesByFilter = (filters, userId) => dispatch => 
{
    axios.post(`${BACKEND_URL}/api/notify/filtering`, {filters, userId}, {
        headers:
        {
            "x-access-token": localStorage.getItem("jwtToken")
        }
    }).then((result) => {
        
        dispatch({
            type: GET_NOTIFIES_BY_FILTERS,
            payload: result.data.data 
        })
    }).catch(() => {
    });        
}
