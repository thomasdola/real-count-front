import * as actionTypes from '../actions/types';

export const selectedDevice = (state = {}, action) => {
    switch (action.type){
        case actionTypes.SELECT_DEVICE:
            return action.device;
        default:
            return state;
    }
};

export const list = (state = [], action) => {
    switch (action.type){
        case actionTypes.LOAD_DEVICES_SUCCESS:
            return action.devices;
        case actionTypes.NEW_CONNECTED_DEVICES:
            const oldDevices = [...state];
            const newDevices = oldDevices.map(device => {
                if(device.code === action.device.code){
                    return action.device;
                }
                return device;
            });
            return [...newDevices];
        default:
            return state;
    }
};

export const devicesPagination = (state = {}, action) => {
    switch (action.type){
        case actionTypes.LOAD_DEVICES_SUCCESS:
            return action.pagination;
        default:
            return state;
    }
};

export const deviceOperators = (state = [], action) => {
    switch (action.type){
        case actionTypes.LOAD_DEVICE_OPERATORS_SUCCESS:
            return action.operators;
        default:
            return state;
    }
};

export const logs = (state = [], action) => {
    switch (action.type){
        case actionTypes.LOAD_DEVICE_LOGS_SUCCESS:
            return action.logs;
        default:
            return state;
    }
};

export const logsPagination = (state = {}, action) => {
    switch (action.type){
        case actionTypes.LOAD_DEVICE_LOGS_SUCCESS:
            return action.pagination;
        default:
            return state;
    }
};

export const assistants = (state = [], action) => {
    switch (action.type){
        case actionTypes.LOAD_DEVICE_SUPERVISOR_ASSISTANTS_SUCCESS:
            return action.assistants;
        default:
            return state;
    }
};

export const loadingDevices = (state = false, action) => {
    switch (action.type){
        case actionTypes.LOADING_DEVICES:
            return true;
        case actionTypes.LOAD_DEVICES_SUCCESS:
        case actionTypes.LOAD_DEVICES_FAILED:
            return false;
        default:
            return state;
    }
};

export const loadingDeviceLogs = (state = false, action) => {
    switch (action.type){
        case actionTypes.LOADING_DEVICE_LOGS:
            return true;
        case actionTypes.LOAD_DEVICE_LOGS_SUCCESS:
        case actionTypes.LOAD_DEVICE_LOGS_FAILED:
            return false;
        default:
            return state;
    }
};

export const loadingDeviceOperators = (state = false, action) => {
    switch (action.type){
        case actionTypes.LOADING_DEVICE_OPERATORS:
            return true;
        case actionTypes.LOAD_DEVICE_OPERATORS_SUCCESS:
        case actionTypes.LOAD_DEVICE_OPERATORS_FAILED:
            return false;
        default:
            return state;
    }
};

export const loadingDeviceSupervisorAssistants = (state = false, action) => {
    switch (action.type){
        case actionTypes.LOADING_DEVICE_SUPERVISOR_ASSISTANTS:
            return true;
        case actionTypes.LOAD_DEVICE_SUPERVISOR_ASSISTANTS_SUCCESS:
        case actionTypes.LOAD_DEVICE_SUPERVISOR_ASSISTANTS_FAILED:
            return false;
        default:
            return state;
    }
};

export const addingDevice = (state = false, action) => {
    switch (action.type){
        case actionTypes.ADDING_DEVICE:
            return true;
        case actionTypes.ADD_DEVICE_SUCCESS:
        case actionTypes.ADD_DEVICE_FAILED:
            return false;
        default:
            return state;
    }
};

export const mappingDevice = (state = false, action) => {
    switch (action.type){
        case actionTypes.MAPPING_DEVICE:
            return true;
        case actionTypes.MAP_DEVICE_SUCCESS:
        case actionTypes.MAP_DEVICE_FAILED:
            return false;
        default:
            return state;
    }
};

export const editingDevice = (state = false, action) => {
    switch (action.type){
        case actionTypes.EDITING_DEVICE:
            return true;
        case actionTypes.EDIT_DEVICE_SUCCESS:
        case actionTypes.EDIT_DEVICE_FAILED:
            return false;
        default:
            return state;
    }
};

export const deletingDevice = (state = false, action) => {
    switch (action.type){
        case actionTypes.DELETING_DEVICE:
            return true;
        case actionTypes.DELETE_DEVICE_SUCCESS:
        case actionTypes.DELETE_DEVICE_FAILED:
            return false;
        default:
            return state;
    }
};

export const addingDeviceSupervisorAssistant = (state = false, action) => {
    switch (action.type){
        case actionTypes.ADDING_DEVICE_SUPERVISOR_ASSISTANT:
            return true;
        case actionTypes.ADD_DEVICE_SUPERVISOR_ASSISTANT_SUCCESS:
        case actionTypes.ADD_DEVICE_SUPERVISOR_ASSISTANT_FAILED:
            return false;
        default:
            return state;
    }
};

export const removingDeviceSupervisorAssistant = (state = false, action) => {
    switch (action.type){
        case actionTypes.REMOVING_DEVICE_SUPERVISOR_ASSISTANT:
            return true;
        case actionTypes.REMOVE_DEVICE_SUPERVISOR_ASSISTANT_SUCCESS:
        case actionTypes.REMOVE_DEVICE_SUPERVISOR_ASSISTANT_FAILED:
            return false;
        default:
            return state;
    }
};