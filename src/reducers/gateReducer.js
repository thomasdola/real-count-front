import * as actionTypes from '../actions/types';

export const list = (state = [], action) => {
    switch (action.type){
        case actionTypes.LOAD_GATES_SUCCESS:
            return action.gates;
        default:
            return state;
    }
};

export const single = (state = {}, action) => {
    switch (action.type){
        case actionTypes.SELECT_GATE:
            return action.gate;
        default:
            return state;
    }
};

export const loadingGates = (state = false, action) => {
    switch (action.type){
        case actionTypes.LOADING_GATES:
            return true;
        case actionTypes.LOAD_GATES_SUCCESS:
        case actionTypes.LOAD_GATES_FAILED:
            return false;
        default:
            return state;
    }
};