import * as actionTypes from '../actions/types';

export const generatingReport = (state = false, action) => {
    switch (action.type){
        case actionTypes.GENERATING_REPORT:
            return true;
        case actionTypes.GENERATE_REPORT_SUCCESS:
        case actionTypes.GENERATE_REPORT_FAILED:
            return false;
        default:
            return state;
    }
};

export const report = (state = {}, action) => {
    switch (action.type){
        case actionTypes.GENERATE_REPORT_SUCCESS:
            return {path: action.path, name: action.name};
        default:
            return state;
    }
};