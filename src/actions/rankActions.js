import * as actionTypes from './types';
// import rankApi from '../api/mock/rankMockApi';
import rankApi from '../api/actual/rankApi';

function loadRanksSuccess(ranks) {
    return {
        type: actionTypes.LOAD_RANKS_SUCCESS,
        ranks
    }
}

const loadRanksLoading = () => ({type: actionTypes.LOAD_RANKS_LOADING});

export const loadRanks = params => dispatch => {
    dispatch(loadRanksLoading());
    return rankApi
        .all(params)
        .then((ranks) => {
            dispatch(loadRanksSuccess(ranks));
        })
        .catch(error => {
            console.log(error);
        });
};