import * as actionTypes from './types';
// import LogApi from '../api/mock/LogMockApi';
import LogApi from '../api/actual/logApi';
import {getTime} from "date-fns";

export const loadLogs = params => dispatch => {
    dispatch({type: actionTypes.LOADING_LOGS});

    return LogApi
        .list(params)
        .then(({data, meta: {pagination}}) => {
            dispatch({type: actionTypes.LOAD_LOGS_SUCCESS, logs: data, pagination});
        })
        .catch(error => {
            dispatch({type: actionTypes.LOAD_LOGS_FAILED});
            console.log(error);
        });
};

export const exportLogs = params => dispatch => {
    dispatch({type: actionTypes.EXPORTING_LOGS});

    return LogApi
        .export(params)
        .then(({scheduled}) => {
            dispatch({type: actionTypes.EXPORT_LOGS_SUCCESS});
            dispatch({
                type: actionTypes.OPERATION_SUCCESSFUL,
                action: actionTypes.EXPORT_LOGS,
                timestamp: getTime(Date()),
                data: {scheduled}
            });
        })
        .catch(error => {
            dispatch({
                type: actionTypes.OPERATION_FAILED,
                action: actionTypes.EXPORT_LOGS,
                timestamp: getTime(Date()),
                data: {...error}
            });
            dispatch({type: actionTypes.EXPORT_LOGS_FAILED});
            console.log(error);
        });
};