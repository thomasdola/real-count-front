import React from 'react';
import {Button, Dialog, Intent} from '@blueprintjs/core';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {addUser} from '../../../../actions/userActions';
import RolesSelect from "../Table/RolesSelect";
import _indexOf from 'lodash/indexOf';
import _filter from 'lodash/filter';
import {isFormValid} from "../../Enrollment";
import * as AuthActions from "../../../../api/constants/Actions";
import Toaster from "../../../Common/Toaster";
import {ADD_USER} from "../../../../actions/types";
import _isEqual from "lodash/isEqual";
import _find from 'lodash/find';

class NewUser extends React.Component{
    constructor(props){
        super(props);

        this._handleAddUser = this._handleAddUser.bind(this);
        this._handleInputChange = this._handleInputChange.bind(this);
    }

    state = {
        name: '',
        username: '',
        role: '',
        pin: ''
    };

    componentDidUpdate(prevProps){
        const {OPERATION_SUCCESSFUL: OLD_OPERATION_SUCCESSFUL, OPERATION_FAILED: OLD_OPERATION_FAILED} = prevProps;
        const {OPERATION_SUCCESSFUL, OPERATION_FAILED, history} = this.props;

        const user = this.state.name.toUpperCase();

        if(!_isEqual(OLD_OPERATION_SUCCESSFUL, OPERATION_SUCCESSFUL)){
            if(OPERATION_SUCCESSFUL.action === ADD_USER){
                history.goBack();
                Toaster.show({
                    message: `${user} Successfully Added 😃`,
                    intent: Intent.SUCCESS,
                    icon: 'tick' });
            }
        }

        if(!_isEqual(OLD_OPERATION_FAILED, OPERATION_FAILED)){
            if(OPERATION_FAILED.action === ADD_USER){
                console.log(OPERATION_FAILED.data);
                Toaster.show({
                    message: `Could Not Add ${user} 😞`,
                    intent: Intent.DANGER,
                    icon: 'error'
                });
            }
        }
    }

    _handleInputChange(name, value){
        this.setState({[name]: value});
    }

    _handleAddUser(){
        const {policies} = this.props;
        const {name, username, role, pin} = this.state;
        const requirePin = NewUser._requirePin(Number.parseInt(role, 10), policies);

        let data = new FormData();

        data.append('full_name', name);
        data.append('username', username);
        data.append('role_id', role);

        if(requirePin)
            data.append('pin', pin);

        this.props.addUser(data)
    }

    _isFormValid(){
        const {policies} = this.props;
        const {name, username, role, pin} = this.state;
        const requirePin = NewUser._requirePin(Number.parseInt(role, 10), policies);

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
        const {history: {goBack}, addingUser, roles, policies} = this.props;
        const {name, role, username, pin} = this.state;
        const requirePin = NewUser._requirePin(Number.parseInt(role, 10), policies);
        const disableSaveButton = !this._isFormValid();

        return (
            <Dialog
                backdropClassName="transparent__back"
                style={{width: '350px'}}
                lazy
                onClose={() => goBack()}
                hasBackdrop={false}
                canOutsideClickClose={false}
                icon="new-person"
                isOpen title="New User"
            >
                <div className="pt-dialog-body">
                    <label className="pt-label">
                        Full Name
                        <input
                            value={name}
                            name={'name'} onChange={({target: {name, value}}) => this._handleInputChange(name, value)}
                            className="pt-input pt-fill" type="text" dir="auto" />
                    </label>
                    <label className="pt-label">
                        Email Address
                        <input
                            value={username}
                            name={'username'} onChange={({target: {name, value}}) => this._handleInputChange(name, value)}
                            className="pt-input pt-fill" type="email" dir="auto" />
                    </label>
                    <label className="pt-label">
                        Role
                        <RolesSelect
                            small={false}
                            roles={roles}
                            onChange={({value}) => this._handleInputChange('role', value)}
                            value={role}/>
                    </label>
                    {requirePin && (
                        <label className="pt-label">
                            Pin
                            <input
                                value={pin}
                                name={'pin'} onChange={({target: {name, value}}) => this._handleInputChange(name, value)}
                                className="pt-input pt-fill" type="text" dir="auto" />
                        </label>
                    )}
                </div>
                <div className="pt-dialog-footer">
                    <div className="pt-dialog-footer-actions">
                        <Button
                            disabled={disableSaveButton}
                            loading={addingUser}
                            intent={Intent.PRIMARY}
                            onClick={this._handleAddUser}
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
        OPERATION_SUCCESSFUL: PropTypes.object.isRequired,
        OPERATION_FAILED: PropTypes.object.isRequired,
        addUser: PropTypes.func.isRequired,
        addingUser: PropTypes.bool.isRequired,
        roles: PropTypes.array.isRequired,
        policies: PropTypes.array.isRequired,
    };
}

const mapStateToProps = (
    {OPERATION_SUCCESSFUL, OPERATION_FAILED, addingUser, userGroups, policies}) => (
        {OPERATION_SUCCESSFUL, OPERATION_FAILED, addingUser, roles: userGroups, policies});
const mapDispatchToProps = dispatch => bindActionCreators({addUser}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(NewUser);