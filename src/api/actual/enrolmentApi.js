import axios from './index';

const ENDPOINT = "/internal-api/enrolment";

export default class EnrolmentApi{

    static checkBid(data){
        return axios.post(`${ENDPOINT}/check-bid`, data);
    }

    static enrol(data){
        return axios.post(`${ENDPOINT}/enrol`, data);
    }
}