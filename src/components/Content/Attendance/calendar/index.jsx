import React from 'react';
import Loadable from 'react-loadable';
import Loading from '../../../Common/loading';

export const AttendanceWeeklyCalendar = Loadable({
    loader: () => import('./weekly'),
    loading: () => <Loading/>,
});