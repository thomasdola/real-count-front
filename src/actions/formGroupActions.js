import * as actionTypes from './types';
// import formGroupApi from '../api/mock/formGroupMockApi';
import formGroupApi from '../api/actual/formGroupApi';
import {getTime} from "date-fns";

export const useAsPreset = form => ({type: actionTypes.SELECT_FORM_AS_PRESET, form});
export const clearPreset = () => ({type: actionTypes.CLEAR_FORM_PRESET});
export const closeDownloadFormAlert = () => ({type: actionTypes.CLOSE_DOWNLOAD_FORM_ALERT});

export const generatePending = uuid => dispatch => {
    dispatch({type: actionTypes.GENERATING_PENDING_FORMS});

    return formGroupApi
        .reGenerate(uuid)
        .then(({scheduled, url, name, path}) => {
            dispatch({type: actionTypes.GENERATE_PENDING_FORMS_SUCCESS, url, name, path});
            dispatch({
                type: actionTypes.OPERATION_SUCCESSFUL,
                action: actionTypes.GENERATE_FORMS,
                timestamp: getTime(Date()),
                data: {scheduled, url, name, path}
            });
        })
        .catch(error => {
            dispatch({
                type: actionTypes.OPERATION_FAILED,
                action: actionTypes.GENERATE_FORMS,
                timestamp: getTime(Date()),
                data: {...error}
            });
            dispatch({type: actionTypes.GENERATE_PENDING_FORMS_FAILED});
            console.log(error);
        });
};

export const deleteFullyEnrolled = () => dispatch => {
    // dispatch({type: actionTypes.DELETING_FULLY_ENROLLED_FORMS});

    // return formGroupApi
    //     .clearHistory()
    //     .then(() => {
    //         dispatch({type: actionTypes.DELETE_FULLY_ENROLLED_FORMS_SUCCESS})
    //     })
    //     .catch(error => {
    //         console.log(error);
    //     });
};

export const generateForms = data => dispatch => {
    dispatch({type: actionTypes.GENERATING_FORMS});

    return formGroupApi
        .generate(data)
        .then(({scheduled, name, url, path}) => {
            dispatch({type: actionTypes.GENERATE_FORMS_SUCCESS, url, name, path});
            dispatch({
                type: actionTypes.OPERATION_SUCCESSFUL,
                action: actionTypes.GENERATE_FORMS,
                timestamp: getTime(Date()),
                data: {scheduled, url, name, path}
            });
        })
        .catch(error => {
            dispatch({
                type: actionTypes.OPERATION_FAILED,
                action: actionTypes.GENERATE_FORMS,
                timestamp: getTime(Date()),
                data: {...error}
            });
            dispatch({type: actionTypes.GENERATE_FORMS_FAILED});
            console.log(error);
        });
};

export const loadFormGroups = params => dispatch => {
    dispatch({type: actionTypes.LOAD_FORMS_LOADING});

    return formGroupApi
        .all(params)
        .then(({data, meta: {pagination}}) => {
            dispatch({type: actionTypes.LOAD_FORMS_SUCCESS, forms: data, pagination})
        })
        .catch(error => {
            dispatch({type: actionTypes.LOAD_FORMS_FAILED});
            console.log(error);
        });
};