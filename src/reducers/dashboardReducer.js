import * as actionTypes from "../actions/types";


// function formatData(state, {level, entity, data, name}) {
//     if(level === "country"){
//         let countryData = {...state.country, [entity]: data};
//         if(entity === "devices"){
//             const entityData = state.country.devices;
//             countryData = {...state.country, [entity]: {...entityData, ...data}};
//         }
//         return {...state, countryData};
//     }
//
//     if(level === "region"){
//         const {regions} = state;
//         let newRegions = [...regions];
//         const regionIndex = _findIndex(regions,
//             ({name: regionName}) => regionName.toLocaleUpperCase() === name.toLocaleUpperCase());
//         const region = regions[regionIndex];
//         const regionData = {...region, [entity]: data};
//         newRegions.splice(regionIndex, 0, regionData);
//         return {...state, newRegions};
//     }
//
//     return state;
// }

export const liveStats = (state = {level: null, entity: null, name: null, data: null}, action) => {
    switch (action.type){
        case actionTypes.LOAD_DASHBOARD_DATA_SUCCESS:
        case actionTypes.UPDATE_DASHBOARD:
            return action.data;
        default:
            return state;
    }
};

export const loadingDashboardSectionData = (state = {loading: false, level: null, entity: null, name: null}, action) => {
    switch (action.type){
        case actionTypes.LOADING_DASHBOARD_DATA:
            return {...state, loading: true, level: action.level, entity: action.entity, name: action.name};
        case actionTypes.LOAD_DASHBOARD_DATA_SUCCESS:
        case actionTypes.LOAD_DASHBOARD_DATA_FAILED:
            return {...state, loading: false, level: action.level, entity: action.entity, name: action.name};
        default:
            return state;
    }
};