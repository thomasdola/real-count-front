import * as actionTypes from '../actions/types';

export const list = (state = [], action) => {
    switch (action.type){
        case actionTypes.LOAD_GATE_ENTITIES_SUCCESS:
            return action.entities;
        default:
            return state;
    }
};

export const single = (state = {}, action) => {
    switch (action.type){
        case actionTypes.SELECT_ENTITY:
            return action.entity;
        default:
            return state;
    }
};

export const actions = (state = [], action) => {
    switch (action.type){
        case actionTypes.LOAD_ENTITY_ACTIONS_SUCCESS:
            return action.actions;
        default:
            return state;
    }
};

export const loadingEntities = (state = false, action) => {
    switch (action.type){
        case actionTypes.LOADING_ENTITIES:
            return true;
        case actionTypes.LOAD_GATE_ENTITIES_SUCCESS:
        case actionTypes.LOAD_GATE_ENTITIES_FAILED:
            return false;
        default:
            return state;
    }
};

export const loadingActions = (state = false, action) => {
    switch (action.type){
        case actionTypes.LOADING_ACTIONS:
            return true;
        case actionTypes.LOAD_ENTITY_ACTIONS_SUCCESS:
        case actionTypes.LOAD_ENTITY_ACTIONS_FAILED:
            return false;
        default:
            return state;
    }
};