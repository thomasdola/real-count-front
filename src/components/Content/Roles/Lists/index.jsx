import React from 'react';
import Loadable from 'react-loadable';
import Loading from '../../../Common/loading';

export const RolesTable = Loadable({
    loader: () => import('./roles'),
    loading: () => <Loading/>,
});

export const UsersTable = Loadable({
    loader: () => import('./users'),
    loading: () => <Loading/>,
});

export const DefaultPolicies = Loadable({
    loader: () => import('./DefaultPolicies'),
    loading: () => <Loading/>,
});

export const AvailablePolicies = Loadable({
    loader: () => import('./AvailablePolicies'),
    loading: () => <Loading/>,
});