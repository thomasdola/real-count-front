import * as actionTypes from '../actions/types';

export const list = (state = [], action) => {
    switch (action.type){
        case actionTypes.LOAD_LOGS_SUCCESS:
            return action.logs;
        case actionTypes.NEW_ACTIVITY_LOG:
            const newLogs = [...state];
            newLogs.unshift(action.log);
            return [...newLogs];
        default:
            return state;
    }
};

export const pagination = (state = {}, action) => {
    switch (action.type){
        case actionTypes.LOAD_LOGS_SUCCESS:
            return action.pagination;
        default:
            return state;
    }
};

export const loadingLogs = (state = false, action) => {
    switch (action.type){
        case actionTypes.LOADING_LOGS:
            return true;
        case actionTypes.LOAD_LOGS_SUCCESS:
        case actionTypes.LOAD_LOGS_FAILED:
            return false;
        default:
            return state;
    }
};

export const exportingLogs = (state = false, action) => {
    switch (action.type){
        case actionTypes.EXPORTING_LOGS:
            return true;
        case actionTypes.EXPORT_LOGS_SUCCESS:
        case actionTypes.EXPORT_LOGS_FAILED:
            return false;
        default:
            return state;
    }
};