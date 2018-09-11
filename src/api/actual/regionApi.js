import queryString from 'query-string';
import axios from './index';

const ENDPOINT = "/internal-api/regions";

export default class RegionApi {
    static all(queryParams){
        const queryText = queryString.stringify(queryParams);
        return axios.get(`${ENDPOINT}?${queryText}`);
    }
}