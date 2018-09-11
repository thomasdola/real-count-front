import React from 'react';
import {Button, Dialog, Intent} from '@blueprintjs/core';
import {withRouter} from 'react-router-dom';
import PropTypes from "prop-types";
import {mapDevice} from "../../../../actions/deviceActions";
import {connect} from "react-redux";
import _filter from "lodash/filter";
import {bindActionCreators} from "redux";
import _find from "lodash/find";
import Toaster from '../../../Common/Toaster';
import _isEqual from "lodash/isEqual";
import {MAP_DEVICE} from "../../../../actions/types";

class MapDevice extends React.Component{
    constructor(props){
        super(props);

        this._onMapDevice = this._onMapDevice.bind(this);
    }

    state = {
        supervisor: '',
        device: {}
    };

    static getDerivedStateFromProps(nextProps, prevState){
        const {device: oldDevice} = prevState;
        const {devices, match: {params: {uuid}}} = nextProps;
        const device = _find(devices, {uuid}) || {};

        if(_isEqual(oldDevice, device))
            return null;

        return { device };
    }

    componentDidUpdate(prevProps){
        const {OPERATION_SUCCESSFUL: OLD_OPERATION_SUCCESSFUL, OPERATION_FAILED: OLD_OPERATION_FAILED} = prevProps;
        const {OPERATION_SUCCESSFUL, OPERATION_FAILED, history} = this.props;

        if(!_isEqual(OLD_OPERATION_SUCCESSFUL, OPERATION_SUCCESSFUL)){
            if(OPERATION_SUCCESSFUL.action === MAP_DEVICE){
                history.goBack();
                Toaster.show({
                    message: `Device Mapped Successfully 😃`,
                    intent: Intent.SUCCESS,
                    icon: 'tick' });
            }
        }

        if(!_isEqual(OLD_OPERATION_FAILED, OPERATION_FAILED)){
            if(OPERATION_FAILED.action === MAP_DEVICE){
                console.log(OPERATION_FAILED.data);
                Toaster.show({
                    message: `Could Not Map Device 😞`,
                    intent: Intent.DANGER,
                    icon: 'error'
                });
            }
        }
    }

    _onMapDevice(){
        const {availableDeviceOperators} = this.props;
        let {supervisor, device} = this.state;
        supervisor = supervisor.trim();
        if(supervisor.startsWith('Select') || !supervisor)
            return console.log('select a supervisor');

        const entity = _find(availableDeviceOperators, {uuid: supervisor});
        console.log('device map', entity);

        let data = new FormData();
        data.append('type', entity.type);
        data.append('entity', entity.uuid);
        data.append('supervisor', 1);

        this.props.mapDevice(device.uuid, data);
    }

    render(){

        const {mappingDevice, history, availableDeviceOperators} = this.props;
        const {device, supervisor} = this.state;
        const disableSaveButton = supervisor.trim().startsWith('Select') || !supervisor.trim();

        return (
            <Dialog
                backdropClassName="transparent__back"
                style={{width: '350px'}}
                lazy
                canOutsideClickClose={false}
                canEscapeKeyClose={false}
                onClose={() => history.goBack()}
                icon="map"
                isOpen
                title="Map Device"
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
                        <div className="pt-select">
                            <select value={this.state.supervisor || ''}
                                onChange={({target: {value}}) => this.setState({supervisor: value})}>
                                <option>Select ...</option>
                                {
                                    availableDeviceOperators.map(op => {
                                        return (
                                            <option key={op.uuid} value={op.uuid}>{op.name}</option>
                                        );
                                    })
                                }
                            </select>
                        </div>
                    </label>
                </div>
                <div className="pt-dialog-footer">
                    <div className="pt-dialog-footer-actions">
                        <Button className="bms-button" text="close" icon={'cross'} onClick={() => history.goBack()} />
                        <Button
                            disabled={disableSaveButton}
                            className="bms-button"
                            loading={mappingDevice}
                            onClick={this._onMapDevice}
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
        mapDevice: PropTypes.func.isRequired,
        mappingDevice: PropTypes.bool.isRequired,
        devices: PropTypes.array.isRequired,
        deviceOperators: PropTypes.array.isRequired,
        availableDeviceOperators: PropTypes.array.isRequired,
    };
}

const mapStateToProps = (
    {OPERATION_FAILED, OPERATION_SUCCESSFUL, mappingDevice, deviceOperators, devices}) => {
    return {OPERATION_FAILED, OPERATION_SUCCESSFUL,
        mappingDevice, deviceOperators, devices,
        availableDeviceOperators: _filter(deviceOperators, {available: true, assistant: false, type: 'beneficiary'}),
    };
};
const mapDispatchToProp = dispatch => bindActionCreators({mapDevice}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProp)(MapDevice));