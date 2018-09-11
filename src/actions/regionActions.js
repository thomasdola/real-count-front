import * as actionTypes from './types';
// import regionApi from '../api/mock/regionMockApi';
import regionApi from '../api/actual/regionApi';

export const selectRegion = region => ({type: actionTypes.SELECT_REGION, region});

export const loadRegions = (params, filter) => dispatch => {
    dispatch({type: actionTypes.LOAD_REGIONS_LOADING});

    return regionApi
        .all(params)
        .then(regions => {
            const type = filter 
                ? actionTypes.LOAD_FILTER_REGIONS_SUCCESS 
                : actionTypes.LOAD_REGIONS_SUCCESS;
            dispatch({type, regions});
        })
        .catch(error => {
            console.log(error);
        });
};