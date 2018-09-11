import queryString from 'query-string';
import axios from './index';
const ENDPOINT = "/internal-api/policies";

export default class PolicyApi{

    static list(params){
        const queryText = queryString.stringify(params);
        return axios.get(`${ENDPOINT}/list?${queryText}`);
    }

    static add(data){
        return axios.post(`${ENDPOINT}`, data);
    }

    static edit(policy, data){
        data.append("_method", "PUT");
        return axios.post(`${ENDPOINT}/${policy}`, data);
    }

    static delete(policy){
        return axios.delete(`${ENDPOINT}/${policy}`);
    }
}