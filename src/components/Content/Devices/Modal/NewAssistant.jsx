import React from 'react';
import PropTypes from 'prop-types';
import {Button, Dialog, Intent} from '@blueprintjs/core';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {addAssistant} from '../../../../actions/deviceActions';
import _filter from 'lodash/filter';
import _find from 'lodash/find';
import _isEqual from "lodash/isEqual";
import Toaster from "../../../Common/Toaster";
import {ADD_DEVICE_SUPERVISOR_ASSISTANT} from "../../../../actions/types";
import {isFormValid} from "../../Enrollment";

class NewAssistant extends React.Component{

    constructor(props){
        super(props);

        this._onAddAssistant = this._onAddAssistant.bind(this);
    }

    state = {
        assistant: '',
        device: {
            supervisor: {}
        }
    };

    static getDerivedStateFromProps(nextProps, prevState){
        const {device: oldDevice} = prevState;
        const {devices, match: {params: {uuid}}} = nextProps;
        const device = _find(devices, {uuid}) || {supervisor: {}};

        if(_isEqual(oldDevice, device))
            return null;

        return { device };
    }

    componentDidUpdate(prevProps){
        const {OPERATION_SUCCESSFUL: OLD_OPERATION_SUCCESSFUL, OPERATION_FAILED: OLD_OPERATION_FAILED} = prevProps;
        const {OPERATION_SUCCESSFUL, OPERATION_FAILED, history} = this.props;

        if(!_isEqual(OLD_OPERATION_SUCCESSFUL, OPERATION_SUCCESSFUL)){
            if(OPERATION_SUCCESSFUL.action === ADD_DEVICE_SUPERVISOR_ASSISTANT){
                history.goBack();
                Toaster.show({
                    message: `Assistant Added Successfully 😃`,
                    intent: Intent.SUCCESS,
                    icon: 'tick' });
            }
        }

        if(!_isEqual(OLD_OPERATION_FAILED, OPERATION_FAILED)){
            if(OPERATION_FAILED.action === ADD_DEVICE_SUPERVISOR_ASSISTANT){
                console.log(OPERATION_FAILED.data);
                Toaster.show({
                    message: `Could Not Add Assistant 😞`,
                    intent: Intent.DANGER,
                    icon: 'error'
                });
            }
        }
    }

    _onAddAssistant(){
        const {addAssistant, availableAssistants} = this.props;
        const {assistant, device} = this.state;
        if(assistant.trim()){
            const entity = _find(availableAssistants, {uuid: assistant});
            console.log('safe add', entity);
            let data = new FormData();
            data.append('type', entity.type);
            data.append('entity', entity.uuid);
            data.append('supervisor', 0);
            addAssistant(device.uuid, data);
        }
    }

    render(){
        const {addingAssistant, history, availableAssistants} = this.props;
        const {device, assistant} = this.state;
        const disableSaveButton = !isFormValid({assistant});
        return (
            <Dialog
                backdropClassName="transparent__back"
                style={{width: '350px'}}
                lazy
                canEscapeKeyClose={false}
                canOutsideClickClose={false}
                onClose={() => {
                    !addingAssistant && history.goBack();
                }}
                hasBackdrop={false}
                icon="person"
                isOpen
                title="New Assistant"
            >
                <div className="pt-dialog-body">
                    <label className="pt-label">
                        ID
                        <input readOnly value={device.code || ''} className="pt-input pt-fill" type="text" dir="auto" />
                    </label>
                    <label className="pt-label">
                        Name
                        <input readOnly value={device.name || ''} className="pt-input pt-fill" type="text" dir="auto" />
                    </label>
                    <label className="pt-label">
                        Supervisor
                        <input readOnly value={device.supervisor.full_name || ''} className="pt-input pt-fill" type="text" dir="auto" />
                    </label>
                    <label className="pt-label">
                        Assistant
                        <div className="pt-select">
                            <select
                                onChange={({target: {value}}) => this.setState({assistant: value})}
                                value={assistant || ''}>
                                <option>Select ...</option>
                                {
                                    availableAssistants.map(a => {
                                        return (
                                            <option key={a.uuid} value={a.uuid}>{a.name}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </label>
                </div>
                <div className="pt-dialog-footer">
                    <div className="pt-dialog-footer-actions">
                        <Button
                            disabled={addingAssistant}
                            className="bms-button"
                            text="close" icon={'cross'}
                            onClick={() => history.goBack()} />
                        <Button
                            disabled={disableSaveButton}
                            className="bms-button"
                            loading={addingAssistant}
                            onClick={this._onAddAssistant}
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
        history: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        OPERATION_FAILED: PropTypes.object.isRequired,
        OPERATION_SUCCESSFUL: PropTypes.object.isRequired,
        addAssistant: PropTypes.func.isRequired,
        addingAssistant: PropTypes.bool.isRequired,
        loadingDeviceOperators: PropTypes.bool.isRequired,
        devices: PropTypes.array.isRequired,
        availableAssistants: PropTypes.array.isRequired
    };
}

const mapStateToProps = (
    {OPERATION_FAILED, OPERATION_SUCCESSFUL, addingDeviceSupervisorAssistant, loadingDeviceOperators,
        deviceOperators, devices}) => {
    return {OPERATION_FAILED, OPERATION_SUCCESSFUL,
        addingAssistant: addingDeviceSupervisorAssistant, loadingDeviceOperators, deviceOperators, devices,
        availableAssistants: _filter(deviceOperators, {available: true, assistant: false}),
        availableDeviceSupervisorOperators: _filter(deviceOperators, {assistant: false}),
    };
};
const mapDispatchToProp = dispatch => bindActionCreators({addAssistant}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProp)(NewAssistant));