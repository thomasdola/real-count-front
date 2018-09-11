import * as actionTypes from './types';
// import iDTypeApi from '../api/mock/idTypeMockApi';
import iDTypeApi from '../api/actual/IDTypeApi';

export const loadIDTypes = params => dispatch => {
    return iDTypeApi
        .all(params)
        .then((idTypes) => {
            dispatch({type: actionTypes.LOAD_ID_TYPES_SUCCESS, idTypes});
        })
        .catch(error => {
            dispatch({type: actionTypes.LOAD_ID_TYPES_FAILED});
            console.log(error);
        });
};