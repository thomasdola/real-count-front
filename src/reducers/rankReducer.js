import * as actionTypes from '../actions/types';

export const list = (state = [], action) => {
    switch (action.type){
        case actionTypes.LOAD_RANKS_SUCCESS:
            return action.ranks;
        default:
            return state;
    }
};