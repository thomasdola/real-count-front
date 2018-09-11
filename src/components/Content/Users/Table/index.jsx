import React from 'react';
import Loadable from 'react-loadable';
import Loading from '../../../Common/loading';

export const UsersTable = Loadable({
    loader: () => import('./users'),
    loading: () => <Loading/>,
});