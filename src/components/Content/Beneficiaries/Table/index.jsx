import React from 'react';
import Loadable from 'react-loadable';
import Loading from '../../../Common/loading';

export const BeneficiariesTable = Loadable({
    loader: () => import('./beneficiaries'),
    loading: () => <Loading/>,
});