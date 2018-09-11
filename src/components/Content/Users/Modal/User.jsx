import React from 'react';
import {Button, Dialog, Intent} from '@blueprintjs/core';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {deleteUser, editUser} from '../../../../actions/userActions';
import _isEqual from 'lodash/isEqual';
import RolesSelect from "../Table/RolesSelect";
import {USERS} from "../../../../api/constants/Gates";
import * as AuthActions from "../../../../api/constants/Actions";
import {DELETE, EDIT} from "../../../../api/constants/Actions";
import _filter from "lodash/filter";
import _indexOf from "lodash/indexOf";
import _find from 'lodash/find';
import {USER} from "../../../../api/constants/Entities";
import {isFormValid} from "../../Enrollment";
import {ConfirmAlert} from "../../Beneficiary";
import {DELETE_USER, EDIT_USER} from "../../../../actions/types";
import Toaster from "../../../Common/Toaster";
import Can from "../../../../helpers/Can";

class User extends React.Component{

    constructor(props){
        super(props);

        this._handleEditUser = this._handleEditUser.bind(this);
        this._handleDeleteUser = this._handleDeleteUser.bind(this);
        this._handleInputChange = this._handleInputChange.bind(this);
        this._handleBlockUser = this._handleBlockUser.bind(this);
    }

    state = {
        user: {},
        userBuffer: {},
        userRaw: {},
        confirmDelete: false
    };

    static getDerivedStateFromProps(nextProps, prevState){
        const {userRaw: oldUserRaw} = prevState;
        const {users, match: {params: {uuid}}} = nextProps;
        let userRaw = _find(users, {uuid}) || {role: {}};
        const user = {...userRaw, role: userRaw.role ? userRaw.role.id : null};

        if(_isEqual(oldUserRaw, userRaw))
            return null;

        return {user: user, userBuffer: {...user}, userRaw};
    }

    componentDidUpdate(prevProps){
        const {OPERATION_SUCCESSFUL: OLD_OPERATION_SUCCESSFUL, OPERATION_FAILED: OLD_OPERATION_FAILED} = prevProps;
        const {OPERATION_SUCCESSFUL, OPERATION_FAILED, history} = this.props;

        if(!_isEqual(OLD_OPERATION_SUCCESSFUL, OPERATION_SUCCESSFUL)){
            const user = this.state.user.name.toUpperCase();
            if(OPERATION_SUCCESSFUL.action === EDIT_USER){
                history.goBack();
                Toaster.show({
                    message: `${user} Successfully Updated 😃`,
                    intent: Intent.SUCCESS,
                    icon: 'tick' });
            }

            if(OPERATION_SUCCESSFUL.action === DELETE_USER){
                history.goBack();
                Toaster.show({
                    message: `${user} Successfully Deleted 😃`,
                    intent: Intent.SUCCESS,
                    icon: 'tick' });
            }
        }

        if(!_isEqual(OLD_OPERATION_FAILED, OPERATION_FAILED)){
            const user = this.state.user.name.toUpperCase();
            if(OPERATION_FAILED.action === EDIT_USER){
                console.log(OPERATION_FAILED.data);
                Toaster.show({
                    message: `Could Not Update ${user} 😞`,
                    intent: Intent.DANGER,
                    icon: 'error'
                });
            }
            if(OPERATION_FAILED.action === DELETE_USER){
                console.log(OPERATION_FAILED.data);
                Toaster.show({
                    message: `Could Not Delete ${user} 😞`,
                    intent: Intent.DANGER,
                    icon: 'error'
                });
            }
        }
    }

    _handleInputChange(name, value){
        this.setState(() => {
            return {
                user: {...this.state.user, [name]: value}
            }
        });
    }

    _handleBlockUser(){}

    _handleDeleteUser(){
        this.props.deleteUser(this.state.user.uuid);
        this.setState({confirmDelete: false})
    }

    _handleEditUser(){
        const {policies} = this.props;
        const {user: {name, username, role, pin, status}, userRaw: {uuid}} = this.state;
        const requirePin = User._requirePin(Number.parseInt(role, 10), policies);

        let data = new FormData();

        data.append('full_name', name);
        data.append('username', username);
        data.append('role_id', role);
        data.append('status', status === "active" ? 1 : 0);

        if(requirePin)
            data.append('pin', pin);

        this.props.editUser(uuid, data);
    }

    _isFormValid(){
        const {policies} = this.props;
        const {user: {name, username, role, pin}} = this.state;
        const requirePin = User._requirePin(Number.parseInt(role, 10), policies);

        let required = {name, username, role};
        if(requirePin)
            required = {...required, pin};

        return isFormValid(required);
    }

    static _requirePin(role, policies){
        const rolePolicies = _filter(policies, ({roles}) => {
            return _indexOf(roles, role) !== -1;
        });

        const operateRolePolicies = _find(rolePolicies, ({actions}) => {
            return !!_find(actions, {name: AuthActions.OPERATE});
        });

        return !!operateRolePolicies;
    }

    render(){
        const {history, editingUser, roles, policies, deletingUser, authUser} = this.props;
        const {user: {name, username, pin, role, status}, userBuffer, user, confirmDelete, userRaw} = this.state;
        const requirePin = User._requirePin(Number.parseInt(role, 10), policies);
        const disableSaveButton = !this._isFormValid() || _isEqual(user, userBuffer);
        const userNotFound = !userRaw.uuid;

        const editActionAllowed = authUser.root ? true : Can.User(authUser).perform(EDIT, USER, USERS);
        const deleteActionAllowed = authUser.root ? true : Can.User(authUser).perform(DELETE, USER, USERS);

        return (
            <Dialog
                backdropClassName="transparent__back"
                style={{width: '350px'}}
                lazy
                onClose={() => history.goBack()}
                hasBackdrop={false}
                canOutsideClickClose={false}
                icon="person"
                isOpen title={userBuffer.name || "User Not Found"}
            >
                <div className="pt-dialog-body">

                    <ConfirmAlert
                        open={confirmDelete}
                        intent={Intent.DANGER}
                        onConfirm={this._handleDeleteUser}
                        onCancel={() => this.setState({confirmDelete: false})} />

                    <label className="pt-label">
                        Full Name
                        <input
                            value={name || ''}
                            name={'name'} onChange={({target: {name, value}}) => this._handleInputChange(name, value)}
                            className="pt-input pt-fill" type="text" dir="auto" />
                    </label>
                    <label className="pt-label">
                        Email Address
                        <input
                            value={username || ''}
                            name={'username'} onChange={({target: {name, value}}) => this._handleInputChange(name, value)}
                            className="pt-input pt-fill" type="email" dir="auto" />
                    </label>
                    <label className="pt-label">
                        Role
                        <RolesSelect
                            small={false}
                            roles={roles}
                            onChange={({value}) => this._handleInputChange('role', value)}
                            value={role || ''}/>
                    </label>
                    {requirePin && (
                        <label className="pt-label">
                            Pin
                            <input
                                value={pin || ''}
                                name={'pin'} onChange={({target: {name, value}}) => this._handleInputChange(name, value)}
                                className="pt-input pt-fill" type="text" dir="auto" />
                        </label>
                    )}
                    <label style={{display: 'flex', marginRight: 0}} className="pt-control pt-inline pt-align-right pt-switch">
                        <input
                            name={'status'}
                            checked={status === 'active'}
                            onChange={({target: {name}}) => this._handleInputChange(name, status === 'active' ? 'inactive' : 'active')}
                            type="checkbox" />
                        <span className="pt-control-indicator"/>
                        <span>Active</span>
                    </label>
                </div>
                <div className="pt-dialog-footer">
                    <div className="pt-dialog-footer-actions">
                        {userNotFound && (
                            <Button
                                intent={Intent.PRIMARY}
                                onClick={() => history.goBack()}
                                icon="undo"
                                text="Go Back"
                            />
                        )}
                        <Button
                            disabled={deletingUser || editingUser || userNotFound || !deleteActionAllowed}
                            loading={deletingUser}
                            onClick={() => this.setState({confirmDelete: true})}
                            intent={Intent.DANGER}
                            text={'delete'}
                            icon="trash" />
                        <Button
                            disabled={disableSaveButton || deletingUser || userNotFound || !editActionAllowed}
                            loading={editingUser}
                            intent={Intent.PRIMARY}
                            onClick={this._handleEditUser}
                            icon="tick"
                            text="save"
                        />
                    </div>
                </div>
            </Dialog>
        );
    }

    static propTypes = {
        history: PropTypes.object.isRequired,
        authUser: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        OPERATION_FAILED: PropTypes.object.isRequired,
        OPERATION_SUCCESSFUL: PropTypes.object.isRequired,
        editUser: PropTypes.func.isRequired,
        deleteUser: PropTypes.func.isRequired,
        editingUser: PropTypes.bool.isRequired,
        deletingUser: PropTypes.bool.isRequired,
        roles: PropTypes.array.isRequired,
        users: PropTypes.array.isRequired,
        policies: PropTypes.array.isRequired
    };
}

const mapStateToProps = (
    {authUser, OPERATION_FAILED, OPERATION_SUCCESSFUL, editingUser, deletingUser, userGroups, policies, users}) => (
        {authUser, OPERATION_FAILED, OPERATION_SUCCESSFUL, editingUser, deletingUser, roles: userGroups, policies, users});
const mapDispatchToProps = dispatch => bindActionCreators({deleteUser, editUser}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(User));