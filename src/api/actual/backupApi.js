import queryString from 'query-string';
import axios from './index';
const BACKUP_ENDPOINT = "/internal-api/backups";
const BACKUP_SCHEDULE_ENDPOINT = "/internal-api/jobs";

export default class BackupApi{
    static list(params){
        const queryText = queryString.stringify(params);
        return axios.get(`${BACKUP_ENDPOINT}?${queryText}`);
    }

    static create(data){
        return axios.post(`${BACKUP_ENDPOINT}`, data);
    }

    static delete(backup){
        return axios.delete(`${BACKUP_ENDPOINT}/${backup}`);
    }

    static restore(backup, data){
        data.append("_method", "PUT");
        return axios.post(`${BACKUP_ENDPOINT}/${backup}/restore`, data);
    }

    static schedules(){
        return axios.get(`${BACKUP_SCHEDULE_ENDPOINT}`);
    }

    static updateSchedule(schedule, data){
        data.append("_method", "PUT");
        return axios.post(`${BACKUP_SCHEDULE_ENDPOINT}/${schedule}/update`, data);
    }
}