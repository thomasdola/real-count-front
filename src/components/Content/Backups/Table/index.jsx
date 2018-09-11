import React from 'react';
import Loadable from 'react-loadable';
import Loading from '../../../Common/loading';

export const BackupsTable = Loadable({
    loader: () => import('./backups'),
    loading: () => <Loading/>,
});