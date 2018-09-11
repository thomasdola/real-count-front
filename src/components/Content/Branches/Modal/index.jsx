import Loadable from 'react-loadable';

export const NewDistrict = Loadable({
    loader: () => import('./NewDistrict'),
    loading: () => null,
});

export const NewCity = Loadable({
    loader: () => import('./NewCity'),
    loading: () => null,
});

export const EditDistrict = Loadable({
    loader: () => import('./EditDistrict'),
    loading: () => null,
});

export const EditCity = Loadable({
    loader: () => import('./EditCity'),
    loading: () => null,
});