import React from 'react';
import Loadable from 'react-loadable';
import Loading from '../../../Common/loading';

export const RegionsTable = Loadable({
    loader: () => import('./regions'),
    loading: () => <Loading/>,
});

export const DistrictsTable = Loadable({
    loader: () => import('./districts'),
    loading: () => <Loading/>,
});

export const CitiesTable = Loadable({
    loader: () => import('./cities'),
    loading: () => <Loading/>,
});