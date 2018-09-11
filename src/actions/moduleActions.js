import * as actionTypes from './types';
// import moduleApi from '../api/mock/moduleMockApi';
import moduleApi from '../api/actual/moduleApi';

export const loadModules = params => dispatch => {
    dispatch({type: actionTypes.LOAD_MODULES_LOADING});

    return moduleApi
        .all(params)
        .then(modules => {
            dispatch({type: actionTypes.LOAD_MODULES_SUCCESS, modules});
        })
        .catch(error => {
            console.log(error);
        });
};