import * as actionTypes from '../actions/types';
import {getTime} from "date-fns";

const OPERATION_TEMPLATE = {action: null, data: {}, timestamp: getTime(Date())};

export const failed = (state = OPERATION_TEMPLATE, action) => {
    switch (action.type){
        case actionTypes.OPERATION_FAILED:
            return {action: action.action, data: action.data, timestamp: action.timestamp};
        case actionTypes.RESET_OPERATIONS:
            return OPERATION_TEMPLATE;
        default:
            return state;
    }
};

export const successful = (state = OPERATION_TEMPLATE, action) => {
    switch (action.type){
        case actionTypes.OPERATION_SUCCESSFUL:
            return {action: action.action, data: action.data, timestamp: action.timestamp};
        case actionTypes.RESET_OPERATIONS:
            return OPERATION_TEMPLATE;
        default:
            return state;
    }
};