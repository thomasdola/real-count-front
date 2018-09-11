import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Redirect, Route} from "react-router-dom";
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import configureStore from './store/configureStore';
import Provider from "react-redux/es/components/Provider";
import {login} from './actions/authActions';
import {ConfirmAlert} from "./components/Content/Beneficiary";
import Can from "./helpers/Can";
// import {GENERATE} from './api/constants/Actions';
import {BENEFICIARIES_ALLOWANCE} from './api/constants/Entities';

export const AuthorizedRoute = ({ component: Component, user: {root}, user, page, scope, ...rest }) => {
    const can = root || Can.User(user).access(page, scope);
    return (
        <Route
            {...rest}
            render={props =>
                can ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={"/unauthorized"} />
                )
            }
        />
    )
};

const user = {
    uuid: "jfauerahldfd",
    username: "john.doe@gmail.com",
    full_name: "John Doe",
    root: true,
    password_updated: true,
    pin: '1234',
    role: {
        name: 'role name',
        

        // level: {type: "country", name: "GHANA", id: 1},
        level: {type: "region", name: "GREATER ACCRA", id: 3},
        // level: {type: "district", name: "GA WEST MUNICIPAL ASSEMBLY", id: 28},
        // level: {type: "location", name: "POKUASE", id: 372},

        // scope: {country_id: 1, region_id: null, district_id: null, location_id: null},
        scope: {country_id: 1, region_id: 3, district_id: null, location_id: null},
        // scope: {country_id: 1, region_id: 3, district_id: 28, location_id: null},
        // scope: {country_id: 1, region_id: 3, district_id: 28, location_id: 372},


        gates: ['users', "devices", "beneficiaries", "forms", "attendance", "reports", "roles"],
        entities: [
            {name: 'User', actions: ['add', 'edit', 'delete']},
            {name: 'Device', actions: ['add']},
            {name: 'Beneficiary', actions: ['edit']},
            {name: 'Form', actions: ['generate']},
            {name: 'Attendance', actions: ['view']},
            {name: 'Report', actions: ['generate']},
            {name: 'Role', actions: ['add']},
            {name: 'Policy', actions: ['add', 'edit']},
        ],
        policies: [
            {actions: [{name: "enrol"}, {name: "edit"}], entity: {name: "beneficiary"}, gate: {name: "beneficiaries"}},
            {actions: [{name: "add"}, {name: "edit"}, {name: "delete"}], entity: {name: "user"}, gate: {name: "users"}},
            {actions: [
                {name: "add"}, 
                // {name: "edit"}, 
                // {name: "delete"}
            ], entity: {name: "device"}, gate: {name: "devices"}},
            {actions: [{name: "view"}], entity: {name: "attendance"}, gate: {name: "attendance"}},
            {actions: [{name: "generate"}], entity: {name: "form"}, gate: {name: "forms"}},
            {actions: [{name: "add"}], entity: {name: "role"}, gate: {name: "roles"}},
            {actions: [{name: "add"}, {name: "edit"}], entity: {name: "policy"}, gate: {name: "roles"}},
            {actions: [{name: "generate"}], entity: {name: BENEFICIARIES_ALLOWANCE}, gate: {name: "reports"}},
        ]
    },
    channel: 'user_ee1cda0f-8a8b-4257-bfea-7ff0fbff1b53_channel'
};

const getConfirmation = (message, callback) => (
    <ConfirmAlert
        open
        message={message}
        onConfirm={() => callback(true)}
        onCancel={() => callback(false)} />
);

const store = configureStore();

store.dispatch(login(window.authUser || user));

ReactDOM.render(
    <Provider store={store}>
        <Router getUserConfirmation={getConfirmation}>
            <Route path={"/"} component={App}/>
        </Router>
    </Provider>
    , document.getElementById('root'));

registerServiceWorker();
