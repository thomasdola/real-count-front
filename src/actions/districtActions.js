import * as actionTypes from './types';
// import districtApi from '../api/mock/districtMockApi';
import districtApi from '../api/actual/districtApi';

export const selectDistrict = district => ({type: actionTypes.SELECT_DISTRICT, district});

export const loadDistricts = (params, filter) => dispatch => {
    dispatch({type: actionTypes.LOAD_DISTRICTS_LOADING});

    const districtPromise = filter ? allDistricts(params) : listDistricts(params);
    
    return districtPromise
        .then((body) => {
            const type = filter 
                ? actionTypes.LOAD_FILTER_DISTRICTS_SUCCESS 
                : actionTypes.LOAD_DISTRICTS_SUCCESS;

            const pagination = filter ? {} : body.meta.pagination;

            const districts = filter ? body : body.data;

            dispatch({type, districts, pagination});
        }).catch(error => {
            console.log(error);
        });
};

const allDistricts = params => districtApi.all(params);
const listDistricts = params => districtApi.list(params);