import * as actionTypes from './types';
// import BeneficiaryApi from '../api/mock/beneficiaryMockApi';
import BeneficiaryApi from '../api/actual/beneficiaryApi';
import {getTime} from "date-fns";

const loadBeneficiariesSuccess = ({beneficiaries, pagination}) => (
    {
        type: actionTypes.LOAD_BENEFICIARIES_SUCCESS,
        beneficiaries,
        pagination
    }
);

export const loadBeneficiaries = params => dispatch => {
    dispatch({type: actionTypes.LOAD_BENEFICIARIES_LOADING});
    return BeneficiaryApi
        .all(params)
        .then(({data, meta: {pagination}}) => {
            dispatch(loadBeneficiariesSuccess({beneficiaries: data, pagination}));
        })
        .catch((error) => {
            dispatch({type: actionTypes.LOAD_BENEFICIARIES_FAILED});
            console.log(error);
        });
};

export const loadBeneficiary = beneficiary => dispatch => {
    dispatch({type: actionTypes.LOADING_BENEFICIARY});

    return BeneficiaryApi
        .single(beneficiary)
        .then(({beneficiary, bio}) => {
            dispatch({type: actionTypes.LOAD_BENEFICIARY_SUCCESS, beneficiary, bio})
        })
        .catch(error => {
            dispatch({
                type: actionTypes.OPERATION_FAILED,
                action: actionTypes.LOAD_BENEFICIARY,
                timestamp: getTime(Date()),
                data: {...error}
            });
            dispatch({type: actionTypes.LOAD_BENEFICIARIES_FAILED});
        });
};

export const updateBeneficiary = (beneficiary, data) => dispatch => {
    dispatch({type: actionTypes.UPDATING_BENEFICIARY});

    return BeneficiaryApi
        .update(beneficiary, data)
        .then(({updated, scheduled, beneficiary}) => {
            if(updated || scheduled){
                dispatch({type: actionTypes.UPDATE_BENEFICIARY_SUCCESS});
                dispatch({
                    type: actionTypes.OPERATION_SUCCESSFUL,
                    action: actionTypes.UPDATE_BENEFICIARY,
                    timestamp: getTime(Date()),
                    data: {updated, scheduled, beneficiary}
                });
            }
        })
        .catch(error => {
            dispatch({
                type: actionTypes.OPERATION_FAILED,
                action: actionTypes.UPDATE_BENEFICIARY,
                timestamp: getTime(Date()),
                data: {...error}
            });
            dispatch({type: actionTypes.UPDATE_BENEFICIARY_FAILED});
        });
};

export const deleteBeneficiary = beneficiary => dispatch => {
    dispatch({type: actionTypes.DELETING_BENEFICIARY});

    return BeneficiaryApi
        .remove(beneficiary)
        .then(({deleted}) => {
            if(deleted){
                dispatch({type: actionTypes.DELETE_BENEFICIARY_SUCCESS});
                dispatch({
                    type: actionTypes.OPERATION_SUCCESSFUL,
                    action: actionTypes.DELETE_BENEFICIARY,
                    timestamp: getTime(Date()),
                    data: {deleted}
                });
            }
        })
        .catch(error => {
            dispatch({
                type: actionTypes.OPERATION_FAILED,
                action: actionTypes.DELETE_BENEFICIARY,
                timestamp: getTime(Date()),
                data: {...error}
            });
            dispatch({type: actionTypes.DELETE_BENEFICIARY_FAILED});
        });
};