import * as actionTypes from './types';
// import UserApi from '../api/mock/userMockApi';
import UserApi from '../api/actual/userApi';
import {getTime} from "date-fns";


export const loadUsers = params => dispatch => {
    dispatch({type: actionTypes.LOADING_USERS});

    return UserApi
        .list(params)
        .then(({data, meta: {pagination}}) => {
            dispatch({type: actionTypes.LOAD_USERS_SUCCESS, users: data, pagination});
        })
        .catch(error => {
            dispatch({type: actionTypes.LOAD_USERS_FAILED});
            console.log(error);});
};
export const loadGroupUsers = params => dispatch => {
    dispatch({type: actionTypes.LOADING_GROUP_USERS});

    return UserApi
        .list(params)
        .then(({data}) => {
            dispatch({type: actionTypes.LOAD_GROUP_USERS_SUCCESS, users: data});
        })
        .catch(error => {
            dispatch({type: actionTypes.LOAD_GROUP_USERS_FAILED});
            console.log(error);});
};
export const loadDanglingUsers = (params = {f: "dangling|1"}) => dispatch => {
    dispatch({type: actionTypes.LOADING_DANGLING_USERS});

    return UserApi
        .list(params)
        .then(({data}) => {
            dispatch({type: actionTypes.LOAD_DANGLING_USERS_SUCCESS, users: data});
        })
        .catch(error => {
            dispatch({type: actionTypes.LOAD_DANGLING_USERS_FAILED});
            console.log(error);});
};

export const addUser = data => dispatch => {
    dispatch({type: actionTypes.ADDING_USER});

    return UserApi
        .add(data)
        .then(({added}) => {
            if(added){
                dispatch({type: actionTypes.ADD_USER_SUCCESS});
                dispatch({
                    type: actionTypes.OPERATION_SUCCESSFUL,
                    action: actionTypes.ADD_USER,
                    timestamp: getTime(Date()),
                    data: {added}
                });
            }
        })
        .catch(error => {
            dispatch({
                type: actionTypes.OPERATION_FAILED,
                action: actionTypes.ADD_USER,
                timestamp: getTime(Date()),
                data: {...error}
            });
            dispatch({type: actionTypes.ADD_USER_FAILED});
            console.log(error);
        });
};
export const editUser = (user, data, action = null) => dispatch => {
    dispatch({type: actionTypes.EDITING_USER});

    return UserApi
        .edit(user, data)
        .then(({updated}) => {
            if(updated){
                dispatch({type: actionTypes.EDIT_USER_SUCCESS});
                action = action ? action : actionTypes.EDIT_USER;
                dispatch({
                    type: actionTypes.OPERATION_SUCCESSFUL,
                    action,
                    timestamp: getTime(Date()),
                    data: {updated}
                });
            }
        })
        .catch(error => {
            dispatch({
                type: actionTypes.OPERATION_FAILED,
                action: actionTypes.EDIT_USER,
                timestamp: getTime(Date()),
                data: {...error}
            });
            dispatch({type: actionTypes.EDIT_USER_FAILED});
            console.log(error);
        });
};
export const deleteUser = user => dispatch => {
    dispatch({type: actionTypes.DELETING_USER});

    return UserApi
        .delete(user)
        .then(({deleted}) => {
            if(deleted){
                dispatch({type: actionTypes.DELETE_USER_SUCCESS});
                dispatch({
                    type: actionTypes.OPERATION_SUCCESSFUL,
                    action: actionTypes.DELETE_USER,
                    timestamp: getTime(Date()),
                    data: {deleted}
                });
            }
        })
        .catch(error => {
            dispatch({
                type: actionTypes.OPERATION_FAILED,
                action: actionTypes.DELETE_USER,
                timestamp: getTime(Date()),
                data: {...error}
            });
            dispatch({type: actionTypes.DELETE_USER_FAILED});
            console.log(error);
        });
};