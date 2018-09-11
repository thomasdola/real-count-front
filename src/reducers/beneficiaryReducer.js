import * as actionTypes from '../actions/types';
export const single = (state = {}, action) => {
    switch (action.type){
        case actionTypes.LOAD_BENEFICIARY_SUCCESS:
            return action.beneficiary;
        default:
            return state;
    }
};

export const list = (state = [], action) => {
    switch (action.type){
        case actionTypes.LOAD_BENEFICIARIES_SUCCESS:
            return action.beneficiaries;
        default:
            return state;
    }
};

export const bio = (state = {}, action) => {
    switch (action.type){
        case actionTypes.LOAD_BENEFICIARY_SUCCESS:
            return action.bio;
        default:
            return state;
    }
};

export const pagination = (state = {}, action) => {
    switch (action.type){
        case actionTypes.LOAD_BENEFICIARIES_SUCCESS:
            return action.pagination;
        default:
            return state;
    }
};

export const loadingBeneficiaries = (state = false, action) => {
    switch (action.type){
        case actionTypes.LOAD_BENEFICIARIES_LOADING:
            return true;
        case actionTypes.LOAD_BENEFICIARIES_SUCCESS:
        case actionTypes.LOAD_BENEFICIARIES_FAILED:
            return false;
        default:
            return state;
    }
};

export const loadingBeneficiary = (state = false, action) => {
    switch (action.type){
        case actionTypes.LOADING_BENEFICIARY:
            return true;
        case actionTypes.LOAD_BENEFICIARY_SUCCESS:
        case actionTypes.LOAD_BENEFICIARY_FAILED:
            return false;
        default:
            return state;
    }
};

export const updatingBeneficiary = (state = false, action) => {
    switch (action.type){
        case actionTypes.UPDATING_BENEFICIARY:
            return true;
        case actionTypes.UPDATE_BENEFICIARY_SUCCESS:
        case actionTypes.UPDATE_BENEFICIARY_FAILED:
            return false;
        default:
            return state;
    }
};

export const addingBeneficiary = (state = false, action) => {
    switch (action.type){
        case actionTypes.ADDING_BENEFICIARY:
            return true;
        case actionTypes.ADD_BENEFICIARY_SUCCESS:
        case actionTypes.ADD_BENEFICIARY_FAILED:
            return false;
        default:
            return state;
    }
};

export const deletingBeneficiary = (state = false, action) => {
    switch (action.type){
        case actionTypes.DELETING_BENEFICIARY:
            return true;
        case actionTypes.DELETE_BENEFICIARY_SUCCESS:
        case actionTypes.DELETE_BENEFICIARY_FAILED:
            return false;
        default:
            return state;
    }
};

export const capturingBio = (state = false, action) => {
    switch (action.type){
        case actionTypes.CAPTURING_BIO:
            return true;
        case actionTypes.CAPTURE_BIO_SUCCESS:
        case actionTypes.CAPTURE_BIO_FAILED:
        case actionTypes.CAPTURING_BIO_CANCEL:
            return false;
        default:
            return state;
    }
};