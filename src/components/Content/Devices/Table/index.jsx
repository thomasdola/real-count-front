import React from 'react';
import Loadable from 'react-loadable';
import Loading from '../../../Common/loading';

export const DevicesTable = Loadable({
    loader: () => import('./devices'),
    loading: () => <Loading/>,
});

export const LogsTable = Loadable({
    loader: () => import('./logs'),
    loading: () => <Loading/>,
});

export const AssistantsTable = Loadable({
    loader: () => import('./assistants'),
    loading: () => <Loading/>,
});