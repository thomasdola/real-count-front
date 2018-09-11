import React from 'react';
import Loadable from 'react-loadable';
import Loading from '../../../Common/loading';

export const AllowanceReport = Loadable({
    loader: () => import('./Allowance'),
    loading: () => <Loading/>,
});

export const EnrolmentFormReport = Loadable({
    loader: () => import('./EnrollmentForm'),
    loading: () => <Loading/>,
});

export const EnrolmentReport = Loadable({
    loader: () => import('./Enrollment'),
    loading: () => <Loading/>,
});

export const CountReport = Loadable({
    loader: () => import('./Count'),
    loading: () => <Loading/>,
});

export const DetailReport = Loadable({
    loader: () => import('./Detail'),
    loading: () => <Loading/>,
});

export const DetailsReport = Loadable({
    loader: () => import('./Details'),
    loading: () => <Loading/>,
});

export const SingleAttendanceReport = Loadable({
    loader: () => import('./SingleAttendance'),
    loading: () => <Loading/>,
});

export const MultipleAttendanceReport = Loadable({
    loader: () => import('./MultipleAttendance'),
    loading: () => <Loading/>,
});