import * as actionTypes from '../actions/types';

export const list = (state = [], action) => {
    switch (action.type){
        case actionTypes.LOAD_USERS_SUCCESS:
            return action.users;
        default:
            return state;
    }
};

export const pagination = (state = {}, action) => {
    switch (action.type){
        case actionTypes.LOAD_USERS_SUCCESS:
            return action.pagination;
        default:
            return state;
    }
};

export const groupUsers = (state = [], action) => {
    switch (action.type){
        case actionTypes.LOAD_GROUP_USERS_SUCCESS:
            return action.users;
        default:
            return state;
    }
};

export const danglingUsers = (state = [], action) => {
    switch (action.type){
        case actionTypes.LOAD_DANGLING_USERS_SUCCESS:
            return action.users;
        default:
            return state;
    }
};

export const single = (state = {}, action) => {
    switch (action.type){
        case actionTypes.SELECT_USER:
            return action.user;
        default:
            return state;
    }
};

export const loadingUsers = (state = false, action) => {
    switch (action.type){
        case actionTypes.LOADING_GROUP_USERS:
        case actionTypes.LOADING_USERS:
            return true;
        case actionTypes.LOAD_GROUP_USERS_SUCCESS:
        case actionTypes.LOAD_GROUP_USERS_FAILED:
        case actionTypes.LOAD_USERS_SUCCESS:
        case actionTypes.LOAD_USERS_FAILED:
            return false;
        default:
            return state;
    }
};

export const addingUser = (state = false, action) => {
    switch (action.type){
        case actionTypes.ADDING_USER:
            return true;
        case actionTypes.ADD_USER_SUCCESS:
        case actionTypes.ADD_USER_FAILED:
            return false;
        default:
            return state;
    }
};

export const loadingDanglingUsers = (state = false, action) => {
    switch (action.type){
        case actionTypes.LOADING_DANGLING_USERS:
            return true;
        case actionTypes.LOAD_DANGLING_USERS_SUCCESS:
        case actionTypes.LOAD_DANGLING_USERS_FAILED:
            return false;
        default:
            return state;
    }
};

export const editingUser = (state = false, action) => {
    switch (action.type){
        case actionTypes.EDITING_USER:
            return true;
        case actionTypes.EDIT_USER_SUCCESS:
        case actionTypes.EDIT_USER_FAILED:
            return false;
        default:
            return state;
    }
};

export const deletingUser = (state = false, action) => {
    switch (action.type){
        case actionTypes.DELETING_USER:
            return true;
        case actionTypes.DELETE_USER_SUCCESS:
        case actionTypes.DELETE_USER_FAILED:
            return false;
        default:
            return state;
    }
};