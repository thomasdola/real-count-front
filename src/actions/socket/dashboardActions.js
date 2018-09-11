import {UPDATE_DASHBOARD} from '../types';
import _each from 'lodash/each';
import {makeChannel} from "./enrolmentActions";

export const BENEFICIARIES_UPDATED = "BENEFICIARIES_UPDATED";
export const ATTENDANCE_UPDATED = "ATTENDANCE_UPDATED";
export const DEVICES_UPDATED = "DEVICES_UPDATED";

export const initSectionSocketListeners = (socket, {channel, hooks}) => {
    _each(hooks, ({event, listener}) => {
        socket.on(makeChannel(channel, event), data => listener(JSON.parse(data)));
    });
};

export const stopSectionSocketListeners = (socket, {channel, events}) => {
    _each(events, event => {
        socket.off(makeChannel(channel, event));
    });
};

export const initSocketListeners = (socket, {onBeneficiariesUpdate, onDevicesUpdate, onAttendanceUpdate}) => {
    socket.on(BENEFICIARIES_UPDATED, data => onBeneficiariesUpdate(JSON.parse(data)));
    socket.on(DEVICES_UPDATED, data => onDevicesUpdate(JSON.parse(data)));
    socket.on(ATTENDANCE_UPDATED, data => onAttendanceUpdate(JSON.parse(data)));
};

export const stopSocketListeners = socket => {
    socket.off(BENEFICIARIES_UPDATED);
    socket.off(DEVICES_UPDATED);
    socket.off(ATTENDANCE_UPDATED);
};

export const onBeneficiariesUpdate = data => ({type: UPDATE_DASHBOARD, data});

export const onDevicesUpdate = data => ({type: UPDATE_DASHBOARD, data});

export const onAttendanceUpdate = data => ({type: UPDATE_DASHBOARD, data});