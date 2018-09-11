import * as actionTypes from './types';

export const login = user => ({type: actionTypes.LOGIN, user});

export const logout = () => ({type: actionTypes.LOGOUT});