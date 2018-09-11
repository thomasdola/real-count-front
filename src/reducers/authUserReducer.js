import {LOGIN, LOGOUT} from '../actions/types';

const TEMPLATE = {
    uuid: "",
    username: "",
    full_name: "",
    password_updated: true,
    pin: '',
    role: {
        name: '',
        level: {type: "", name: ""},
        gates: [],
        entities: []
    },
    channel: ''
};

export default function(state = TEMPLATE, action){
    switch(action.type){
        case LOGIN:
            return action.user;
        case LOGOUT:
            return TEMPLATE;
        default:
            return state;
    }
}