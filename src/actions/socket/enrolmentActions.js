import {ENROLMENT} from "../../helpers/server/gates";
import {getTime} from "date-fns";
import * as actionTypes from "../types";


const CAPTURE_BIO_DATA = "CAPTURE_BIO_DATA";
const CANCEL_CAPTURE = "CANCEL_CAPTURE";
const RECAPTURE_BIO_DATA = "EDIT_BIO_DATA";
const BIO_DATA_CAPTURED = "BIO_DATA_CAPTURED";
const BIO_DATA_CAPTURE_CANCELLED = "BIO_DATA_CAPTURE_CANCELLED";

const BENEFICIARY_ENROLLED = "BENEFICIARY_ENROLLED";
const BENEFICIARY_ENROLMENT_FAILED = "BENEFICIARY_ENROLMENT_FAILED";

export const initSocketListeners = ({socket, enrolmentSocket}, {authUser: {uuid, channel},
    onBeneficiaryEnrolled, onBioDataCaptured, onBioDataCaptureCancelled, onBeneficiaryEnrolFailed}) => {

    enrolmentSocket.on(makeChannel(uuid, BIO_DATA_CAPTURED), data => onBioDataCaptured(JSON.parse(data)));
    enrolmentSocket.on(makeChannel(uuid, BIO_DATA_CAPTURE_CANCELLED), () => onBioDataCaptureCancelled());

    socket.on(makeChannel(channel, BENEFICIARY_ENROLLED), data => onBeneficiaryEnrolled(JSON.parse(data)));
    socket.on(makeChannel(channel, BENEFICIARY_ENROLMENT_FAILED), error => onBeneficiaryEnrolFailed(JSON.parse(error)));

};

export const stopSocketListeners = ({socket, enrolmentSocket}, {authUser: {uuid, channel}}) => {
    enrolmentSocket.off(makeChannel(uuid, BIO_DATA_CAPTURED));
    enrolmentSocket.off(makeChannel(uuid, BIO_DATA_CAPTURE_CANCELLED));
    socket.off(makeChannel(channel, BENEFICIARY_ENROLLED));
    socket.off(makeChannel(channel, BENEFICIARY_ENROLMENT_FAILED));
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

export const onBeneficiaryEnrolled = data => ({
    type: actionTypes.OPERATION_SUCCESSFUL,
    action: actionTypes.ENROL_BENEFICIARY,
    timestamp: getTime(Date()),
    data: {...data}
});

export const onBeneficiaryEnrolFailed = error => ({
    type: actionTypes.OPERATION_FAILED,
    action: actionTypes.ENROL_BENEFICIARY,
    timestamp: getTime(Date()),
    data: {...error}
});

export const makeChannel = (channel, event) => {
    return `${channel}:${event}`;
};
