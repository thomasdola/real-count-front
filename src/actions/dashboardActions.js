import * as actionTypes from './types';
// import DashboardApi from '../api/mock/dashboardMockApi';
import DashboardApi from '../api/actual/dashboardApi';

export const loadData = (params = {}, {level, entity, name}) => dispatch => {
    dispatch({type: actionTypes.LOADING_DASHBOARD_DATA, level, entity, name});
    return DashboardApi
        .data(params)
        .then(({data}) => {
            dispatch({type: actionTypes.LOAD_DASHBOARD_DATA_SUCCESS, data, level, entity, name});
        })
        .catch((error) => {
            dispatch({type: actionTypes.LOAD_DASHBOARD_DATA_FAILED, level, entity, name});
            console.log(error);
        });
};