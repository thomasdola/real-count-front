import * as actionTypes from './types';
import {getTime} from "date-fns";
// import RoleApi from '../api/mock/roleMockApi';
import RoleApi from '../api/actual/roleApi';
import RoleDependenciesApi from '../api/actual/roleDependencyApi';
// import RoleDependenciesApi from '../api/mock/roleDependencyMockApi';

export const selectRole = group => ({type: actionTypes.SELECT_GROUP, group});

export const loadRoles = params => dispatch => {
    dispatch({type: actionTypes.LOADING_GROUPS});

    return RoleApi
        .list(params)
        .then(({data, meta: {pagination}}) => {
            dispatch({type: actionTypes.LOAD_GROUPS_SUCCESS, groups: data, pagination});
        })
        .catch(error => {
            dispatch({type: actionTypes.LOAD_GROUPS_FAILED});
            console.log(error);
        });
};

export const addRole = data => dispatch => {
    dispatch({type: actionTypes.ADDING_GROUP});

    return RoleApi
        .add(data)
        .then(({added}) => {
            if(added){
                dispatch({type: actionTypes.ADD_GROUP_SUCCESS});
                dispatch({
                    type: actionTypes.OPERATION_SUCCESSFUL,
                    action: actionTypes.ADD_GROUP,
                    timestamp: getTime(Date()),
                    data: {added}
                });
            }
        })
        .catch(error => {
            dispatch({
                type: actionTypes.OPERATION_FAILED,
                action: actionTypes.ADD_GROUP,
                timestamp: getTime(Date()),
                data: {...error}
            });
            dispatch({type: actionTypes.ADD_GROUP_FAILED});
            console.log(error);});
};

export const editRole = (role, data, action = null) => dispatch => {
    dispatch({type: actionTypes.EDITING_GROUP});

    return RoleApi
        .edit(role, data)
        .then(({updated}) => {
            if(updated){
                dispatch({type: actionTypes.EDIT_GROUP_SUCCESS});
                action = action ? action : actionTypes.EDIT_GROUP;
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
                action: actionTypes.EDIT_GROUP,
                timestamp: getTime(Date()),
                data: {...error}
            });
            dispatch({type: actionTypes.EDIT_GROUP_FAILED});
            console.log(error);});
};

export const deleteRole = role => dispatch => {
    dispatch({type: actionTypes.DELETING_GROUP});

    return RoleApi
        .delete(role)
        .then(({deleted}) => {
            if(deleted){
                dispatch({type: actionTypes.DELETE_GROUP_SUCCESS});
                dispatch({
                    type: actionTypes.OPERATION_SUCCESSFUL,
                    action: actionTypes.DELETE_GROUP,
                    timestamp: getTime(Date()),
                    data: {deleted}
                });
            }
        })
        .catch(error => {
            dispatch({
                type: actionTypes.OPERATION_FAILED,
                action: actionTypes.DELETE_GROUP,
                timestamp: getTime(Date()),
                data: {...error}
            });
            dispatch({type: actionTypes.DELETE_GROUP_FAILED});
            console.log(error);});
};



export const loadGates = () => dispatch => {
    dispatch({type: actionTypes.LOADING_GATES});

    return RoleDependenciesApi
        .gates()
        .then(gates => {
            dispatch({type: actionTypes.LOAD_GATES_SUCCESS, gates});
        })
        .catch(error => {
            dispatch({type: actionTypes.LOAD_GATES_FAILED});
            console.log(error);});
};

export const loadEntities = params => dispatch => {
    dispatch({type: actionTypes.LOADING_ENTITIES});

    return RoleDependenciesApi
        .entities(params)
        .then(entities => {
            dispatch({type: actionTypes.LOAD_GATE_ENTITIES_SUCCESS, entities});
        })
        .catch(error => {
            dispatch({type: actionTypes.LOAD_GATE_ENTITIES_FAILED});
            console.log(error);});
};

export const loadActions = params => dispatch => {
    dispatch({type: actionTypes.LOADING_ACTIONS});

    return RoleDependenciesApi
        .actions(params)
        .then(actions => {
            dispatch({type: actionTypes.LOAD_ENTITY_ACTIONS_SUCCESS, actions});
        })
        .catch(error => {
            dispatch({type: actionTypes.LOAD_ENTITY_ACTIONS_FAILED});
            console.log(error);});
};