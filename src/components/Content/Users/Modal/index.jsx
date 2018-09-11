import Loadable from 'react-loadable';

export const NewUser = Loadable({
    loader: () => import('./NewUser'),
    loading: () => null,
});

export const User = Loadable({
    loader: () => import('./User'),
    loading: () => null,
});