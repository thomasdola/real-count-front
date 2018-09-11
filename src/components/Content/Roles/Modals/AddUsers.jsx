import React from 'react';
import {Button, Dialog, Intent} from '@blueprintjs/core';
import {withRouter} from 'react-router-dom';
import UsersMultiSelect from "../Lists/UsersMultiSelect";
import PropTypes from "prop-types";
import {editRole} from "../../../../actions/roleActions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import _find from "lodash/find";
import * as AuthActions from '../../../../api/constants/Actions';
import UsersSingleSelect from "../Lists/UsersSingleSelect";
import _isEqual from 'lodash/isEqual';
import {isFormValid} from "../../Enrollment";
import Toaster from "../../../Common/Toaster";
import {EDIT_GROUP_WITH_USERS} from "../../../../actions/types";
import _filter from 'lodash/filter';
import _indexOf from 'lodash/indexOf';

class AddUsers extends React.Component{

    constructor(props){
        super(props);

        this._handleInputChange = this._handleInputChange.bind(this);
        this._handleEditRole = this._handleEditRole.bind(this);
    }

    state = {
        users: [],
        user: {},
        pin: '',
        role: {},
        single: false
    };

    static getDerivedStateFromProps(nextProps, prevState){
        const {role: oldRole, single: oldSingle} = prevState;
        const {groups, match: {params: {uuid}}, policies} = nextProps;
        let group = _find(groups, {uuid}) || {};
        const newSingle = AddUsers._oneOrMultiple(group, policies);

        if(_isEqual(oldRole, group) && _isEqual(oldSingle, newSingle))
            return null;

        return {role: group, single: newSingle};
    }


    componentDidUpdate(prevProps){
        const {OPERATION_SUCCESSFUL: OLD_OPERATION_SUCCESSFUL, OPERATION_FAILED: OLD_OPERATION_FAILED} = prevProps;

        const {groups, match: {params: {uuid}}, OPERATION_SUCCESSFUL, OPERATION_FAILED, history} = this.props;

        const group = _find(groups, {uuid}) || {name: ''};

        const role = group.name.toUpperCase();
        
        if(!_isEqual(OLD_OPERATION_SUCCESSFUL, OPERATION_SUCCESSFUL)){
            if(OPERATION_SUCCESSFUL.action === EDIT_GROUP_WITH_USERS){
                history.goBack();
                Toaster.show({
                    message: `User(s) Added Successfully To ${role} 😃`,
                    intent: Intent.SUCCESS,
                    icon: 'tick' });
            }
        }

        if(!_isEqual(OLD_OPERATION_FAILED, OPERATION_FAILED)){
            if(OPERATION_FAILED.action === EDIT_GROUP_WITH_USERS){
                console.log(OPERATION_FAILED.data);
                Toaster.show({
                    message: `Could Not Add User(s) To ${role} 😞`,
                    intent: Intent.DANGER,
                    icon: 'error'
                });
            }
        }
    }

    _formValid(){
        const {pin, user, users, single} = this.state;
        let required = {};
        if(single) {
            required = {...required, user: user.id, pin};
        }else{
            required = {...required, users: users.map(({id}) => id)};
        }

        return isFormValid(required);
    }

    _handleInputChange(name, value){
        this.setState({[name]: value});
    }

    _handleEditRole(){
        const {pin, user, users, single} = this.state;
        let data = new FormData();

        if(single){
            data.append('user', user.id);
            data.append('pin', pin);
        }else{
            const usersId = users.map(({id}) => id);
            for(let i = 0; i < usersId.length; i++){
                data.append('users[]', usersId[i]);
            }
        }
        data.append('single', single ? "1" : "0");

        this.props.editRole(this.state.role.uuid, data, EDIT_GROUP_WITH_USERS);
    }

    static _oneOrMultiple({id: role}, policies){
        if(role){
            const rolePolicies = _filter(policies, ({roles}) => {
                return _indexOf(roles, role) !== -1;
            });
    
            const operateRolePolicies = _find(rolePolicies, ({actions}) => {
                return !!_find(actions, {name: AuthActions.OPERATE});
            });
    
            return !!operateRolePolicies;
        }
    }

    render(){
        const {history, editingGroup} = this.props;
        const {pin, single} = this.state;
        const disableSaveButton = !this._formValid();

        const multipleOrOneWithPin = single ? (
            <UsersSingleSelect
                onChange={({value}) => this._handleInputChange('user', value)}
                value={this.state.user} />
        ) : (
            <UsersMultiSelect
                onChange={({value}) => this._handleInputChange('users', value)}
                values={this.state.users}/>
        );

        return (
            <Dialog
                backdropClassName="transparent__back"
                style={{width: '350px'}}
                lazy
                canOutsideClickClose={false}
                onClose={() => history.goBack()}
                canEscapeKeyClose={false}
                icon="people"
                isOpen
                title={`Add User(s) to ${this.state.role.name || ''} Group`}
            >
                <div className="pt-dialog-body">
                    <label className="pt-label">
                        Users
                        {multipleOrOneWithPin}
                    </label>

                    {single && (
                        <label className="pt-label">
                            Pin
                            {/*<span className="pt-text-muted">Used in logging into the device</span>*/}
                            <input
                                onChange={({target: {name, value}}) => this._handleInputChange(name, value)}
                                value={pin || ''}
                                name={'pin'}
                                className="pt-input pt-fill"
                                type="text" dir="auto" />
                        </label>
                    )}
                </div>
                <div className="pt-dialog-footer">
                    <div className="pt-dialog-footer-actions">
                        {/* <Button text="Secondary" /> */}
                        <Button
                            disabled={disableSaveButton}
                            loading={editingGroup}
                            intent={Intent.PRIMARY}
                            onClick={this._handleEditRole}
                            icon="tick"
                            text="save"
                        />
                    </div>
                </div>
            </Dialog>
        );
    }

    static propTypes = {
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        OPERATION_FAILED: PropTypes.object.isRequired,
        OPERATION_SUCCESSFUL: PropTypes.object.isRequired,
        groups: PropTypes.array.isRequired,
        policies: PropTypes.array.isRequired,
        editRole: PropTypes.func.isRequired,
        editingGroup: PropTypes.bool.isRequired,
    }
}

const mapStateTopProps = (
    {OPERATION_FAILED, OPERATION_SUCCESSFUL, userGroups, editingGroup, policies}) => (
        {OPERATION_FAILED, OPERATION_SUCCESSFUL, groups: userGroups, editingGroup, policies});
const mapDispatchToProps = dispatch => bindActionCreators({editRole}, dispatch);

export default withRouter(connect(mapStateTopProps, mapDispatchToProps)(AddUsers));