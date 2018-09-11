import * as actionTypes from './types';
import {getTime} from "date-fns";
// import PolicyApi from '../api/mock/policyMockApi';
import PolicyApi from '../api/actual/policyApi';


export const loadPolicies = (params = {}) => dispatch => {
    dispatch({type: actionTypes.LOADING_POLICIES});

    return PolicyApi
        .list(params)
        .then(policies => {
            dispatch({type: actionTypes.LOAD_POLICIES_SUCCESS, policies});
        })
        .catch(error => {
            dispatch({type: actionTypes.LOAD_POLICIES_FAILED});
            console.log(error);});
};

export const loadGroupPolicies = params => dispatch => {
    dispatch({type: actionTypes.LOADING_GROUP_POLICIES});

    return PolicyApi
        .list(params)
        .then(policies => {
            dispatch({type: actionTypes.LOAD_GROUP_POLICIES_SUCCESS, policies});
        })
        .catch(error => {
            dispatch({type: actionTypes.LOAD_GROUP_POLICIES_FAILED});
            console.log(error);});
};

export const addPolicy = data => dispatch => {
    dispatch({type: actionTypes.ADDING_POLICY});

    return PolicyApi
        .add(data)
        .then(({added}) => {
            if(added){
                dispatch({type: actionTypes.ADD_POLICY_SUCCESS});
                dispatch({
                    type: actionTypes.OPERATION_SUCCESSFUL,
                    action: actionTypes.ADD_POLICY,
                    timestamp: getTime(Date()),
                    data: {added}
                });
            }
        })
        .catch(error => {
            dispatch({
                type: actionTypes.OPERATION_FAILED,
                action: actionTypes.ADD_POLICY,
                timestamp: getTime(Date()),
                data: {...error}
            });
            dispatch({type: actionTypes.ADD_POLICY_FAILED});
            console.log(error);});
};

export const editPolicy = (policy, data) => dispatch => {
    dispatch({type: actionTypes.EDITING_POLICY});

    return PolicyApi
        .edit(policy, data)
        .then(({updated}) => {
            if(updated){
                dispatch({type: actionTypes.EDIT_POLICY_SUCCESS});

                dispatch({
                    type: actionTypes.OPERATION_SUCCESSFUL,
                    action: actionTypes.EDIT_POLICY,
                    timestamp: getTime(Date()),
                    data: {updated}
                });
            }
        })
        .catch(error => {
            dispatch({
                type: actionTypes.OPERATION_FAILED,
                action: actionTypes.EDIT_POLICY,
                timestamp: getTime(Date()),
                data: {...error}
            });
            dispatch({type: actionTypes.EDIT_POLICY_FAILED});
            console.log(error);});
};

export const deletePolicy = policy => dispatch => {
    dispatch({type: actionTypes.DELETING_POLICY});

    return PolicyApi
        .delete(policy)
        .then(({deleted}) => {
            if(deleted){
                dispatch({type: actionTypes.DELETE_POLICY_SUCCESS});
                dispatch({
                    type: actionTypes.OPERATION_SUCCESSFUL,
                    action: actionTypes.DELETE_POLICY,
                    timestamp: getTime(Date()),
                    data: {deleted}
                });
            }
        })
        .catch(error => {
            dispatch({
                type: actionTypes.OPERATION_FAILED,
                action: actionTypes.DELETE_POLICY,
                timestamp: getTime(Date()),
                data: {...error}
            });
            dispatch({type: actionTypes.DELETE_POLICY_FAILED});
            console.log(error);});
};