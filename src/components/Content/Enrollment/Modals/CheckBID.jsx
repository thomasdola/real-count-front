import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Button, Dialog, Intent} from '@blueprintjs/core';
import {checkBid} from '../../../../actions/enrolmentActions';
import {CHECK_BID} from "../../../../actions/types";
import _isEqual from "lodash/isEqual";
import Toaster from "../../../Common/Toaster";

class CheckBID extends React.Component{

    constructor(props){
        super(props);

        this._onKeyPress = this._onKeyPress.bind(this);
        this._check = this._check.bind(this);
    }

    state = {
        bid: ''
    };

    componentDidUpdate(prevProps){
        const {OPERATION_SUCCESSFUL: OLD_OPERATION_SUCCESSFUL, OPERATION_FAILED: OLD_OPERATION_FAILED} = prevProps;
        const {OPERATION_SUCCESSFUL, OPERATION_FAILED} = this.props;

        if(!_isEqual(OLD_OPERATION_SUCCESSFUL, OPERATION_SUCCESSFUL)){
            if(OPERATION_SUCCESSFUL.action === CHECK_BID && !OPERATION_SUCCESSFUL.data.valid){
                Toaster.show({
                    message: `BID Is Invalid 😞`,
                    intent: Intent.DANGER,
                    icon: 'error'
                });
            }
        }

        if(!_isEqual(OLD_OPERATION_FAILED, OPERATION_FAILED)){
            if(OPERATION_FAILED.action === CHECK_BID){
                console.log(OPERATION_FAILED.data);
                Toaster.show({
                    message: `BID Is Invalid 😞`,
                    intent: Intent.DANGER,
                    icon: 'error'
                });
            }
        }
    }

    _check(){
        const {bid} = this.state;
        if(bid.trim()){
            let data = new FormData();
            data.append('bid', bid);
            this.props.checkBid(data);
        }
    }

    _onKeyPress({keyCode}){
        if(keyCode === 13){
            this._check();
        }
    }

    render(){
        const { allowToEnroll: {valid}, checkingBid, history } = this.props;
        return (
            <Dialog
                style={{width: '350px'}}
                backdropClassName="transparent__back"
                canEscapeKeyClose={false}
                canOutsideClickClose={false}
                lazy
                isOpen={!valid}
            >
                <div className="pt-dialog-body">
                    <label className="pt-label">
                        BID
                        <span className="pt-text-muted">(check on the beneficiary enrollment form)</span>
                        <input
                            onChange={({target: {value}}) => this.setState({bid: value})}
                            onKeyDown={this._onKeyPress}
                            value={this.state.bid || ''}
                            className="pt-input pt-fill" type="text" placeholder="ZGH1234567" dir="auto" />
                    </label>
                </div>
                <div className="pt-dialog-footer">
                    <div className="pt-dialog-footer-actions">
                        <Button
                            icon={'undo'}
                            intent={Intent.DANGER}
                            text="cancel"
                            disabled={checkingBid}
                            onClick={() => history.goBack()} />
                        <Button
                            intent={Intent.PRIMARY}
                            loading={checkingBid}
                            icon="tick"
                            text="start"
                            onClick={this._check}
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
        checkBid: PropTypes.func.isRequired,
        checkingBid: PropTypes.bool.isRequired,
        allowToEnroll: PropTypes.object.isRequired,
    };
}

const mapStateToProps = (
    {OPERATION_FAILED, OPERATION_SUCCESSFUL, checkingBid, allowToEnroll}) => (
        {OPERATION_FAILED, OPERATION_SUCCESSFUL, checkingBid, allowToEnroll});
const mapDispatchToProps = dispatch => bindActionCreators({checkBid}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CheckBID));