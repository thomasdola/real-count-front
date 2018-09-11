import * as actionTypes from '../actions/types';

export const list = (state = [], action) => {
    switch (action.type){
        case actionTypes.LOAD_COUNTRIES_SUCCESS:
            return action.countries;
        default:
            return state;
    }
};

export const single = (state = {}, action) => {
    switch (action.type){
        case actionTypes.SELECT_COUNTRY:
            return action.country;
        default:
            return state;
    }
};