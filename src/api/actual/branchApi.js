import queryString from 'query-string';
import axios from './index';
const REGIONS_ENDPOINT = "/internal-api/regions";
const DISTRICTS_ENDPOINT = "/internal-api/districts";
const LOCATIONS_ENDPOINT = "/internal-api/locations";

export class BranchRegionApi{
    static list(params){
        const queryText = queryString.stringify(params);
        return axios.get(`${REGIONS_ENDPOINT}/list?${queryText}`);
    }
}

export class BranchDistrictApi{
    static list(params){
        const queryText = queryString.stringify(params);
        return axios.get(`${DISTRICTS_ENDPOINT}/list?${queryText}`);
    }

    static add(data){
        return axios.get(`${DISTRICTS_ENDPOINT}`, data);
    }

    static edit(district, data){
        data.append("_method", "PUT");
        return axios.post(`${DISTRICTS_ENDPOINT}/${district}`, data);
    }

    static delete(district){
        return axios.delete(`${DISTRICTS_ENDPOINT}/${district}`);
    }
}

export class BranchCityApi{
    static list(params){
        const queryText = queryString.stringify(params);
        return axios.get(`${LOCATIONS_ENDPOINT}/list?${queryText}`);
    }

    static add(data){
        return axios.post(`${LOCATIONS_ENDPOINT}`, data);
    }

    static edit(city, data){
        data.append("_method", "PUT");
        return axios.post(`${LOCATIONS_ENDPOINT}/${city}`, data);
    }

    static delete(city){
        return axios.delete(`${LOCATIONS_ENDPOINT}/${city}`);
    }
}