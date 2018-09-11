import queryString from 'query-string';
import axios from './index';
const ENDPOINT = "/internal-api/attendances/list";

export default class AttendanceApi{
    static todayAttendance(params){
        const queryText = queryString.stringify(params);
        return axios.get(`${ENDPOINT}?${queryText}`);
    }

    static beneficiaryWeeklyAttendance(beneficiaryUUID, params){
        const queryText = queryString.stringify(params);
        return axios.get(`${ENDPOINT}/for/${beneficiaryUUID}?${queryText}`);
    }
}