import * as actionTypes from '../actions/types';

export const list = (state = [], action) => {
    switch (action.type){
        case actionTypes.LOAD_DISTRICTS_SUCCESS:
            return action.districts;
        default:
            return state;
    }
};

export const filterList = (state = [], action) => {
    switch (action.type){
        case actionTypes.LOAD_FILTER_DISTRICTS_SUCCESS:
            return action.districts;
        default:
            return state;
    }
};

export const single = (state = {}, action) => {
    switch (action.type){
        case actionTypes.SELECT_DISTRICT:
            return action.district;
        default:
            return state;
    }
};