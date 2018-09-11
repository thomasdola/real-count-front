import React from 'react';
import Loadable from 'react-loadable';
import Loading from '../../../Common/loading';

export const SchedulesList = Loadable({
    loader: () => import('./schedules'),
    loading: () => <Loading/>,
});