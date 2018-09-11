import React from 'react';
import Loadable from 'react-loadable';
import Loading from '../../../Common/loading';

export const FormsTable = Loadable({
    loader: () => import('./forms'),
    loading: () => <Loading/>,
});