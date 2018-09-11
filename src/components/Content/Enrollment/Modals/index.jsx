import Loadable from 'react-loadable';

export const CheckBID = Loadable({
    loader: () => import('./CheckBID'),
    loading: () => null,
});