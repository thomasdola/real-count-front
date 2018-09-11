import React from 'react';
import {Button, Classes, Collapse, Icon, Intent, Position, Tag} from '@blueprintjs/core';
import PropTypes from 'prop-types';
import Pluralize from 'pluralize';
import {editUser} from '../../../actions/userActions';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import _capitalize from 'lodash/capitalize';

import './index.css';
import {isFormValid} from "../Enrollment";
import {EDIT_USER_WITH_PASSWORD} from "../../../actions/types";
import Toaster from "../../Common/Toaster";
import _isEqual from "lodash/isEqual";

class Profile extends React.Component{

    constructor(props){
        super(props);

        this._updatePassword = this._updatePassword.bind(this);
        this._onPasswordChange = this._onPasswordChange.bind(this);
    }

    state = {
        password: {
            old: '',
            custom: '',
            confirm: ''
        }
    };

    componentDidUpdate(prevProps){
        const {OPERATION_SUCCESSFUL: OLD_OPERATION_SUCCESSFUL, OPERATION_FAILED: OLD_OPERATION_FAILED} = prevProps;
        const {OPERATION_SUCCESSFUL, OPERATION_FAILED} = this.props;

        if(!_isEqual(OLD_OPERATION_SUCCESSFUL, OPERATION_SUCCESSFUL)){
            console.log('cdu', OPERATION_SUCCESSFUL);
            if(OPERATION_SUCCESSFUL.action === EDIT_USER_WITH_PASSWORD){
                console.log('cdu match', OPERATION_SUCCESSFUL);
                Toaster.show({
                    message: `Password Updated Successfully 😃`,
                    intent: Intent.SUCCESS,
                    position: Position.BOTTOM,
                    icon: 'tick'
                });
            }
        }

        if(!_isEqual(OLD_OPERATION_FAILED, OPERATION_FAILED)){
            if(OPERATION_FAILED.action === EDIT_USER_WITH_PASSWORD){
                console.log(OPERATION_FAILED.data);
                Toaster.show({
                    message: `Could Not Update Password 😞`,
                    intent: Intent.DANGER,
                    position: Position.BOTTOM,
                    icon: 'error'
                });
            }
        }
    }

    _onPasswordChange(name, value){
        this.setState(() => {
            return {
                password: {...this.state.password, [name]: value}
            }
        })
    }

    _updatePassword(){
        const {editUser, authUser: {uuid}} = this.props;
        const {password: {old, custom, confirm}} = this.state;
        const filled = old.trim() && custom.trim() && confirm.trim();
        const confirmed = custom === confirm;
        if(filled && confirmed){
            let data = new FormData();
            data.append('update_password', true);
            data.append('old_password', old);
            data.append('password', custom);
            data.append('password_confirmation', confirm);
            editUser(uuid, data, EDIT_USER_WITH_PASSWORD);
        }
    }

    render(){
        const {open, onCloseProfile, editingUser, authUser: data} = this.props;
        const {password: {old, custom, confirm}} = this.state;
        const confirmed = custom.trim().length > 0 && custom.trim() === confirm.trim();
        const show = !data.password_updated || open;
        const formNotValid = isFormValid({old, custom, confirm});
        const disableSaveButton = !formNotValid || !confirmed;

        return (
            <Collapse 
                className={`profile__collapse ${ show && Classes.ELEVATION_1}`}
                isOpen={show}>
                <div className="profile__wrapper">
                    <header className="profile__header">
                        <Button
                            disabled={editingUser}
                            onClick={onCloseProfile} className="pt-small pt-intent-danger" icon="cross" text="Close"/>
                        <Button
                            disabled={disableSaveButton}
                            loading={editingUser}
                            onClick={this._updatePassword}
                            className="pt-small pt-intent-primary" icon="tick" text="Update"/>
                    </header>
                    <div className="profile__section">
                        <div className="row personal">
                            <div className="item">
                                <div className="title">
                                    <Icon icon={'user'}/> <Icon icon={'blank'}/>
                                </div>
                                <div className="data">
                                    {data.full_name}
                                </div>
                            </div>
                            <div className="item">
                                <div className="title">
                                    <Icon icon={'envelope'}/> <Icon icon={'blank'}/>
                                </div>
                                <div className="data">
                                    {data.username}
                                </div>
                            </div>
                            {data.pin ? (
                                <div className="item">
                                    <div className="title">
                                        <Icon icon={'mobile-phone'}/> <Icon icon={'blank'}/>
                                    </div>
                                    <div className="data">
                                        {data.pin}
                                    </div>
                                </div>
                            ) : null}
                            <div className="item">
                                <div className="title">
                                    <Icon icon={'id-number'}/> <Icon icon={'blank'}/>
                                </div>
                                <div className="data">
                                    {_capitalize(data.role.name)}
                                </div>
                            </div>
                        </div>

                        {data.root ? null : [
                            <div key={'pages'} className="row gates">
                                <div className="title">
                                    Page(s) you can view:
                                </div>
                                <div className="data">
                                    {data.role.gates.map(gate => [
                                        <Tag intent={Intent.PRIMARY} className="pt-minimal" key={gate}>{gate}</Tag>,
                                        <Icon key={`${new Date()}_space`} icon={'blank'}/>
                                    ])}
                                </div>
                            </div>,

                            <div key={'policies'} className="row policies">
                                <div className="title"> You can</div>
                                <div className="data">
                                    {data.role.entities.map(({name, actions}) => (
                                        <div className="policy" key={name}>
                                            {actions.map(action => [
                                                <Tag className="pt-minimal pt-intent-success" key={action}>{action}</Tag>,
                                                <Icon key={`${new Date()}_space`} icon={'blank'}/>
                                            ])}
                                            <span> <Icon icon='blank'/>
                                                    <Tag intent={Intent.PRIMARY} className="pt-minimal"
                                                         key={name}>{Pluralize(name)}</Tag>
                                                </span>
                                        </div>
                                    ))}
                                    <div><br/> Within <Tag className="pt-minimal">{_capitalize(data.role.level.name)}</Tag>
                                        <span style={{marginLeft: 10}}>{_capitalize(data.role.level.type)}</span>.
                                    </div>
                                </div>
                            </div>
                        ]}

                        <div className="row password">
                            {/*<div className="title">*/}
                            {/*Password:*/}
                            {/*</div>*/}
                            <div className="data">
                                <label className="pt-label">
                                    Current Password
                                    <input
                                        value={this.state.password.old}
                                        name={'old'}
                                        onChange={({target: {name, value}}) => this._onPasswordChange(name, value)}
                                        className="pt-input bms-small pt-fill" type="password" dir="auto" />
                                </label>
                                <label className="pt-label">
                                    New Password
                                    <input
                                        value={this.state.password.custom}
                                        name={'custom'}
                                        onChange={({target: {name, value}}) => this._onPasswordChange(name, value)}
                                        className="pt-input bms-small pt-fill" type="password" dir="auto" />
                                </label>
                                <label className="pt-label">
                                    Confirm Password
                                    <input
                                        value={this.state.password.confirm}
                                        name={'confirm'}
                                        onChange={({target: {name, value}}) => this._onPasswordChange(name, value)}
                                        className="pt-input bms-small pt-fill" type="password" dir="auto" />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </Collapse>
        );
    }

    static propTypes = {
        authUser: PropTypes.object.isRequired,
        OPERATION_SUCCESSFUL: PropTypes.object.isRequired,
        OPERATION_FAILED: PropTypes.object.isRequired,
        editingUser: PropTypes.bool.isRequired,
        open: PropTypes.bool.isRequired,
        editUser: PropTypes.func.isRequired,
        onCloseProfile: PropTypes.func.isRequired,
    };
}

const mapStateToProps = (
    {OPERATION_SUCCESSFUL, OPERATION_FAILED, authUser, editingUser, editUser}) => (
        {OPERATION_SUCCESSFUL, OPERATION_FAILED, authUser, editingUser, editUser});
const mapDispatchToProps = dispatch => bindActionCreators({editUser}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Profile);