import queryString from 'query-string';
import axios from './index';

const ENDPOINT = "/internal-api";

export default class RoleDependencyApi{

    static gates(){
        return axios.get(`${ENDPOINT}/gates`);
    }

    static entities(params){
        const queryText = queryString.stringify(params);
        return axios.get(`${ENDPOINT}/entities?${queryText}`);
    }

    static actions(params){
        const queryText = queryString.stringify(params);
        return axios.get(`${ENDPOINT}/actions?${queryText}`);
    }
}