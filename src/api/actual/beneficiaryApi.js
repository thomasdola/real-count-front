// import {IBeneficiaryApi} from '../interfaces/IBeneficiaryApi';
import queryString from 'query-string';
import axios from './index';
const ENDPOINT = "/internal-api/beneficiaries";

export default class beneficiaryApi{

    static all(queryParams){
        const queryText = queryString.stringify(queryParams);
        return axios.get(`${ENDPOINT}?${queryText}`);
    }

    static single(beneficiaryId){
        return axios.get(`${ENDPOINT}/${beneficiaryId}`);
    }

    static create(data){
        return axios.post(`${ENDPOINT}`, data);
    }

    static update(beneficiaryId, data){
        data.append("_method", "PUT");
        return axios.post(`${ENDPOINT}/${beneficiaryId}`, data);
    }

    static remove(beneficiaryId){
        return axios.delete(`${ENDPOINT}/${beneficiaryId}`);
    }
};