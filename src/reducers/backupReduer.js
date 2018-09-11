import * as actionTypes from '../actions/types';

export const list = (state = [], action) => {
    switch (action.type){
        case actionTypes.LOAD_BACKUPS_SUCCESS:
            return action.backups;
        default:
            return state;
    }
};

export const pagination = (state = {}, action) => {
    switch (action.type){
        case actionTypes.LOAD_BACKUPS_SUCCESS:
            return action.pagination;
        default:
            return state;
    }
};

export const schedules = (state = [], action) => {
    switch (action.type){
        case actionTypes.LOAD_BACKUP_SCHEDULES_SUCCESS:
            return action.schedules;
        default:
            return state;
    }
};

export const loadingBackups = (state = false, action) => {
    switch (action.type){
        case actionTypes.LOADING_BACKUPS:
            return true;
        case actionTypes.LOAD_BACKUPS_SUCCESS:
        case actionTypes.LOAD_BACKUPS_FAILED:
            return false;
        default:
            return state;
    }
};

export const restoringBackup = (state = false, action) => {
    switch (action.type){
        case actionTypes.RESTORING_BACKUP:
            return true;
        case actionTypes.RESTORE_BACKUP_SUCCESS:
        case actionTypes.RESTORE_BACKUP_FAILED:
            return false;
        default:
            return state;
    }
};

export const loadingBackupSchedules = (state = false, action) => {
    switch (action.type){
        case actionTypes.LOADING_BACKUP_SCHEDULES:
            return true;
        case actionTypes.LOAD_BACKUP_SCHEDULES_SUCCESS:
        case actionTypes.LOAD_BACKUP_SCHEDULES_FAILED:
            return false;
        default:
            return state;
    }
};

export const updatingBackupSchedule = (state = false, action) => {
    switch (action.type){
        case actionTypes.UPDATING_BACKUP_SCHEDULE:
            return true;
        case actionTypes.UPDATE_BACKUP_SCHEDULE_SUCCESS:
        case actionTypes.UPDATE_BACKUP_SCHEDULE_FAILED:
            return false;
        default:
            return state;
    }
};

export const creatingBackup = (state = false, action) => {
    switch (action.type){
        case actionTypes.CREATING_BACKUP:
            return true;
        case actionTypes.CREATE_BACKUP_SUCCESS:
        case actionTypes.CREATE_BACKUP_FAILED:
            return false;
        default:
            return state;
    }
};

export const deletingBackup = (state = false, action) => {
    switch (action.type){
        case actionTypes.DELETING_BACKUP:
            return true;
        case actionTypes.DELETE_BACKUP_SUCCESS:
        case actionTypes.DELETE_BACKUP_FAILED:
            return false;
        default:
            return state;
    }
};

export const downloadingBackup = (state = false, action) => {
    switch (action.type){
        case actionTypes.DOWNLOADING_BACKUP:
            return true;
        case actionTypes.DOWNLOAD_BACKUP_SUCCESS:
            return false;
        default:
            return state;
    }
};