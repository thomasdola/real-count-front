import * as actionTypes from '../actions/types';

export const list = (state = [], action) => {
    switch (action.type){
        case actionTypes.LOAD_DAILY_ATTENDANCE_SUCCESS:
            return action.attendance;
        case actionTypes.NEW_ATTENDANCE:
            let newAtt = [...state];
            newAtt.unshift(action.attendance);
            return [...newAtt];
        default:
            return state;
    }
};

export const loadingDailyAttendance = (state = false, action) => {
    switch (action.type){
        case actionTypes.LOADING_DAILY_ATTENDANCE:
            return true;
        case actionTypes.LOAD_DAILY_ATTENDANCE_SUCCESS:
        case actionTypes.LOAD_DAILY_ATTENDANCE_FAILED:
            return false;
        default:
            return state;
    }
};

export const loadingBeneficiaryWeeklyAttendance = (state = false, action) => {
    switch (action.type){
        case actionTypes.LOADING_BENEFICIARY_WEEKLY_ATTENDANCE:
            return true;
        case actionTypes.LOAD_BENEFICIARY_WEEKLY_ATTENDANCE_SUCCESS:
        case actionTypes.LOAD_BENEFICIARY_WEEKLY_ATTENDANCE_FAILED:
            return false;
        default:
            return state;
    }
};

export const weeklyBeneficiaryAttendance = (state = {calendar: [], chart: []}, action) => {
    switch (action.type){
        case actionTypes.LOAD_BENEFICIARY_WEEKLY_ATTENDANCE_SUCCESS:
            return action.attendance;
        default:
            return state;
    }
};

export const pagination = (state = {}, action) => {
    switch (action.type){
        case actionTypes.LOAD_DAILY_ATTENDANCE_SUCCESS:
            return action.pagination;
        default:
            return state;
    }
};

export const weeklyAttendanceFor = (state = {}, action) => {
    switch (action.type){
        case actionTypes.VIEW_WEEKLY_ATTENDANCE_FOR:
            return action.uuid;
        default:
            return state;
    }
};