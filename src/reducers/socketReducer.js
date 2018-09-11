import io from 'socket.io-client';

const socketIO = io();
const enrolmentSocketIO = io('/enrolment');

export const socket = (state = socketIO, action) => {
    return state;
};

export const enrolmentSocket = (state = enrolmentSocketIO, action) => {
    return state;
};