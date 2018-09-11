import * as actionTypes from '../actions/types';

export const list = (state = [], action) => {
    switch (action.type){
        case actionTypes.LOAD_ID_TYPES_SUCCESS:
            return action.idTypes;
        default:
            return state;
    }
};