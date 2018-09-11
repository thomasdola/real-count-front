import queryString from 'query-string';
import axios from './index';

const ENDPOINT = "/internal-api/id-types";

export default class IDTypeApi {
    static all(queryParams){
        const queryText = queryString.stringify(queryParams);
        return axios.get(`${ENDPOINT}?${queryText}`);
    }
}