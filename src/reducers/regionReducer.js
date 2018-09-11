import * as actionTypes from '../actions/types';

export const list = (state = [], action) => {
    switch (action.type){
        case actionTypes.LOAD_REGIONS_SUCCESS:
            return action.regions;
        default:
            return state;
    }
};

export const filterList = (state = [], action) => {
    switch (action.type){
        case actionTypes.LOAD_FILTER_REGIONS_SUCCESS:
            return action.regions;
        default:
            return state;
    }
};

export const single = (state = {}, action) => {
    switch (action.type){
        case actionTypes.SELECT_REGION:
            return action.region;
        default:
            return state;
    }
};