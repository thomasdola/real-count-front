import {makeChannel} from "./enrolmentActions";
import {getTime} from "date-fns";
import * as actionTypes from "../types";

const FORMS_GENERATED = "FORMS_GENERATED";
const FORMS_GENERATION_FAILED = "FORMS_GENERATION_FAILED";

export const initSocketListeners = (socket, {authUser: {channel}, onFormsGenerated, onFormsGenerationFailed}) => {
    socket.on(makeChannel(channel, FORMS_GENERATED), data => onFormsGenerated(JSON.parse(data)));
    socket.on(makeChannel(channel, FORMS_GENERATION_FAILED), error => onFormsGenerationFailed(JSON.parse(error)));
};

export const stopSocketListeners = (socket, {authUser: {channel}}) => {
    socket.off(makeChannel(channel, FORMS_GENERATED));
    socket.off(makeChannel(channel, FORMS_GENERATION_FAILED));
};

export const onFormsGenerated = data => ({
    type: actionTypes.OPERATION_SUCCESSFUL,
    action: actionTypes.GENERATE_FORMS,
    timestamp: getTime(Date()),
    data: {...data}
});

export const onFormsGenerationFailed = error => ({
    type: actionTypes.OPERATION_FAILED,
    action: actionTypes.GENERATE_FORMS,
    timestamp: getTime(Date()),
    data: {...error}
});