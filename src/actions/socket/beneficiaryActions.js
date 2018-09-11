import {ENROLMENT} from "../../helpers/server/gates";
import {getTime} from "date-fns";
import * as actionTypes from "../types";
import {makeChannel} from "./enrolmentActions";


const CAPTURE_BIO_DATA = "CAPTURE_BIO_DATA";
const CANCEL_CAPTURE = "CANCEL_CAPTURE";
const RECAPTURE_BIO_DATA = "EDIT_BIO_DATA";
const BIO_DATA_CAPTURED = "BIO_DATA_CAPTURED";
const BIO_DATA_CAPTURE_CANCELLED = "BIO_DATA_CAPTURE_CANCELLED";

const BENEFICIARY_UPDATED = "BENEFICIARY_UPDATED";
const BENEFICIARY_UPDATE_FAILED = "BENEFICIARY_UPDATE_FAILED";

export const initSocketListeners = ({socket, enrolmentSocket}, {authUser: {uuid, channel},
    onBeneficiaryUpdated, onBioDataCaptured, onBioDataCaptureCancelled, onBeneficiaryUpdateFailed}) => {

    enrolmentSocket.on(makeChannel(uuid, BIO_DATA_CAPTURED), data => onBioDataCaptured(JSON.parse(data)));
    enrolmentSocket.on(makeChannel(uuid, BIO_DATA_CAPTURE_CANCELLED), () => onBioDataCaptureCancelled());
    socket.on(makeChannel(channel, BENEFICIARY_UPDATED), data => onBeneficiaryUpdated(JSON.parse(data)));
    socket.on(makeChannel(channel, BENEFICIARY_UPDATE_FAILED), error => onBeneficiaryUpdateFailed(JSON.parse(error)));

};

export const stopSocketListeners = ({socket, enrolmentSocket}, {authUser: {uuid, channel}}) => {
    enrolmentSocket.off(makeChannel(uuid, BIO_DATA_CAPTURED));
    enrolmentSocket.off(makeChannel(uuid, BIO_DATA_CAPTURE_CANCELLED));
    socket.off(makeChannel(channel, BENEFICIARY_UPDATED));
    socket.off(makeChannel(channel, BENEFICIARY_UPDATE_FAILED));
};

export const emitCaptureBioData = (socket, {uuid}, {bid}) => {
    const channel = makeChannel(uuid, CAPTURE_BIO_DATA);
    socket.emit(ENROLMENT, {channel, data: bid});
};

export const emitReCaptureBioData = ({socket, enrolmentSocket}, {uuid}, {bid}) => {
    const channel = makeChannel(uuid, RECAPTURE_BIO_DATA);
    socket.emit(ENROLMENT, {channel, data: bid});
    enrolmentSocket.emit(ENROLMENT, {channel, data: bid});
};

export const emitCancelBioDataCapture = (socket, {uuid}) => {
    const channel = makeChannel(uuid, CANCEL_CAPTURE);
    socket.emit(ENROLMENT, {channel});
};

export const onBioDataCaptured = data => ({
    type: actionTypes.OPERATION_SUCCESSFUL,
    action: actionTypes.CAPTURE_BIO,
    timestamp: getTime(Date()),
    data: {...data}
});

export const onBioDataCaptureCancelled = () => ({
    type: actionTypes.OPERATION_FAILED,
    action: actionTypes.CAPTURE_BIO,
    timestamp: getTime(Date()),
    data: {}
});

export const onBeneficiaryUpdated = data => ({
    type: actionTypes.OPERATION_SUCCESSFUL,
    action: actionTypes.UPDATE_BENEFICIARY,
    timestamp: getTime(Date()),
    data: {...data}
});

export const onBeneficiaryUpdateFailed = error => ({
    type: actionTypes.OPERATION_FAILED,
    action: actionTypes.UPDATE_BENEFICIARY,
    timestamp: getTime(Date()),
    data: {...error}
});
