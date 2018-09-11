import * as actionTypes from "../types";

const DEVICE_STATUS_CHANGED = "DEVICES_UPDATED";

export const initSocketListeners = (socket, {onDeviceStatusChanged}) => {
    socket.on(`gate_devices_channel:${DEVICE_STATUS_CHANGED}`, data => onDeviceStatusChanged(JSON.parse(data)));
};

export const stopSocketListeners = socket => {
    socket.off(`gate_devices_channel:${DEVICE_STATUS_CHANGED}`);
};

export const onDeviceStatusChanged = device => ({type: actionTypes.NEW_CONNECTED_DEVICES, device});