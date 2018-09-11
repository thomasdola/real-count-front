import * as actionTypes from './types';
// import deviceApi from '../api/mock/deviceMockApi';
import deviceApi from '../api/actual/deviceApi';
import {getTime} from "date-fns";

export const selectDevice = device => ({type: actionTypes.SELECT_DEVICE, device});

export const addDevice = data => dispatch => {
    dispatch({type: actionTypes.ADDING_DEVICE});

    return deviceApi
        .add(data)
        .then(({added}) => {
            if(added){
                dispatch({type: actionTypes.ADD_DEVICE_SUCCESS});
                dispatch({
                    type: actionTypes.OPERATION_SUCCESSFUL,
                    action: actionTypes.ADD_DEVICE,
                    timestamp: getTime(Date()),
                    data: {added}
                });
            }
        })
        .catch(error => {
            dispatch({
                type: actionTypes.OPERATION_FAILED,
                action: actionTypes.ADD_DEVICE,
                timestamp: getTime(Date()),
                data: {...error}
            });
            dispatch({type: actionTypes.ADD_DEVICE_FAILED});
            console.log(error);
        });
};

export const deleteDevice = device => dispatch => {
    dispatch({type: actionTypes.DELETING_DEVICE});

    return deviceApi
        .delete(device)
        .then(({deleted}) => {
            if(deleted){
                dispatch({type: actionTypes.DELETE_DEVICE_SUCCESS});
                dispatch({
                    type: actionTypes.OPERATION_SUCCESSFUL,
                    action: actionTypes.DELETE_DEVICE,
                    timestamp: getTime(Date()),
                    data: {deleted}
                });
            }
        })
        .catch(error => {
            dispatch({
                type: actionTypes.OPERATION_FAILED,
                action: actionTypes.DELETE_DEVICE,
                timestamp: getTime(Date()),
                data: {...error}
            });
            dispatch({type: actionTypes.DELETE_DEVICE_FAILED});
            console.log(error);
        });
};

export const mapDevice = (device, data) => dispatch => {
    dispatch({type: actionTypes.MAPPING_DEVICE});

    return deviceApi
        .map(device, data)
        .then(({mapped}) => {
            if(mapped){
                dispatch({type: actionTypes.MAP_DEVICE_SUCCESS});
                dispatch({
                    type: actionTypes.OPERATION_SUCCESSFUL,
                    action: actionTypes.MAP_DEVICE,
                    timestamp: getTime(Date()),
                    data: {mapped}
                });
            }
        })
        .catch(error => {
            dispatch({
                type: actionTypes.OPERATION_FAILED,
                action: actionTypes.MAP_DEVICE,
                timestamp: getTime(Date()),
                data: {...error}
            });
            dispatch({type: actionTypes.MAP_DEVICE_FAILED});
            console.log(error);
        });
};

export const editDevice = (device, data) => dispatch => {
    dispatch({type: actionTypes.EDITING_DEVICE});

    return deviceApi
        .edit(device, data)
        .then(({updated}) => {
            if(updated){
                dispatch({type: actionTypes.EDIT_DEVICE_SUCCESS});
                dispatch({
                    type: actionTypes.OPERATION_SUCCESSFUL,
                    action: actionTypes.EDIT_DEVICE,
                    timestamp: getTime(Date()),
                    data: {updated}
                });
            }
        })
        .catch(error => {
            dispatch({
                type: actionTypes.OPERATION_FAILED,
                action: actionTypes.EDIT_DEVICE,
                timestamp: getTime(Date()),
                data: {...error}
            });
            dispatch({type: actionTypes.EDIT_DEVICE_FAILED});
            console.log(error);
        });
};

export const addAssistant = (device, data) => dispatch => {
    dispatch({type: actionTypes.ADDING_DEVICE_SUPERVISOR_ASSISTANT});

    return deviceApi
        .addAssistant(device, data)
        .then(({mapped}) => {
            if(mapped){
                dispatch({type: actionTypes.ADD_DEVICE_SUPERVISOR_ASSISTANT_SUCCESS});
                dispatch({
                    type: actionTypes.OPERATION_SUCCESSFUL,
                    action: actionTypes.ADD_DEVICE_SUPERVISOR_ASSISTANT,
                    timestamp: getTime(Date()),
                    data: {added: mapped}
                });
            }
        })
        .catch(error => {
            dispatch({
                type: actionTypes.OPERATION_FAILED,
                action: actionTypes.ADD_DEVICE_SUPERVISOR_ASSISTANT,
                timestamp: getTime(Date()),
                data: {...error}
            });
            dispatch({type: actionTypes.ADD_DEVICE_SUPERVISOR_ASSISTANT_FAILED});
            console.log(error);
        });
};

export const removeAssistant = (device, data) => dispatch => {
    dispatch({type: actionTypes.REMOVING_DEVICE_SUPERVISOR_ASSISTANT});

    return deviceApi
        .removeAssistant(device, data)
        .then(({unMapped}) => {
            if(unMapped){
                dispatch({type: actionTypes.REMOVE_DEVICE_SUPERVISOR_ASSISTANT_SUCCESS});
                dispatch({
                    type: actionTypes.OPERATION_SUCCESSFUL,
                    action: actionTypes.REMOVE_DEVICE_SUPERVISOR_ASSISTANT,
                    timestamp: getTime(Date()),
                    data: {removed: unMapped}
                });
            }
        })
        .catch(error => {
            dispatch({
                type: actionTypes.OPERATION_FAILED,
                action: actionTypes.REMOVE_DEVICE_SUPERVISOR_ASSISTANT,
                timestamp: getTime(Date()),
                data: {...error}
            });
            dispatch({type: actionTypes.REMOVE_DEVICE_SUPERVISOR_ASSISTANT_FAILED});
            console.log(error);
        });
};

export const loadDevices = params => dispatch => {
    dispatch({type: actionTypes.LOADING_DEVICES});

    return deviceApi
        .list(params)
        .then(({data, meta: {pagination}}) => {
            dispatch({type: actionTypes.LOAD_DEVICES_SUCCESS, devices: data, pagination});
        })
        .catch(error => {
            dispatch({type: actionTypes.LOAD_DEVICES_FAILED});
            console.log(error);
        });
};

export const loadDeviceLogs = (device, params = {}) => dispatch => {
    dispatch({type: actionTypes.LOADING_DEVICE_LOGS});

    return deviceApi
        .logs(device, params)
        .then(({data, meta: {pagination}}) => {
            dispatch({type: actionTypes.LOAD_DEVICE_LOGS_SUCCESS, logs: data, pagination});
        })
        .catch(error => {
            dispatch({type: actionTypes.LOAD_DEVICE_LOGS_FAILED});
            console.log(error);
        });
};

export const loadDeviceSupervisorAssistants = (device) => dispatch => {
    dispatch({type: actionTypes.LOADING_DEVICE_SUPERVISOR_ASSISTANTS});

    return deviceApi
        .assistants(device)
        .then(assistants => {
            dispatch({type: actionTypes.LOAD_DEVICE_SUPERVISOR_ASSISTANTS_SUCCESS, assistants});
        })
        .catch(error => {
            dispatch({type: actionTypes.LOAD_DEVICE_SUPERVISOR_ASSISTANTS_FAILED});
            console.log(error);
        });
};

export const loadDeviceOperators = (device) => dispatch => {
    dispatch({type: actionTypes.LOADING_DEVICE_OPERATORS});

    return deviceApi
        .deviceOperators(device)
        .then(operators => {
            dispatch({type: actionTypes.LOAD_DEVICE_OPERATORS_SUCCESS, operators});
        })
        .catch(error => {
            dispatch({type: actionTypes.LOAD_DEVICE_OPERATORS_FAILED});
            console.log(error);
        });
};