import Loadable from 'react-loadable';

export const Backup = Loadable({
    loader: () => import('./backup'),
    loading: () => null,
});