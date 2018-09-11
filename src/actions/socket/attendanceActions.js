import * as actionTypes from "../types";

import {makeChannel} from "./enrolmentActions";

const BENEFICIARY_CLOCKED = "ATTENDANCE:BENEFICIARY_CLOCKED";

export const initSocketListeners = (socket, {authUser: {channel}, onBeneficiaryClocked}) => {
    socket.on(makeChannel(channel, BENEFICIARY_CLOCKED), data => onBeneficiaryClocked(JSON.parse(data)));
};

export const stopSocketListeners = (socket, {authUser: {channel}}) => {
    socket.off(makeChannel(channel, BENEFICIARY_CLOCKED));
};

export const onBeneficiaryClocked = attendance => ({type: actionTypes.NEW_ATTENDANCE, attendance});