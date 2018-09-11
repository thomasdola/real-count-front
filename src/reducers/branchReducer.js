import * as actionTypes from '../actions/types';

export const locationRegions = (state = [], action) => {
    switch (action.type){
        case actionTypes.LOAD_LOCATION_REGIONS_SUCCESS:
            return action.regions;
        default:
            return state;
    }
};

export const locationRegionsPagination = (state = {}, action) => {
    switch (action.type){
        case actionTypes.LOAD_LOCATION_REGIONS_SUCCESS:
            return action.pagination;
        default:
            return state;
    }
};

export const loadingLocationRegions = (state = false, action) => {
    switch (action.type){
        case actionTypes.LOADING_LOCATION_REGIONS:
            return true;
        case actionTypes.LOAD_LOCATION_REGIONS_SUCCESS:
        case actionTypes.LOAD_LOCATION_REGIONS_FAILED:
            return false;
        default:
            return state;
    }
};

export const editingRegion = (state = false, action) => {
    switch (action.type){
        case actionTypes.EDITING_LOCATION_REGION:
            return true;
        case actionTypes.EDIT_LOCATION_REGION_SUCCESS:
        case actionTypes.EDIT_LOCATION_REGION_FAILED:
            return false;
        default:
            return state;
    }
};

export const locationDistricts = (state = [], action) => {
    switch (action.type){
        case actionTypes.LOAD_LOCATION_DISTRICTS_SUCCESS:
            return action.districts;
        default:
            return state;
    }
};

export const locationDistrictsPagination = (state = {}, action) => {
    switch (action.type){
        case actionTypes.LOAD_LOCATION_DISTRICTS_SUCCESS:
            return action.pagination;
        default:
            return state;
    }
};

export const loadingLocationDistricts = (state = false, action) => {
    switch (action.type){
        case actionTypes.LOADING_LOCATION_DISTRICTS:
            return true;
        case actionTypes.LOAD_LOCATION_DISTRICTS_SUCCESS:
        case actionTypes.LOAD_LOCATION_DISTRICTS_FAILED:
            return false;
        default:
            return state;
    }
};

export const addingLocationDistrict = (state = false, action) => {
    switch (action.type){
        case actionTypes.ADDING_LOCATION_DISTRICT:
            return true;
        case actionTypes.ADD_LOCATION_DISTRICT_SUCCESS:
        case actionTypes.ADD_LOCATION_DISTRICT_FAILED:
            return false;
        default:
            return state;
    }
};

export const editingLocationDistrict = (state = false, action) => {
    switch (action.type){
        case actionTypes.EDITING_LOCATION_DISTRICT:
            return true;
        case actionTypes.EDIT_LOCATION_DISTRICT_SUCCESS:
        case actionTypes.EDIT_LOCATION_DISTRICT_FAILED:
            return false;
        default:
            return state;
    }
};

export const deletingLocationDistrict = (state = false, action) => {
    switch (action.type){
        case actionTypes.DELETING_LOCATION_DISTRICT:
            return true;
        case actionTypes.DELETE_LOCATION_DISTRICT_SUCCESS:
        case actionTypes.DELETE_LOCATION_DISTRICT_FAILED:
            return false;
        default:
            return state;
    }
};

export const locationCities = (state = [], action) => {
    switch (action.type){
        case actionTypes.LOAD_LOCATION_CITIES_SUCCESS:
            return action.cities;
        default:
            return state;
    }
};

export const locationCitiesPagination = (state = {}, action) => {
    switch (action.type){
        case actionTypes.LOAD_LOCATION_CITIES_SUCCESS:
            return action.pagination;
        default:
            return state;
    }
};

export const loadingLocationCities = (state = false, action) => {
    switch (action.type){
        case actionTypes.LOADING_LOCATION_CITIES:
            return true;
        case actionTypes.LOAD_LOCATION_CITIES_SUCCESS:
        case actionTypes.LOAD_LOCATION_CITIES_FAILED:
            return false;
        default:
            return state;
    }
};

export const addingLocationCity = (state = false, action) => {
    switch (action.type){
        case actionTypes.ADDING_LOCATION_CITY:
            return true;
        case actionTypes.ADD_LOCATION_CITY_SUCCESS:
        case actionTypes.ADD_LOCATION_CITY_FAILED:
            return false;
        default:
            return state;
    }
};

export const editingLocationCity = (state = false, action) => {
    switch (action.type){
        case actionTypes.EDITING_LOCATION_CITY:
            return true;
        case actionTypes.EDIT_LOCATION_CITY_SUCCESS:
        case actionTypes.EDIT_LOCATION_CITY_FAILED:
            return false;
        default:
            return state;
    }
};

export const deletingLocationCity = (state = false, action) => {
    switch (action.type){
        case actionTypes.DELETING_LOCATION_CITY:
            return true;
        case actionTypes.DELETE_LOCATION_CITY_SUCCESS:
        case actionTypes.DELETE_LOCATION_CITY_FAILED:
            return false;
        default:
            return state;
    }
};