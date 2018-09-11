import * as actionTypes from '../actions/types';

export const list = (state = [], action) => {
    switch (action.type){
        case actionTypes.LOAD_POLICIES_SUCCESS:
            return action.policies;
        default:
            return state;
    }
};

export const groupPolicies = (state = [], action) => {
    switch (action.type){
        case actionTypes.LOAD_GROUP_POLICIES_SUCCESS:
            return action.policies;
        default:
            return state;
    }
};

export const loadingPolicies = (state = false, action) => {
    switch (action.type){
        case actionTypes.LOADING_GROUP_POLICIES:
        case actionTypes.LOADING_POLICIES:
            return true;
        case actionTypes.LOAD_GROUP_POLICIES_SUCCESS:
        case actionTypes.LOAD_GROUP_POLICIES_FAILED:
        case actionTypes.LOAD_POLICIES_SUCCESS:
        case actionTypes.LOAD_POLICIES_FAILED:
            return false;
        default:
            return state;
    }
};

export const addingPolicy = (state = false, action) => {
    switch (action.type){
        case actionTypes.ADDING_POLICY:
            return true;
        case actionTypes.ADD_POLICY_SUCCESS:
        case actionTypes.ADD_POLICY_FAILED:
            return false;
        default:
            return state;
    }
};

export const editingPolicy = (state = false, action) => {
    switch (action.type){
        case actionTypes.EDITING_POLICY:
            return true;
        case actionTypes.EDIT_POLICY_SUCCESS:
        case actionTypes.EDIT_POLICY_FAILED:
            return false;
        default:
            return state;
    }
};

export const deletingPolicy = (state = false, action) => {
    switch (action.type){
        case actionTypes.DELETING_POLICY:
            return true;
        case actionTypes.DELETE_POLICY_SUCCESS:
        case actionTypes.DELETE_POLICY_FAILED:
            return false;
        default:
            return state;
    }
};