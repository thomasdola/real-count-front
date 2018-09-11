import Loadable from 'react-loadable';

export const Form = Loadable({
    loader: () => import('./form'),
    loading: () => null,
});