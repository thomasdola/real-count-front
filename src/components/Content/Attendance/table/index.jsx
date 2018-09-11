import React from 'react';
import Loadable from 'react-loadable';
import Loading from '../../../Common/loading';

export const DailyAttendanceTable = Loadable({
    loader: () => import('./daily'),
    loading: () => <Loading/>,
});