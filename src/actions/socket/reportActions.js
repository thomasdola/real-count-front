import {makeChannel} from "./enrolmentActions";
import {getTime} from "date-fns";
import * as actionTypes from "../types";

const REPORT_GENERATED = "REPORT_GENERATED";
const REPORT_GENERATION_FAILED = "REPORT_GENERATION_FAILED";

export const initSocketListeners = (socket, {authUser: {channel}, onReportGenerated, onReportGenerationFailed}) => {
    socket.on(makeChannel(channel, REPORT_GENERATED), data => onReportGenerated(JSON.parse(data)));
    socket.on(makeChannel(channel, REPORT_GENERATION_FAILED), error => onReportGenerationFailed(JSON.parse(error)));
};

export const stopSocketListeners = (socket, {authUser: {channel}}) => {
    socket.off(makeChannel(channel, REPORT_GENERATED));
    socket.off(makeChannel(channel, REPORT_GENERATION_FAILED));
};

export const onReportGenerated = data => ({
    type: actionTypes.OPERATION_SUCCESSFUL,
    action: actionTypes.GENERATE_REPORT,
    timestamp: getTime(Date()),
    data: {...data}
});

export const onReportGenerationFailed = error => ({
    type: actionTypes.OPERATION_FAILED,
    action: actionTypes.GENERATE_REPORT,
    timestamp: getTime(Date()),
    data: {...error}
});