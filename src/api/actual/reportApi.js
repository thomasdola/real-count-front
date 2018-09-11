import axios from './index';
const ENDPOINT = "/internal-api/reports";

export default class ReportApi {
    static generate(data){
        return axios.post(`${ENDPOINT}/generate`, data);
    }
}