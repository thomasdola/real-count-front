import * as actionTypes from './types';
// import BackupApi from '../api/mock/backupMockApi';
import BackupApi from '../api/actual/backupApi';
import {getTime} from "date-fns";


export const loadBackups = params => dispatch => {
    dispatch({type: actionTypes.LOADING_BACKUPS});

    return BackupApi
        .list(params)
        .then(({data, meta: {pagination}}) => {
            dispatch({type: actionTypes.LOAD_BACKUPS_SUCCESS, backups: data, pagination});
        })
        .catch(error => {
            dispatch({type: actionTypes.LOAD_BACKUPS_FAILED});
            console.log(error);
        });
};

export const createBackup = data => dispatch => {
    dispatch({type: actionTypes.CREATING_BACKUP});

    return BackupApi
        .create(data)
        .then(({created, scheduled}) => {
            dispatch({type: actionTypes.CREATE_BACKUP_SUCCESS});
            dispatch({
                type: actionTypes.OPERATION_SUCCESSFUL,
                action: actionTypes.CREATE_BACKUP,
                timestamp: getTime(Date()),
                data: {created, scheduled}
            });
        })
        .catch(error => {
            dispatch({
                type: actionTypes.OPERATION_FAILED,
                action: actionTypes.CREATE_BACKUP,
                timestamp: getTime(Date()),
                data: {...error}
            });
            dispatch({type: actionTypes.CREATE_BACKUP_FAILED});
            console.log(error);
        });
};

export const restoreBackup = (backup, data) => dispatch => {
    dispatch({type: actionTypes.RESTORING_BACKUP});

    return BackupApi
        .restore(backup, data)
        .then(({restored, scheduled}) => {
            dispatch({type: actionTypes.RESTORE_BACKUP_SUCCESS});

            dispatch({
                type: actionTypes.OPERATION_SUCCESSFUL,
                action: actionTypes.RESTORE_BACKUP,
                timestamp: getTime(Date()),
                data: {restored, scheduled}
            });
        })
        .catch(error => {
            dispatch({
                type: actionTypes.OPERATION_FAILED,
                action: actionTypes.RESTORE_BACKUP,
                timestamp: getTime(Date()),
                data: {...error}
            });
            dispatch({type: actionTypes.RESTORE_BACKUP_FAILED});
            console.log(error);
        });
};

export const deleteBackup = backup => dispatch => {
    dispatch({type: actionTypes.DELETING_BACKUP});

    return BackupApi
        .delete(backup)
        .then(({deleted, scheduled}) => {
            dispatch({type: actionTypes.DELETE_BACKUP_SUCCESS});

            dispatch({
                type: actionTypes.OPERATION_SUCCESSFUL,
                action: actionTypes.DELETE_BACKUP,
                timestamp: getTime(Date()),
                data: {deleted, scheduled}
            });

        })
        .catch(error => {
            dispatch({
                type: actionTypes.OPERATION_FAILED,
                action: actionTypes.DELETE_BACKUP,
                timestamp: getTime(Date()),
                data: {...error}
            });
            dispatch({type: actionTypes.DELETE_BACKUP_FAILED});
            console.log(error);
        });
};

export const loadSchedules = () => dispatch => {
    dispatch({type: actionTypes.LOADING_BACKUP_SCHEDULES});

    return BackupApi
        .schedules()
        .then(schedules => {
            dispatch({type: actionTypes.LOAD_BACKUP_SCHEDULES_SUCCESS, schedules});
        })
        .catch(error => {
            dispatch({type: actionTypes.LOAD_BACKUP_SCHEDULES_FAILED});
            console.log(error);
        });
};

export const updateSchedule = (schedule, data) => dispatch => {
    dispatch({type: actionTypes.UPDATING_BACKUP_SCHEDULE});

    return BackupApi
        .updateSchedule(schedule, data)
        .then(({updated, backup_schedule}) => {
            dispatch({type: actionTypes.UPDATE_BACKUP_SCHEDULE_SUCCESS});
            dispatch({
                type: actionTypes.OPERATION_SUCCESSFUL,
                action: actionTypes.UPDATE_BACKUP_SCHEDULE,
                timestamp: getTime(Date()),
                data: {updated, backup_schedule}
            });
        })
        .catch(error => {
            dispatch({
                type: actionTypes.OPERATION_FAILED,
                action: actionTypes.UPDATE_BACKUP_SCHEDULE,
                timestamp: getTime(Date()),
                data: {...error}
            });
            dispatch({type: actionTypes.UPDATE_BACKUP_SCHEDULE_FAILED});
        });
};