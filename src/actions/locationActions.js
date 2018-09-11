import * as actionTypes from './types';
// import locationApi from '../api/mock/locationMockApi';
import locationApi from '../api/actual/locationApi';

export const loadLocations = (params, filter) => dispatch => {
    dispatch({type: actionTypes.LOAD_LOCATIONS_LOADING});

    const locationPromise = filter ? allLocations(params) : listLocations(params);

    return locationPromise
        .then((body) => {
            const type = filter 
                ? actionTypes.LOAD_FILTER_LOCATIONS_SUCCESS
                : actionTypes.LOAD_LOCATIONS_SUCCESS;

            const pagination = filter ? {} : body.meta.pagination;

            const locations = filter ? body : body.data;

            dispatch({type, locations, pagination});
        })
        .catch(error => {
            console.log(error);
        });
};

const allLocations = params => locationApi.all(params);
const listLocations = params => locationApi.list(params);