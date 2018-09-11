import DownloadApi from '../api/actual/downloadApi';
import {PDF, SHEET, GZIP, DOWNLOAD_SUCCESS} from '../actions/types';
import _includes from 'lodash/includes';
import queryString from "query-string";

export const download = (path, type, deleteAfter = false) => dispatch => {
    if(!_includes([PDF, SHEET, GZIP], type))
        throw new Error("Invalid File Type");

    return DownloadApi
        .download({path, type, delete_after: deleteAfter})
        .then(file => dispatch({type: DOWNLOAD_SUCCESS, file}))
        .catch(error => console.log(error));
};

export const browserDownload = (path, type, deleteAfter = false) => {
    const params = queryString.stringify({path, type, delete_after: deleteAfter});
    window.location = `/internal-api/download?${params}`;
};