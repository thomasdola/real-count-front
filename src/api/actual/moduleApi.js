import queryString from 'query-string';
import axios from './index';

const ENDPOINT = "/internal-api/modules";

export default class ModuleApi {
    static all(queryParams){
        const queryText = queryString.stringify(queryParams);
        return axios.get(`${ENDPOINT}?${queryText}`);
    }
}