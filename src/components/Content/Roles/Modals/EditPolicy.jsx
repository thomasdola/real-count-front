import React from 'react';
import {Button, Dialog, Intent} from '@blueprintjs/core';
import {withRouter} from 'react-router-dom';
import PropTypes from "prop-types";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {editPolicy} from '../../../../actions/policyActions';
import Gates from '../../../Common/filterRows/Gates';
import Entities from '../../../Common/filterRows/Entities';
import _find from 'lodash/find';
import Actions from "../../../Common/filterRows/Actions";
import _isEqual from 'lodash/isEqual';
import {isFormValid} from "../../Enrollment";
import {EDIT_POLICY} from "../../../../actions/types";
import Toaster from "../../../Common/Toaster";

class EditPolicy extends React.Component{

    constructor(props){
        super(props);

        this._handleInputChange = this._handleInputChange.bind(this);
        this._handleEditPolicy = this._handleEditPolicy.bind(this);
    }

    state = {
        policy: {gate: {}, entity: {}, actions: []},
        policyBuffer: {gate: {}, entity: {}, actions: []},
    };

    static getDerivedStateFromProps(nextProps, prevState){
        const {policy: oldPolicy} = prevState;
        const {match: {params: {uuid}}, policies} = nextProps;
        const policy = _find(policies, {uuid}) || {gate: {}, entity: {}, actions: []};

        if(_isEqual(oldPolicy, policy))
            return null;

        return {policy, policyBuffer: {...policy}};
    }

    componentDidUpdate(prevProps){
        const {OPERATION_SUCCESSFUL: OLD_OPERATION_SUCCESSFUL, OPERATION_FAILED: OLD_OPERATION_FAILED} = prevProps;
        const {OPERATION_SUCCESSFUL, OPERATION_FAILED, history} = this.props;

        if(!_isEqual(OLD_OPERATION_SUCCESSFUL, OPERATION_SUCCESSFUL)){
            if(OPERATION_SUCCESSFUL.action === EDIT_POLICY){
                history.goBack();
                Toaster.show({
                    message: `Policy Updated Successfully 😃`,
                    intent: Intent.SUCCESS,
                    icon: 'tick' });
            }
        }

        if(!_isEqual(OLD_OPERATION_FAILED, OPERATION_FAILED)){
            if(OPERATION_FAILED.action === EDIT_POLICY){
                console.log(OPERATION_FAILED.data);
                Toaster.show({
                    message: `Could Not Update Policy 😞`,
                    intent: Intent.DANGER,
                    icon: 'error'
                });
            }
        }
    }

    _handleInputChange(name, value){
        this.setState(() => {
            return {
                policy: {...this.state.policy, [name]: value}
            };
        })
    }

    _isFormValid(){
        const {policy: {name, gate: {id: gateId}, entity: {id: entityId}, actions}} = this.state;
        return isFormValid({name, gateId, entityId, actions});
    }

    _handleEditPolicy(){
        const {policy: {name, entity: {id: entityId}, actions, uuid}} = this.state;

        const actionsId = actions.map(({id}) => id);

        let data = new FormData();
        data.append('name', name);
        data.append('entity_id', entityId);
        for(let i = 0; i < actionsId.length; i++){
            data.append('actions[]', actionsId[i]);
        }
        this.props.editPolicy(uuid, data);
    }

    render(){
        const {policy, policyBuffer} = this.state;
        const {history, editingPolicy} = this.props;
        const disableSaveButton = !this._isFormValid() || _isEqual(policy, policyBuffer);
        return (
            <Dialog
                backdropClassName="transparent__back"
                style={{width: '350px'}}
                lazy
                onClose={() => history.goBack()}
                icon="layer"
                isOpen
                canOutsideClickClose={false}
                canEscapeKeyClose={false}
                title="Edit Policy"
            >
                <div className="pt-dialog-body">
                    <label className="pt-label">
                        Name
                        <input
                            onChange={({target: {name, value}}) => this._handleInputChange(name, value)}
                            value={policy.name || ''}
                            name={'name'}
                            className="pt-input pt-fill"
                            type="text" dir="auto" />
                    </label>
                    <label className="pt-label">
                        Gate
                        <Gates
                            value={policy.gate || ''}
                            small={false}
                            onChange={({value}) => this._handleInputChange('gate', value)}/>
                    </label>
                    <label className="pt-label">
                        Entity
                        <Entities
                            value={policy.entity || ''}
                            small={false}
                            onChange={({value}) => this._handleInputChange('entity', value)}/>
                    </label>
                    <label className="pt-label">
                        Actions
                        <Actions
                            onChange={({value}) => this._handleInputChange('actions', value)}
                            values={policy.actions}/>
                    </label>
                    <label className="pt-label">
                        Description
                        <textarea
                            name={'description'}
                            value={policy.description || ''}
                            onChange={({target: {name, value}}) => this._handleInputChange(name, value)} className="pt-input pt-fill" dir="auto"/>
                    </label>
                </div>
                <div className="pt-dialog-footer">
                    <div className="pt-dialog-footer-actions">
                        {/* <Button text="Secondary" /> */}
                        <Button
                            disabled={disableSaveButton}
                            loading={editingPolicy}
                            onClick={() => this._handleEditPolicy()}
                            intent={Intent.PRIMARY}
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
        OPERATION_SUCCESSFUL: PropTypes.object.isRequired,
        OPERATION_FAILED: PropTypes.object.isRequired,
        policies: PropTypes.array.isRequired,
        editPolicy: PropTypes.func.isRequired,
        editingPolicy: PropTypes.bool.isRequired
    };
}

const mapStateToProps = (
    {OPERATION_FAILED, OPERATION_SUCCESSFUL, editingPolicy, policies}) => (
        {OPERATION_FAILED, OPERATION_SUCCESSFUL, editingPolicy, policies});
const mapDispatchToProps = dispatch => bindActionCreators({editPolicy}, dispatch);


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditPolicy));