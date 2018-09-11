import queryString from 'query-string';
import axios from './index';
const ENDPOINT = "/internal-api/roles";

export default class RoleApi{

    static all(){
        return axios.get(`${ENDPOINT}`);
    }

    static list(params){
        const queryText = queryString.stringify(params);
        return axios.get(`${ENDPOINT}/list?${queryText}`);
    }

    static add(data){
        return axios.post(`${ENDPOINT}`, data);
    }

    static edit(role, data){
        data.append("_method", "PUT");
        return axios.post(`${ENDPOINT}/${role}`, data);
    }

    static delete(role){
        return axios.delete(`${ENDPOINT}/${role}`);
    }
}