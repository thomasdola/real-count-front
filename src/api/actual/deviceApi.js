import queryString from 'query-string';
import axios from './index';

const ENDPOINT = "/internal-api/devices";


export default class DeviceApi {
    static list(params){
        const queryText = queryString.stringify(params);
        return axios.get(`${ENDPOINT}/list?${queryText}`);
    }

    static logs(device, params){
        const queryText = queryString.stringify(params);
        return axios.get(`${ENDPOINT}/${device}/history?${queryText}`);
    }

    static single(device){
        return axios.get(`${ENDPOINT}/${device}`);
    }

    static assistants(device){
        return axios.get(`${ENDPOINT}/${device}/assistants`);
    }

    static deviceOperators(){
        return axios.get(`${ENDPOINT}/operators`);
    }

    static add(data){
        return axios.post(`${ENDPOINT}`, data);
    }

    static map(device, data){
        data.append("_method", "PUT");
        return axios.post(`${ENDPOINT}/${device}/map`, data);
    }

    static edit(device, data){
        data.append("_method", "PUT");
        return axios.post(`${ENDPOINT}/${device}`, data);
    }

    static delete(device){
        return axios.delete(`${ENDPOINT}/${device}`);
    }

    static addAssistant(device, data){
        data.append("_method", "PUT");
        return axios.post(`${ENDPOINT}/${device}/map`, data);
    }

    static removeAssistant(device, data){
        data.append("_method", "PUT");
        return axios.post(`${ENDPOINT}/${device}/unmap`, data);
    }
}