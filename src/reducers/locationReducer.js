import * as actionTypes from '../actions/types';

export const list = (state = [], action) => {
    switch (action.type){
        case actionTypes.LOAD_LOCATIONS_SUCCESS:
            return action.locations;
        default:
            return state;
    }
};

export const filterList = (state = [], action) => {
    switch (action.type){
        case actionTypes.LOAD_FILTER_LOCATIONS_SUCCESS:
            return action.locations;
        default:
            return state;
    }
};

export const single = (state = {}, action) => {
    switch (action.type){
        case actionTypes.SELECT_LOCATION:
            return action.location;
        default:
            return state;
    }
};