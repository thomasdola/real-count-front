import * as actionTypes from './types';
// import AttendanceApi from '../api/mock/attendanceMockApi';
import AttendanceApi from '../api/actual/attendanceApi';

export const viewWeeklyAttendanceFor = uuid => ({type: actionTypes.VIEW_WEEKLY_ATTENDANCE_FOR, uuid});

export const loadBeneficiaryWeeklyAttendance = (uuid, params) => dispatch => {
    dispatch({type: actionTypes.LOADING_BENEFICIARY_WEEKLY_ATTENDANCE});

    return AttendanceApi
        .beneficiaryWeeklyAttendance(uuid, params)
        .then(attendance => {
            dispatch({type: actionTypes.LOAD_BENEFICIARY_WEEKLY_ATTENDANCE_SUCCESS, attendance});
        })
        .catch(error => {
            dispatch({type: actionTypes.LOAD_BENEFICIARY_WEEKLY_ATTENDANCE_FAILED});
            console.log(error);
        });
};

export const loadTodayAttendance = params => dispatch => {
    dispatch({type: actionTypes.LOADING_DAILY_ATTENDANCE});

    return AttendanceApi
        .todayAttendance(params)
        .then(({data, meta: {pagination}}) => {
            dispatch({type: actionTypes.LOAD_DAILY_ATTENDANCE_SUCCESS, attendance: data, pagination});
            let first = data[0];
            if(first){
                dispatch(viewWeeklyAttendanceFor(first));
            }            
        })
        .catch(error => {
            dispatch({type: actionTypes.LOAD_DAILY_ATTENDANCE_FAILED});
            console.log(error);
        });
};