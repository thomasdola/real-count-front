import React from 'react';
import PropTypes from 'prop-types';
import {Button, Dialog, Intent} from '@blueprintjs/core';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {addDevice} from '../../../../actions/deviceActions';
import {ADD_DEVICE} from "../../../../actions/types";
import Toaster from "../../../Common/Toaster";
import _isEqual from "lodash/isEqual";

class NewDevice extends React.Component{
    constructor(props){
        super(props);

        this._onAddDevice = this._onAddDevice.bind(this);
    }

    state = {code: '', name: ''};

    componentDidUpdate(prevProps){
        const {OPERATION_SUCCESSFUL: OLD_OPERATION_SUCCESSFUL, OPERATION_FAILED: OLD_OPERATION_FAILED} = prevProps;
        const {OPERATION_SUCCESSFUL, OPERATION_FAILED, history} = this.props;

        if(!_isEqual(OLD_OPERATION_SUCCESSFUL, OPERATION_SUCCESSFUL)){
            if(OPERATION_SUCCESSFUL.action === ADD_DEVICE){
                history.goBack();
                Toaster.show({
                    message: `Device Added Successfully 😃`,
                    intent: Intent.SUCCESS,
                    icon: 'tick' });
            }
        }

        if(!_isEqual(OLD_OPERATION_FAILED, OPERATION_FAILED)){
            if(OPERATION_FAILED.action === ADD_DEVICE){
                console.log(OPERATION_FAILED.data);
                Toaster.show({
                    message: `Could Not Add Device 😞`,
                    intent: Intent.DANGER,
                    icon: 'error'
                });
            }
        }
    }

    _onAddDevice(){
        const {code, name} = this.state;
        if(code.trim() && name.trim()){
            let data = new FormData();
            data.append('code', code);
            data.append('name', name);
            this.props.addDevice(data);
        }
    }

    render(){
        const {history, addingDevice} = this.props;
        return (
            <Dialog
                icon="mobile-phone"
                style={{width: '350px'}}
                onClose={() => history.goBack()}
                lazy
                canEscapeKeyClose={false}
                canOutsideClickClose={false}
                backdropClassName="transparent__back"
                isOpen
                title="New Device"
            >
                <div className="pt-dialog-body">
                    <label className="pt-label">
                        ID
                        <input
                            value={this.state.code || ''}
                            onChange={({target: {value}}) => this.setState({code: value})}
                            className="pt-input pt-fill" type="text" dir="auto" />
                    </label>
                    <label className="pt-label">
                        Name
                        <input
                            value={this.state.name || ''}
                            onChange={({target: {value}}) => this.setState({name: value})}
                            className="pt-input pt-fill" type="text" dir="auto" />
                    </label>
                </div>
                <div className="pt-dialog-footer">
                    <div className="pt-dialog-footer-actions">
                         <Button text="close" icon={'cross'} onClick={() => history.goBack()} />
                        <Button
                            className="bms-button"
                            intent={Intent.PRIMARY}
                            loading={addingDevice}
                            onClick={this._onAddDevice}
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
        addDevice: PropTypes.func.isRequired,
        addingDevice: PropTypes.bool.isRequired
    };
}

const mapStateToProps = (
    {OPERATION_FAILED, OPERATION_SUCCESSFUL, addingDevice}) => (
        {OPERATION_FAILED, OPERATION_SUCCESSFUL, addingDevice});
const mapDispatchToProp = dispatch => bindActionCreators({addDevice}, dispatch);

export default connect(mapStateToProps, mapDispatchToProp)(NewDevice);