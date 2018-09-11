import * as actionTypes from '../actions/types';

export const list = (state = [], action) => {
    switch (action.type){
        case actionTypes.LOAD_MODULES_SUCCESS:
            return action.modules;
        default:
            return state;
    }
};