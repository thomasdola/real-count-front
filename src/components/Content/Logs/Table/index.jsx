import React from 'react';
import Loadable from 'react-loadable';
import Loading from '../../../Common/loading';

export const LogsTable = Loadable({
    loader: () => import('./logs'),
    loading: () => <Loading/>,
});