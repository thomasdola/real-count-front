import * as actionTypes from '../actions/types';

export const list = (state = [], action) => {
    switch (action.type){
        case actionTypes.LOAD_GROUPS_SUCCESS:
            return action.groups;
        default:
            return state;
    }
};

export const pagination = (state = {}, action) => {
    switch (action.type){
        case actionTypes.LOAD_GROUPS_SUCCESS:
            return action.pagination;
        default:
            return state;
    }
};

export const single = (state = {}, action) => {
    switch (action.type){
        case actionTypes.SELECT_GROUP:
            return action.group;
        default:
            return state;
    }
};

export const loadingGroups = (state = false, action) => {
    switch (action.type){
        case actionTypes.LOADING_GROUPS:
            return true;
        case actionTypes.LOAD_GROUPS_SUCCESS:
        case actionTypes.LOAD_GROUPS_FAILED:
            return false;
        default:
            return state;
    }
};

export const addingGroup = (state = false, action) => {
    switch (action.type){
        case actionTypes.ADDING_GROUP:
            return true;
        case actionTypes.ADD_GROUP_SUCCESS:
        case actionTypes.ADD_GROUP_FAILED:
            return false;
        default:
            return state;
    }
};

export const editingGroup = (state = false, action) => {
    switch (action.type){
        case actionTypes.EDITING_GROUP:
            return true;
        case actionTypes.EDIT_GROUP_SUCCESS:
        case actionTypes.EDIT_GROUP_FAILED:
            return false;
        default:
            return state;
    }
};

export const deletingGroup = (state = false, action) => {
    switch (action.type){
        case actionTypes.DELETING_GROUP:
            return true;
        case actionTypes.DELETE_GROUP_SUCCESS:
        case actionTypes.DELETE_GROUP_FAILED:
            return false;
        default:
            return state;
    }
};