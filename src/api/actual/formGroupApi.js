import queryString from 'query-string';
import axios from './index';
const ENDPOINT = "/internal-api/forms";


export default class FormGroupApi {
    static all(params){
        const queryText = Object.values(params).length > 0
            ? `?${queryString.stringify(params)}` : '';
        return axios.get(`${ENDPOINT}/list${queryText}`);
    }

    static generate(data){
        return axios.post(`${ENDPOINT}`, data);
    }

    static reGenerate(formUUID){
        return axios.get(`${ENDPOINT}/${formUUID}/regenerate`);
    }
}