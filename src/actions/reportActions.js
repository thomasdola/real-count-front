import * as actionTypes from './types';
// import reportApi from '../api/mock/reportMockApi';
import reportApi from '../api/actual/reportApi';
import {getTime} from "date-fns";


export const generate = data => dispatch => {
    dispatch({type: actionTypes.GENERATING_REPORT});

    return reportApi
        .generate(data)
        .then(({path, url, scheduled}) => {
            dispatch({type: actionTypes.GENERATE_REPORT_SUCCESS, path, url});
            dispatch({
                type: actionTypes.OPERATION_SUCCESSFUL,
                action: actionTypes.GENERATE_REPORT,
                timestamp: getTime(Date()),
                data: {path, url, scheduled}
            });
        })
        .catch(error => {
            dispatch({
                type: actionTypes.OPERATION_FAILED,
                action: actionTypes.GENERATE_REPORT,
                timestamp: getTime(Date()),
                data: {...error}
            });
            dispatch({type: actionTypes.GENERATE_REPORT_FAILED});
            console.log(error);
        });
};