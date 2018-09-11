import React from 'react';
import {Button, Dialog, Intent} from '@blueprintjs/core';
import Gates from "../../../Common/filterRows/Gates";
import Entities from "../../../Common/filterRows/Entities";
import Actions from "../../../Common/filterRows/Actions";
import PropTypes from "prop-types";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {addPolicy} from '../../../../actions/policyActions';
import {isFormValid} from "../../Enrollment";
import {ADD_POLICY} from "../../../../actions/types";
import Toaster from "../../../Common/Toaster";
import _isEqual from "lodash/isEqual";

class NewPolicy extends React.Component{

    constructor(props){
        super(props);

        this._handleInputChange = this._handleInputChange.bind(this);
        this._handleAddPolicy = this._handleAddPolicy.bind(this);
    }

    state = {
        gate: {},
        entity: {},
        actions: [],
        name: '',
        description: ''
    };

    componentDidUpdate(prevProps){
        const {OPERATION_SUCCESSFUL: OLD_OPERATION_SUCCESSFUL, OPERATION_FAILED: OLD_OPERATION_FAILED} = prevProps;
        const {OPERATION_SUCCESSFUL, OPERATION_FAILED, history} = this.props;

        const policy = this.state.name.toUpperCase();

        if(!_isEqual(OLD_OPERATION_SUCCESSFUL, OPERATION_SUCCESSFUL)){
            if(OPERATION_SUCCESSFUL.action === ADD_POLICY){
                history.goBack();
                Toaster.show({
                    message: `${policy} Successfully Added 😃`,
                    intent: Intent.SUCCESS,
                    icon: 'tick' });
            }
        }

        if(!_isEqual(OLD_OPERATION_FAILED, OPERATION_FAILED)){
            if(OPERATION_FAILED.action === ADD_POLICY){
                console.log(OPERATION_FAILED.data);
                Toaster.show({
                    message: `Could Not Add ${policy} 😞`,
                    intent: Intent.DANGER,
                    icon: 'error'
                });
            }
        }
    }

    _handleInputChange(name, value){
        this.setState(() => {
            return {
                [name]: value
            };
        })
    }

    _handleAddPolicy(){
        const {name, entity: {id: entityId}, actions} = this.state;
        const actionsId = actions.map(({id}) => id);

        let data = new FormData();
        data.append('name', name);
        data.append('entity_id', entityId);
        for(let i = 0; i < actionsId.length; i++){
            data.append('actions[]', actionsId[i]);
        }

        this.props.addPolicy(data);
    }

    _isFormValid(){
        const {name, gate: {id: gateId}, entity: {id: entityId}, actions} = this.state;
        return isFormValid({name, gateId, entityId, actions});
    }

    render(){
        const {gate, actions, description, entity, name} = this.state;
        const {addingPolicy, history} = this.props;
        const disabledSaveButton = !this._isFormValid();
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
                title="New Policy"
            >
                <div className="pt-dialog-body">
                    <label className="pt-label">
                        Name
                        <input
                            onChange={({target: {name, value}}) => this._handleInputChange(name, value)}
                            value={name || ''}
                            name={'name'}
                            className="pt-input pt-fill"
                            type="text" dir="auto" />
                    </label>
                    <label className="pt-label">
                        Gate
                        <Gates
                            value={gate || ''}
                            small={false}
                            onChange={({value}) => this._handleInputChange('gate', value)}/>
                    </label>
                    <label className="pt-label">
                        Entity
                        <Entities
                            value={entity || ''}
                            small={false}
                            onChange={({value}) => this._handleInputChange('entity', value)}/>
                    </label>
                    <label className="pt-label">
                        Actions
                        <Actions
                            onChange={({value}) => this._handleInputChange('actions', value)}
                            values={actions}/>
                    </label>
                    <label className="pt-label">
                        Description
                        <textarea
                            name={'description'}
                            value={description || ''}
                            onChange={({target: {name, value}}) => this._handleInputChange(name, value)}
                            className="pt-input pt-fill" dir="auto"/>
                    </label>
                </div>
                <div className="pt-dialog-footer">
                    <div className="pt-dialog-footer-actions">
                        {/* <Button text="Secondary" /> */}
                        <Button
                            disabled={disabledSaveButton}
                            loading={addingPolicy}
                            intent={Intent.PRIMARY}
                            onClick={this._handleAddPolicy}
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
        OPERATION_FAILED: PropTypes.object.isRequired,
        OPERATION_SUCCESSFUL: PropTypes.object.isRequired,
        addPolicy: PropTypes.func.isRequired,
        addingPolicy: PropTypes.bool.isRequired
    };
}

const mapStateToProps = (
    {OPERATION_FAILED, OPERATION_SUCCESSFUL, addingPolicy}) => (
        {OPERATION_FAILED, OPERATION_SUCCESSFUL, addingPolicy});
const mapDispatchToProps = dispatch => bindActionCreators({addPolicy}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(NewPolicy);