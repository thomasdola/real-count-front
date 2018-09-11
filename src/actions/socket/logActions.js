import {makeChannel} from "./enrolmentActions";
import {getTime} from "date-fns";
import * as actionTypes from "../types";
import _each from "lodash/each";

export const ACTIVITY_LOGS_EXPORTED = "ACTIVITY_LOGS_EXPORTED";
export const ACTIVITY_LOGS_EXPORT_FAILED = "ACTIVITY_LOGS_EXPORT_FAILED";
export const NEW_ACTIVITY_LOG = "NEW_ACTIVITY_LOG";

export const initSocketListeners = (socket, {authUser: {channel}, hooks}) => {
    _each(hooks, ({event, listener, channel: ownChannel}) => {
        channel = ownChannel
            ? `${ownChannel}:${event}`
            : makeChannel(channel, event);
        socket.on(channel, data => listener(JSON.parse(data)));
    });
};

export const stopSocketListeners = (socket, {authUser: {channel}, events}) => {
    _each(events, event => {
        channel = event === NEW_ACTIVITY_LOG
            ? `gate_logs_channel:${event}`
            : makeChannel(channel, event);
        socket.off(channel);
    });
};

export const onLogsExported = data => ({
    type: actionTypes.OPERATION_SUCCESSFUL,
    action: actionTypes.EXPORT_LOGS,
    timestamp: getTime(Date()),
    data: {...data}
});

export const onLogsExportFailed = error => ({
    type: actionTypes.OPERATION_FAILED,
    action: actionTypes.EXPORT_LOGS,
    timestamp: getTime(Date()),
    data: {...error}
});

export const onNewActivityLog = log => ({
    type: actionTypes.NEW_ACTIVITY_LOG,
    log
});