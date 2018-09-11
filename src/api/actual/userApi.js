import queryString from 'query-string';
import axios from './index';
const ENDPOINT = "/internal-api/users";

export default class UserApi{

    static list(params){
        const queryText = queryString.stringify(params);
        return axios.get(`${ENDPOINT}?${queryText}`);
    }

    static add(data){
        return axios.post(`${ENDPOINT}`, data);
    }

    static edit(user, data){
        data.append("_method", "PUT");
        return axios.post(`${ENDPOINT}/${user}`, data);
    }

    static delete(user){
        return axios.delete(`${ENDPOINT}/${user}`);
    }
}