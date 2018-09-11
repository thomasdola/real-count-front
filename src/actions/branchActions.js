import * as actionTypes from './types';
import {getTime} from "date-fns";
// import {BranchCityApi, BranchDistrictApi, BranchRegionApi} from '../api/mock/branchMockApi';
import {BranchCityApi, BranchDistrictApi, BranchRegionApi} from '../api/actual/branchApi';

export const loadRegions = params => dispatch => {
    dispatch({type: actionTypes.LOADING_LOCATION_REGIONS});

    return BranchRegionApi
        .list(params)
        .then(({data, meta: {pagination}}) => {
            dispatch({type: actionTypes.LOAD_LOCATION_REGIONS_SUCCESS, regions: data, pagination});
        })
        .catch(error => {
            dispatch({type: actionTypes.LOAD_LOCATION_REGIONS_FAILED});
            console.log(error)});
};

export const loadDistricts = params => dispatch => {
    dispatch({type: actionTypes.LOADING_LOCATION_DISTRICTS});

    return BranchDistrictApi
        .list(params)
        .then(({data, meta: {pagination}}) => {
            dispatch({type: actionTypes.LOAD_LOCATION_DISTRICTS_SUCCESS, districts: data, pagination});
        })
        .catch(error => {
            dispatch({type: actionTypes.LOAD_LOCATION_DISTRICTS_FAILED});
            console.log(error)});
};

export const addDistrict = data => dispatch => {
    dispatch({type: actionTypes.ADDING_LOCATION_DISTRICT});

    return BranchDistrictApi
        .add(data)
        .then(({added}) => {
            if(added){
                dispatch({type: actionTypes.ADD_LOCATION_DISTRICT_SUCCESS});
                dispatch({
                    type: actionTypes.OPERATION_SUCCESSFUL,
                    action: actionTypes.ADD_LOCATION_DISTRICT,
                    timestamp: getTime(Date()),
                    data: {added}
                });
            }
        })
        .catch(error => {
            dispatch({
                type: actionTypes.OPERATION_FAILED,
                action: actionTypes.ADD_LOCATION_DISTRICT,
                timestamp: getTime(Date()),
                data: {...error}
            });
            dispatch({type: actionTypes.ADD_LOCATION_DISTRICT_FAILED});
            console.log(error)});
};

export const editDistrict = (district, data) => dispatch => {
    dispatch({type: actionTypes.EDITING_LOCATION_DISTRICT});

    return BranchDistrictApi
        .edit(district, data)
        .then(({updated}) => {
            if(updated){
                dispatch({type: actionTypes.EDIT_LOCATION_DISTRICT_SUCCESS});
                dispatch({
                    type: actionTypes.OPERATION_SUCCESSFUL,
                    action: actionTypes.EDIT_LOCATION_DISTRICT,
                    timestamp: getTime(Date()),
                    data: {updated}
                });
            }
        })
        .catch(error => {
            dispatch({
                type: actionTypes.OPERATION_FAILED,
                action: actionTypes.EDIT_LOCATION_DISTRICT,
                timestamp: getTime(Date()),
                data: {...error}
            });
            dispatch({type: actionTypes.EDIT_LOCATION_DISTRICT_FAILED});
            console.log(error)});
};

export const deleteDistrict = district => dispatch => {
    dispatch({type: actionTypes.DELETING_LOCATION_DISTRICT});

    return BranchDistrictApi
        .delete(district)
        .then(({deleted}) => {
            if(deleted){
                dispatch({type: actionTypes.DELETE_LOCATION_DISTRICT_SUCCESS});
                dispatch({
                    type: actionTypes.OPERATION_SUCCESSFUL,
                    action: actionTypes.DELETE_LOCATION_DISTRICT,
                    timestamp: getTime(Date()),
                    data: {deleted}
                });
            }
        })
        .catch(error => {
            dispatch({
                type: actionTypes.OPERATION_FAILED,
                action: actionTypes.DELETE_LOCATION_DISTRICT,
                timestamp: getTime(Date()),
                data: {...error}
            });
            dispatch({type: actionTypes.DELETE_LOCATION_DISTRICT_FAILED});
            console.log(error)});
};

export const loadCities = params => dispatch => {
    dispatch({type: actionTypes.LOADING_LOCATION_CITIES});

    return BranchCityApi
        .list(params)
        .then(({data, meta: {pagination}}) => {
            dispatch({type: actionTypes.LOAD_LOCATION_CITIES_SUCCESS, cities: data, pagination});
        })
        .catch(error => {
            dispatch({type: actionTypes.LOAD_LOCATION_CITIES_FAILED});
            console.log(error)});
};

export const addCity = data => dispatch => {
    dispatch({type: actionTypes.ADDING_LOCATION_CITY});

    return BranchCityApi
        .add(data)
        .then(({added}) => {
            if(added){
                dispatch({type: actionTypes.ADD_LOCATION_CITY_SUCCESS});
                dispatch({
                    type: actionTypes.OPERATION_SUCCESSFUL,
                    action: actionTypes.ADD_LOCATION_CITY,
                    timestamp: getTime(Date()),
                    data: {added}
                });
            }
        })
        .catch(error => {
            dispatch({
                type: actionTypes.OPERATION_FAILED,
                action: actionTypes.ADD_LOCATION_CITY,
                timestamp: getTime(Date()),
                data: {...error}
            });
            dispatch({type: actionTypes.ADD_LOCATION_CITY_FAILED});
            console.log(error)});
};

export const editCity = (city, data) => dispatch => {
    dispatch({type: actionTypes.EDITING_LOCATION_CITY});

    return BranchCityApi
        .edit(city, data)
        .then(({updated}) => {
            if(updated){
                dispatch({type: actionTypes.EDIT_LOCATION_CITY_SUCCESS});
                dispatch({
                    type: actionTypes.OPERATION_SUCCESSFUL,
                    action: actionTypes.EDIT_LOCATION_CITY,
                    timestamp: getTime(Date()),
                    data: {updated}
                });
            }
        })
        .catch(error => {
            dispatch({
                type: actionTypes.OPERATION_FAILED,
                action: actionTypes.EDIT_LOCATION_CITY,
                timestamp: getTime(Date()),
                data: {...error}
            });
            dispatch({type: actionTypes.EDIT_LOCATION_CITY_FAILED});
            console.log(error)});
};

export const deleteCity = city => dispatch => {
    dispatch({type: actionTypes.DELETING_LOCATION_CITY});

    return BranchCityApi
        .delete(city)
        .then(({deleted}) => {
            if(deleted){
                dispatch({type: actionTypes.DELETE_LOCATION_CITY_SUCCESS});
                dispatch({
                    type: actionTypes.OPERATION_SUCCESSFUL,
                    action: actionTypes.DELETE_LOCATION_CITY,
                    timestamp: getTime(Date()),
                    data: {deleted}
                });
            }
        })
        .catch(error => {
            dispatch({
                type: actionTypes.OPERATION_FAILED,
                action: actionTypes.DELETE_LOCATION_CITY,
                timestamp: getTime(Date()),
                data: {...error}
            });
            dispatch({type: actionTypes.DELETE_LOCATION_CITY_FAILED});
            console.log(error)});
};