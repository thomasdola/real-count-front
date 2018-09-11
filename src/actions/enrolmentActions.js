import * as actionTypes from './types';
// import EnrolmentApi from '../api/mock/enrolmentMockApi';
import EnrolmentApi from '../api/actual/enrolmentApi';
import {getTime} from "date-fns";

export const invalidateBid = () => ({type: actionTypes.INVALIDATE_BID});

export const checkBid = data => dispatch => {
    dispatch({type: actionTypes.CHECKING_BID});

    return EnrolmentApi
        .checkBid(data)
        .then(({valid, bid, official}) => {
            if(valid){
                dispatch({type: actionTypes.CHECK_BID_SUCCESS, valid, bid, official});
                dispatch({
                    type: actionTypes.OPERATION_SUCCESSFUL,
                    action: actionTypes.CHECK_BID,
                    timestamp: getTime(Date()),
                    data: {valid, bid, official}
                });
            }
        })
        .catch(error => {
            dispatch({
                type: actionTypes.OPERATION_FAILED,
                action: actionTypes.CHECK_BID,
                timestamp: getTime(Date()),
                data: {}
            });
            dispatch({type: actionTypes.CHECK_BID_FAILED});
            console.log(error);
        });
};

export const enrol = data => dispatch => {
    dispatch({type: actionTypes.ENROLLING_BENEFICIARY});

    return EnrolmentApi
        .enrol(data)
        .then(({beneficiary, scheduled}) => {
            dispatch({type: actionTypes.ENROL_BENEFICIARY_SUCCESS, beneficiary});
            dispatch({
                type: actionTypes.OPERATION_SUCCESSFUL,
                action: actionTypes.ENROL_BENEFICIARY,
                timestamp: getTime(Date()),
                data: {beneficiary, scheduled}
            });
        })
        .catch(error => {
            dispatch({
                type: actionTypes.OPERATION_FAILED,
                action: actionTypes.ENROL_BENEFICIARY,
                timestamp: getTime(Date()),
                data: {...error}
            });
            dispatch({type: actionTypes.ENROL_BENEFICIARY_FAILED});
            console.log(error);
        });
};