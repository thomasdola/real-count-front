import * as actionTypes from '../actions/types';

export const list = (state = [], action) => {
    switch (action.type){
        case actionTypes.LOAD_FORMS_SUCCESS:
            return action.forms;
        default:
            return state;
    }
};

export const single = (state = {}, action) => {
    switch (action.type){
        case actionTypes.SELECT_FORM_AS_PRESET:
            return {
                region: action.form.region.id, district: action.form.district.id, location: action.form.location.id,
                module: action.form.module.id, rank: action.form.rank.id, count: action.form.count.total
            };
        case actionTypes.CLEAR_FORM_PRESET:
            return {};
        default:
            return state;
    }
};

export const pagination = (state = {}, action) => {
    switch (action.type){
        case actionTypes.LOAD_FORMS_SUCCESS:
            return action.pagination;
        default:
            return state;
    }
};

export const clearingHistory = (state = false, action) => {
    switch (action.type){
        case actionTypes.DELETING_FULLY_ENROLLED_FORMS:
            return true;
        case actionTypes.DELETE_FULLY_ENROLLED_FORMS_SUCCESS:
        case actionTypes.DELETE_FULLY_ENROLLED_FORMS_FAILED:
            return false;
        default:
            return state;
    }
};

export const loadingForms = (state = false, action) => {
    switch (action.type){
        case actionTypes.LOAD_FORMS_LOADING:
            return true;
        case actionTypes.LOAD_FORMS_SUCCESS:
        case actionTypes.LOAD_FORMS_FAILED:
            return false;
        default:
            return state;
    }
};

export const generatingForms = (state = false, action) => {
    switch (action.type){
        case actionTypes.GENERATING_FORMS:
            return true;
        case actionTypes.GENERATE_FORMS_SUCCESS:
        case actionTypes.GENERATE_FORMS_FAILED:
            return false;
        default:
            return state;
    }
};

export const generatedForm = (state = {ready: false}, action) => {
    switch (action.type){
        case actionTypes.CLOSE_DOWNLOAD_FORM_ALERT:
            return {...state, ready: false};
        case actionTypes.GENERATE_FORMS_SUCCESS:
        case actionTypes.GENERATE_PENDING_FORMS_SUCCESS:
            const {path, url, name} = action;
            return {ready: true, path, name, url};
        default:
            return state;
    }
};

export const generatingPendingForms = (state = false, action) => {
    switch (action.type){
        case actionTypes.GENERATING_PENDING_FORMS:
            return true;
        case actionTypes.GENERATE_PENDING_FORMS_SUCCESS:
        case actionTypes.GENERATE_PENDING_FORMS_FAILED:
            return false;
        default:
            return state;
    }
};