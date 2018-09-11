import axios from './index';
import queryString from "query-string";
const ENDPOINT = "/internal-api/dashboard";

export default class DashboardApi{

    static data(params){
        const queryText = Object.values(params).length > 0
            ? `?${queryString.stringify(params)}` : '';

        return axios.get(`${ENDPOINT}${queryText}`);
    }
}