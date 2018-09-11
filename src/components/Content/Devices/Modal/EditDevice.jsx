import React from 'react';
import {Button, Dialog, Intent} from '@blueprintjs/core';
import {withRouter} from 'react-router-dom';
import PropTypes from "prop-types";
import {editDevice} from "../../../../actions/deviceActions";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import _find from "lodash/find";
import _isEqual from 'lodash/isEqual';
import Toaster from '../../../Common/Toaster';
import {EDIT_DEVICE} from "../../../../actions/types";

class EditDevice extends React.Component{
    constructor(props){
        super(props);

        this._onEditDevice = this._onEditDevice.bind(this);
    }

    state = {
        name: '',
        code: '',
        device: {}
    };

    _onEditDevice(){
        const {editDevice} = this.props;
        let {name, code, device: {uuid}} = this.state;
        if(!name.trim() || !code.trim())
            return;

        let data = new FormData();
        data.append('name', name);
        data.append('code', code);
        editDevice(uuid, data);
    }

    static getDerivedStateFromProps(nextProps, prevState){
        const {device: oldDevice} = prevState;
        const {devices, match: {params: {uuid}}} = nextProps;
        const device = _find(devices, {uuid});

        if(_isEqual(oldDevice, device) || !device)
            return null;

        const {code, name} = device;
        return { device, code, name };
    }

    componentDidUpdate(prevProps){
        const {OPERATION_SUCCESSFUL: OLD_OPERATION_SUCCESSFUL, OPERATION_FAILED: OLD_OPERATION_FAILED} = prevProps;
        const {OPERATION_SUCCESSFUL, OPERATION_FAILED, history} = this.props;

        if(!_isEqual(OLD_OPERATION_SUCCESSFUL, OPERATION_SUCCESSFUL)){
            if(OPERATION_SUCCESSFUL.action === EDIT_DEVICE){
                history.goBack();
                Toaster.show({
                    message: `Device Updated Successfully 😃`,
                    intent: Intent.SUCCESS,
                    icon: 'tick' });
            }
        }

        if(!_isEqual(OLD_OPERATION_FAILED, OPERATION_FAILED)){
            if(OPERATION_FAILED.action === EDIT_DEVICE){
                console.log(OPERATION_FAILED.data);
                Toaster.show({
                    message: `Could Not Update Device 😞`,
                    intent: Intent.DANGER,
                    icon: 'error'
                });
            }
        }
    }

    render(){

        const {editingDevice, history} = this.props;
        const {device, name, code} = this.state;
        const disableSaveButton = _isEqual(
            Object.assign({}, {name: device.name, code: device.code}),
            Object.assign({}, {name, code}));

        return (
            <Dialog
                backdropClassName="transparent__back"
                style={{width: '350px'}}
                lazy
                canOutsideClickClose={false}
                canEscapeKeyClose={false}
                onClose={() => history.goBack()}
                icon="edit"
                isOpen
                title="Edit Device"
            >
                <div className="pt-dialog-body">
                    <label className="pt-label">
                        ID
                        <input
                            onChange={({target: {value}}) => this.setState({code: value})}
                            value={code || ''} className="pt-input pt-fill" type="text" dir="auto" />
                    </label>
                    <label className="pt-label">
                        Name
                        <input
                            onChange={({target: {value}}) => this.setState({name: value})}
                            value={name || ''} className="pt-input pt-fill" type="text" dir="auto" />
                    </label>
                </div>
                <div className="pt-dialog-footer">
                    <div className="pt-dialog-footer-actions">
                        <Button className="bms-button" text="close" icon={'cross'} onClick={() => history.goBack()} />
                        <Button
                            disabled={disableSaveButton}
                            className="bms-button"
                            loading={editingDevice}
                            onClick={this._onEditDevice}
                            intent={Intent.PRIMARY}
                            icon="tick"
                            text="update"
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
        editDevice: PropTypes.func.isRequired,
        editingDevice: PropTypes.bool.isRequired,
        devices: PropTypes.array.isRequired
    };
}

const mapStateToProps = (
    {OPERATION_FAILED, OPERATION_SUCCESSFUL, editingDevice, devices}) => {
    return {OPERATION_FAILED, OPERATION_SUCCESSFUL, editingDevice, devices };
};
const mapDispatchToProp = dispatch => bindActionCreators({editDevice}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProp)(EditDevice));