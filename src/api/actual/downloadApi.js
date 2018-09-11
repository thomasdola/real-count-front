import queryString from 'query-string';
import axios from './index';
const ENDPOINT = "/internal-api/download";

export default class DownloadApi{
    static download(params){
        const queryText = queryString.stringify(params);
        return axios.get(`${ENDPOINT}?${queryText}`);
    }
}