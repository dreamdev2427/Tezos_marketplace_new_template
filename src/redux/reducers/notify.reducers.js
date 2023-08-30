import { UPDATE_NOTIFY_LIST, GET_NOTIFIES_BY_FILTERS, MARK_ALL_NOTIFIES_AS_READ } from "../actions/action.types";


export default function Notify(state, action) {
    switch(action.type) {
        case UPDATE_NOTIFY_LIST:
        case GET_NOTIFIES_BY_FILTERS:
            return {...state, list : action.payload};
        case MARK_ALL_NOTIFIES_AS_READ:
            return {...state};
        default:
            return {...state};
    }
}

