import queryString from 'query-string';
import axios from './index';

const ENDPOINT = "/internal-api/districts";

export default class DistrictApi {
    static all(queryParams){
        const queryText = queryString.stringify(queryParams);
        return axios.get(`${ENDPOINT}?${queryText}`);
    }

    static list(queryParams){
        const queryText = queryString.stringify(queryParams);
        return axios.get(`${ENDPOINT}/list?${queryText}`);
    }
}