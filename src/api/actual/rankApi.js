import queryString from 'query-string';
import axios from './index';

const ENDPOINT = "/internal-api/ranks";

export default class RankApi {
    static all(queryParams){
        const queryText = queryString.stringify(queryParams);
        return axios.get(`${ENDPOINT}?${queryText}`);
    }
}