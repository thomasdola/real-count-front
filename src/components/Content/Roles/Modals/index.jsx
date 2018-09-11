import Loadable from 'react-loadable';

export const NewRole = Loadable({
    loader: () => import('./NewRole'),
    loading: () => null,
});

export const EditRole = Loadable({
    loader: () => import('./EditRole'),
    loading: () => null,
});

export const NewPolicy = Loadable({
    loader: () => import('./NewPolicy'),
    loading: () => null,
});

export const AddPolicies = Loadable({
    loader: () => import('./AddPolicies'),
    loading: () => null,
});

export const EditPolicy = Loadable({
    loader: () => import('./EditPolicy'),
    loading: () => null,
});

export const AddUsers = Loadable({
    loader: () => import('./AddUsers'),
    loading: () => null,
});