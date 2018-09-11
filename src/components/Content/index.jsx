import React from 'react';
import {Route, withRouter} from 'react-router-dom';
import Loadable from 'react-loadable';
import Loading from '../Common/loading';
import {AuthorizedRoute} from '../../index';
import * as gates from '../../api/constants/Gates';
import {connect} from "react-redux";

const Dashboard = Loadable({
    loader: () => import('./Dashboard'),
    loading: () => <Loading/>,
});

const Beneficiaries = Loadable({
    loader: () => import('./Beneficiaries'),
    loading: () => <Loading/>,
});

const Beneficiary = Loadable({
    loader: () => import('./Beneficiary'),
    loading: () => <Loading/>,
});

const Devices = Loadable({
    loader: () => import('./Devices'),
    loading: () => <Loading/>,
});

const Attendance = Loadable({
    loader: () => import('./Attendance'),
    loading: () => <Loading/>,
});

const Locations = Loadable({
    loader: () => import('./Branches'),
    loading: () => <Loading/>,
});

const Logs = Loadable({
    loader: () => import('./Logs'),
    loading: () => <Loading/>,
});

const Reports = Loadable({
    loader: () => import('./Reports'),
    loading: () => <Loading/>,
});

const Backups = Loadable({
    loader: () => import('./Backups'),
    loading: () => <Loading/>,
});

const Users = Loadable({
    loader: () => import('./Users'),
    loading: () => <Loading/>,
});

const Forms = Loadable({
    loader: () => import('./Forms'),
    loading: () => <Loading/>,
});

const Roles = Loadable({
    loader: () => import('./Roles'),
    loading: () => <Loading/>,
});

const Enrollment = Loadable({
    loader: () => import('./Enrollment'),
    loading: () => <Loading/>,
});

const Unauthorized = Loadable({
    loader: () => import('./Unauthorized'),
    loading: () => <Loading/>,
});

class Content extends React.Component{
    render(){
        const {authUser: user} = this.props;
        return [
            <AuthorizedRoute
                key={"Dashboard"}
                exact={true}
                path={"/"}
                user={user}
                page={gates.DASHBOARD}
                component={Dashboard}/>,

            <AuthorizedRoute
                key={"Beneficiaries"}
                exact={true}
                path={"/beneficiaries"}
                user={user}
                page={gates.BENEFICIARIES}
                component={Beneficiaries}/>,

            <AuthorizedRoute
                key={"Beneficiary"}
                exact={true}
                path={"/beneficiaries/:uuid"}
                user={user}
                page={gates.BENEFICIARIES}
                component={Beneficiary}/>,

            <AuthorizedRoute
                key={"Forms"}
                path={"/forms"}
                user={user}
                page={gates.FORMS}
                component={Forms}/>,

            <AuthorizedRoute
                key={"Users"}
                path={"/users"}
                user={user}
                page={gates.USERS}
                component={Users}/>,

            <AuthorizedRoute
                key={"Attendance"}
                path={"/attendance"}
                user={user}
                page={gates.ATTENDANCE}
                component={Attendance}/>,

            <AuthorizedRoute
                key={"Logs"}
                path={"/audit-trail"}
                user={user}
                page={gates.LOGS}
                component={Logs}/>,

            <AuthorizedRoute
                key={"Devices"}
                path={"/devices"}
                user={user}
                page={gates.DEVICES}
                component={Devices}/>,

            <AuthorizedRoute
                key={"Reports"}
                path={"/reports"}
                user={user}
                page={gates.REPORTS}
                component={Reports}/>,

            <AuthorizedRoute
                key={"Backups"}
                path={"/backups"}
                user={user}
                page={gates.BACKUPS}
                component={Backups}/>,

            <AuthorizedRoute
                key={"Roles"}
                path={"/roles"}
                user={user}
                page={gates.ROLES}
                component={Roles}/>,

            <AuthorizedRoute
                key={"Locations"}
                path={"/locations"}
                user={user}
                page={gates.LOCATIONS}
                component={Locations}/>,

            <AuthorizedRoute
                key={"Enrollment"}
                path={"/enroll"}
                user={user}
                page={gates.ENROLLMENT}
                component={Enrollment}/>,

            <Route key={"Unauthorized"} path={"/unauthorized"} component={Unauthorized}/>
        ];
    }
}

export default withRouter(connect(({authUser}) => ({authUser}))(Content));