import queryString from 'query-string';
import axios from './index';

const ENDPOINT = "/internal-api/activity-logs";

export default class BackupApi{
    static list(params){
        const queryText = queryString.stringify(params);
        return axios.get(`${ENDPOINT}?${queryText}`);
    }

    static export(params){
        const queryText = queryString.stringify(params);
        return axios.get(`${ENDPOINT}/export?${queryText}`);
    }
}