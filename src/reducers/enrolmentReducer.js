import * as actionTypes from '../actions/types';

export const checkingBid = (state = false, action) => {
    switch (action.type){
        case actionTypes.CHECKING_BID:
            return true;
        case actionTypes.CHECK_BID_SUCCESS:
        case actionTypes.CHECK_BID_FAILED:
            return false;
        default:
            return state;
    }
};

export const enrollingBeneficiary = (state = false, action) => {
    switch (action.type){
        case actionTypes.ENROLLING_BENEFICIARY:
            return true;
        case actionTypes.ENROL_BENEFICIARY_SUCCESS:
        case actionTypes.ENROL_BENEFICIARY_FAILED:
            return false;
        default:
            return state;
    }
};

export const allowToEnroll = (state = {bid: '', valid: false, official: {}}, action) => {
    switch (action.type){
        case actionTypes.CHECK_BID_SUCCESS:
            return {valid: action.valid, bid: action.bid, official: action.official};
        case actionTypes.INVALIDATE_BID:
            return {valid: false, bid: '', official: {}};
        default:
            return state;
    }
};

export const enrolledBeneficiary = (state = '', action) => {
    switch (action.type){
        case actionTypes.ENROL_BENEFICIARY_SUCCESS:
            return action.beneficiary;
        default:
            return state;
    }
};