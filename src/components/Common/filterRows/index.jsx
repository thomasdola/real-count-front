import Loadable from 'react-loadable';

export const Regions = Loadable({
    loader: () => import('./Regions'),
    loading: () => null
});

export const Districts = Loadable({
    loader: () => import('./Districts'),
    loading: () => null
});

export const Locations = Loadable({
    loader: () => import('./Locations'),
    loading: () => null
});

export const Modules = Loadable({
    loader: () => import('./Modules'),
    loading: () => null
});

export const Ranks = Loadable({
    loader: () => import('./Ranks'),
    loading: () => null
});

export const IDTypes = Loadable({
    loader: () => import('./IDTypes'),
    loading: () => null
});

export const Active = Loadable({
    loader: () => import('./Active'),
    loading: () => null
});

export const Valid = Loadable({
    loader: () => import('./Valid'),
    loading: () => null
});

export const Gender = Loadable({
    loader: () => import('./Gender'),
    loading: () => null
});

export const Status = Loadable({
    loader: () => import('./Status'),
    loading: () => null
});

export const Mapping = Loadable({
    loader: () => import('./Mapping'),
    loading: () => null
});

export const Time = Loadable({
    loader: () => import('./Time'),
    loading: () => null
});

export const Date = Loadable({
    loader: () => import('./Date'),
    loading: () => null
});

export const DateTime = Loadable({
    loader: () => import('./DateTime'),
    loading: () => null
});