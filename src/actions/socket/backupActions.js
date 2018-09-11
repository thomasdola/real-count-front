import {makeChannel} from "./enrolmentActions";
import {getTime} from "date-fns";
import * as actionTypes from "../types";

const BACKUP_CREATED = "BACKUP_CREATED";
const BACKUP_CREATION_FAILED = "BACKUP_CREATION_FAILED";
const BACKUP_RESTORED = "BACKUP_RESTORED";
const BACKUP_RESTORATION_FAILED = "BACKUP_RESTORATION_FAILED";
const BACKUP_DELETED = "BACKUP_DELETED";
const BACKUP_DELETION_FAILED = "BACKUP_DELETION_FAILED";

export const initSocketListeners = (socket, {authUser: {channel},
    onBackupCreated, onBackupCreationFailed, onBackupRestored, onBackupRestorationFailed,
    onBackupDeleted, onBackupDeletionFailed}) => {

    socket.on(makeChannel(channel, BACKUP_CREATED), data => onBackupCreated(JSON.parse(data)));
    socket.on(makeChannel(channel, BACKUP_CREATION_FAILED), error => onBackupCreationFailed(JSON.parse(error)));

    socket.on(makeChannel(channel, BACKUP_RESTORED), data => onBackupRestored(JSON.parse(data)));
    socket.on(makeChannel(channel, BACKUP_RESTORATION_FAILED), error => onBackupRestorationFailed(JSON.parse(error)));

    socket.on(makeChannel(channel, BACKUP_DELETED), data => onBackupDeleted(JSON.parse(data)));
    socket.on(makeChannel(channel, BACKUP_DELETION_FAILED), error => onBackupDeletionFailed(JSON.parse(error)));
};

export const stopSocketListeners = (socket, {authUser: {channel}}) => {
    socket.off(makeChannel(channel, BACKUP_CREATED));
    socket.off(makeChannel(channel, BACKUP_CREATION_FAILED));
    socket.off(makeChannel(channel, BACKUP_RESTORED));
    socket.off(makeChannel(channel, BACKUP_RESTORATION_FAILED));
    socket.off(makeChannel(channel, BACKUP_DELETED));
    socket.off(makeChannel(channel, BACKUP_DELETION_FAILED));
};

export const onBackupCreated = data => ({
    type: actionTypes.OPERATION_SUCCESSFUL,
    action: actionTypes.CREATE_BACKUP,
    timestamp: getTime(Date()),
    data: {...data}
});

export const onBackupCreationFailed = error => ({
    type: actionTypes.OPERATION_FAILED,
    action: actionTypes.CREATE_BACKUP,
    timestamp: getTime(Date()),
    data: {...error}
});

export const onBackupRestored = data => ({
    type: actionTypes.OPERATION_SUCCESSFUL,
    action: actionTypes.RESTORE_BACKUP,
    timestamp: getTime(Date()),
    data: {...data}
});

export const onBackupRestorationFailed = error => ({
    type: actionTypes.OPERATION_FAILED,
    action: actionTypes.RESTORE_BACKUP,
    timestamp: getTime(Date()),
    data: {...error}
});

export const onBackupDeleted = data => ({
    type: actionTypes.OPERATION_SUCCESSFUL,
    action: actionTypes.DELETE_BACKUP,
    timestamp: getTime(Date()),
    data: {...data}
});

export const onBackupDeletionFailed = error => ({
    type: actionTypes.OPERATION_FAILED,
    action: actionTypes.DELETE_BACKUP,
    timestamp: getTime(Date()),
    data: {...error}
});