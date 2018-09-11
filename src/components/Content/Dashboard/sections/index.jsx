import React from 'react';
import Loadable from 'react-loadable';
import Loading from '../../../Common/loading';

export const Top = Loadable({
    loader: () => import('./top/index'),
    loading: () => <Loading/>,
});

export const Middle = Loadable({
    loader: () => import('./middle/index'),
    loading: () => <Loading/>,
});

export const Bottom = Loadable({
    loader: () => import('./bottom/index'),
    loading: () => <Loading/>,
});