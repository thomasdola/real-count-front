import Loadable from 'react-loadable';

export const MapDevice = Loadable({
    loader: () => import('./MapDevice'),
    loading: () => null,
});

export const NewAssistant = Loadable({
    loader: () => import('./NewAssistant'),
    loading: () => null,
});

export const NewDevice = Loadable({
    loader: () => import('./NewDevice'),
    loading: () => null,
});

export const EditDevice = Loadable({
    loader: () => import('./EditDevice'),
    loading: () => null,
});