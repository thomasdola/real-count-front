import React from 'react';
import {Alert, Button, ButtonGroup, Icon, Intent, ProgressBar, Radio, RadioGroup, Text, Dialog} from '@blueprintjs/core';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import IDTypes from "../../Common/filterRows/IDTypes";
import Regions from "../../Common/filterRows/Regions";
import Districts from "../../Common/filterRows/Districts";
import Locations from "../../Common/filterRows/Locations";
import Modules from "../../Common/filterRows/Modules";
import Ranks from "../../Common/filterRows/Ranks";
import * as actionTypes from '../../../actions/types';
import {CAPTURE_BIO, DELETE_BENEFICIARY, LOAD_BENEFICIARY, UPDATE_BENEFICIARY} from '../../../actions/types';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {deleteBeneficiary, loadBeneficiary, updateBeneficiary} from "../../../actions/beneficiaryActions";
import {
    emitCancelBioDataCapture,
    emitCaptureBioData,
    emitReCaptureBioData,
    initSocketListeners,
    stopSocketListeners,
    onBioDataCaptureCancelled,
    onBioDataCaptured,
    onBeneficiaryUpdated,
    onBeneficiaryUpdateFailed
} from "../../../actions/socket/beneficiaryActions";
import {reset} from "../../../actions/operationActions";
import MaskedInput from 'react-text-mask';
import _isEqual from 'lodash/isEqual';
import _omit from 'lodash/omit';

import "./index.css";
import {isFormValid} from "../Enrollment";
import Toaster from "../../Common/Toaster";
import {Operating} from "../Backups";

import Can from "../../../helpers/Can";
import {BENEFICIARIES} from '../../../api/constants/Gates';
import {BENEFICIARY} from '../../../api/constants/Entities';
import {EDIT} from '../../../api/constants/Actions';

export const base64ToDataURI = base64 => `data:image/jpg;base64,${base64}`;

export const CapturingBioAlert = ({open, onCancel}) => {
    return (
        <Alert 
            intent={Intent.DANGER}
            confirmButtonText="Cancel"
            onConfirm={onCancel}
            isOpen={open}>

            <ProgressBar value={100} intent={Intent.NONE}/>

        </Alert>
    );
};

export const ConfirmAlert = ({open, onCancel, onConfirm, intent, message}) => {
    message = message ? message : "Are You Sure ?";
    return (<Alert
        cancelButtonText="No"
        confirmButtonText="Yes"
        intent={intent || Intent.SUCCESS}
        isOpen={open}
        onCancel={onCancel}
        onConfirm={onConfirm}>
        <p>{message}</p>
    </Alert>)
};

const Unauthorized = ({open, history}) => {
    return (
        <Dialog
            style={{width: '350px'}}
            backdropClassName="transparent__back"
            canEscapeKeyClose={false}
            canOutsideClickClose={false}
            lazy
            isOpen={open}
        >
            <div className="pt-dialog-body">
                <p>
                    Sorry, You Are Not Authorized To Access This Page. Kindly Contact Your IT Department For Further Information.
                </p>
            </div>
            <div className="pt-dialog-footer">
                <div className="pt-dialog-footer-actions">
                    <Button
                        intent={Intent.WARNING}
                        icon="undo"
                        text="Go Back"
                        onClick={() => history.goBack()}
                    />
                </div>
            </div>
        </Dialog>
    );
};


class Beneficiary extends React.Component {
    constructor(props){
        super(props);

        this._deleteBeneficiary = this._deleteBeneficiary.bind(this);
        this._updateBeneficiary = this._updateBeneficiary.bind(this);
        this._goBack = this._goBack.bind(this);
        this._onInputChange = this._onInputChange.bind(this);
        this._confirmAction = this._confirmAction.bind(this);
        this._cancelAction = this._cancelAction.bind(this);
        this._onCaptureBio = this._onCaptureBio.bind(this);
        this._onCancelBioCapture = this._onCancelBioCapture.bind(this);
    }

    state = {
        userAuthorized: true,
        beneficiary: {
            uuid: "",
            bid: "",

            surname: "",
            forenames: "",
            date_of_birth: "",
            gender: "",
            phone_number: "",
            address: "",
            identification_id: "",
            identification_number: "",

            bank_name: "",
            bank_branch: "",
            account_number: "",
            allowance: "",

            region_id: "",
            district_id: "",
            location_id: "",
            module_id: "",
            rank_id: "",

            operator: false,
            pin: '',

            status: "",
            valid: "",
        },
        beneficiaryBuffer: {},
        bio: {
            indexRight: { uuid: "", path: "" },
            indexLeft: { uuid: "", path: "" },
            thumbRight: { uuid: "", path: "" },
            thumbLeft: { uuid: "", path: "" },
            portrait: { uuid: "", path: "" },
            form: { uuid: "", path: "" }
        },
        capturedBio: {
            thumb_left: {fmd: '', encoded: ''},
            thumb_right: {fmd: '', encoded: ''},
            index_left: {fmd: '', encoded: ''},
            index_right: {fmd: '', encoded: ''},
            portrait: {encoded: ''},
            form: {encoded: ''},
        },
        capturedBioBuffer: {
            thumb_left: {fmd: '', encoded: ''},
            thumb_right: {fmd: '', encoded: ''},
            index_left: {fmd: '', encoded: ''},
            index_right: {fmd: '', encoded: ''},
            portrait: {encoded: ''},
            form: {encoded: ''},
        },
        bioChanged: false,
        capturingBioData: false,
        reviewingBioData: false,
        confirmUpdate: false,
        confirmDelete: false,
        confirmCancelCaptureBioData: false
    };

    componentDidMount(){
        const {loadBeneficiary, match: {params: {uuid}}, socket, enrolmentSocket, authUser, onBioDataCaptured,
            onBioDataCaptureCancelled, onBeneficiaryUpdateFailed, onBeneficiaryUpdated} = this.props;
        initSocketListeners({socket, enrolmentSocket}, {
            authUser, onBeneficiaryUpdated,
            onBioDataCaptured,
            onBioDataCaptureCancelled,
            onBeneficiaryUpdateFailed
        });
        loadBeneficiary(uuid);
    }

    static getDerivedStateFromProps(nextProps, prevState){
        const {beneficiary, beneficiaryBio, authUser} = nextProps;
        const {beneficiary: oldBeneficiary, bio: oldBio} = prevState;

        if(_isEqual(oldBeneficiary, beneficiary)
            && _isEqual(oldBio, beneficiaryBio))
            return null;

        const beneficiaryLocations = {
            regionId: beneficiary.region_id, 
            districtId: beneficiary.district_id, 
            locationId: beneficiary.location_id
        };
        const userAuthorized = authUser.root 
            || Can.User(authUser).access(BENEFICIARIES, beneficiaryLocations);

        const beneficiaryToView = userAuthorized ? beneficiary : oldBeneficiary;
        const beneficiaryBioToView = userAuthorized ? beneficiaryBio : oldBio;

        return {
            beneficiary: {...beneficiaryToView},
            beneficiaryBuffer: {...beneficiaryToView},
            bio: {...beneficiaryBioToView}, 
            userAuthorized
        };
    }

    componentDidUpdate(prevProps, prevState){
        const {OPERATION_SUCCESSFUL: OLD_OPERATION_SUCCESSFUL, OPERATION_FAILED: OLD_OPERATION_FAILED} = prevProps;
        const {OPERATION_SUCCESSFUL, OPERATION_FAILED, history, loadBeneficiary} = this.props;

        if(!_isEqual(OLD_OPERATION_SUCCESSFUL, OPERATION_SUCCESSFUL)){
            const {action, data} = OPERATION_SUCCESSFUL;

            if(action === UPDATE_BENEFICIARY && !data.scheduled){
                Toaster.show({
                    message: `Beneficiary Successfully Updated 😃`,
                    intent: Intent.SUCCESS,
                    icon: 'tick' });

                loadBeneficiary(data.beneficiary.uuid);
            }

            if(action === DELETE_BENEFICIARY){
                history.goBack();

                Toaster.show({
                    message: `Beneficiary Successfully Removed 😃`,
                    intent: Intent.SUCCESS,
                    icon: 'tick' });
            }

            const {capturedBio: oldCapturedBio, capturedBioBuffer: oldCapturedBioBuffer} = prevState;
            const {bio: {indexRight, indexLeft, thumbRight, thumbLeft, portrait: statePortrait, form: stateForm},
                capturedBio, capturedBioBuffer} = this.state;
            if(action === CAPTURE_BIO
                && !_isEqual(oldCapturedBio, capturedBio)
                && !_isEqual(oldCapturedBioBuffer, capturedBioBuffer)){

                const {thumb_right, thumb_left, index_right, index_left, portrait, form} = data;

                this.setState(() => {
                    return {
                        capturingBioData: false,
                        bioChanged: true,
                        reviewingBioData: true,
                        capturedBio: {...data},
                        capturedBioBuffer: {...data},
                        bio: {
                            indexRight: { ...indexRight, path: base64ToDataURI(index_right.encoded) },
                            indexLeft: { ...indexLeft, path: base64ToDataURI(index_left.encoded) },
                            thumbRight: { ...thumbRight, path: base64ToDataURI(thumb_right.encoded) },
                            thumbLeft: { ...thumbLeft, path: base64ToDataURI(thumb_left.encoded) },
                            portrait: { ...statePortrait, path: base64ToDataURI(portrait.encoded) },
                            form: { ...stateForm, path: base64ToDataURI(form.encoded) }
                        }
                    };
                });

                Toaster.show({
                    message: "Bio Data Captured Successfully 😃",
                    timeout: 0,
                    intent: Intent.SUCCESS,
                    onDismiss: () => {
                        this.setState({reviewingBioData: false});
                        this._onCancelBioCapture();
                    },
                    action: {
                        onClick: () => this._onCaptureBio(true),
                        icon: 'hand',
                        text: 'Recapture'
                    },
                    icon: 'tick' });
            }
        }

        if(!_isEqual(OLD_OPERATION_FAILED, OPERATION_FAILED)){
            const {action, data} = OPERATION_FAILED;

            if(action === LOAD_BENEFICIARY){
                Toaster.show({
                    message: `Could Not Find Beneficiary 😞`,
                    intent: Intent.DANGER,
                    icon: 'error'
                });
                history.goBack();
                console.log(data);
            }

            if(action === UPDATE_BENEFICIARY){
                this.props.reset();
                console.log(data);
                Toaster.show({
                    message: `Could Not Update Beneficiary 😞`,
                    intent: Intent.DANGER,
                    icon: 'error'
                });
            }

            if(action === DELETE_BENEFICIARY){
                this.props.reset();
                console.log(data);
                Toaster.show({
                    message: `Could Not Delete Beneficiary 😞`,
                    intent: Intent.DANGER,
                    icon: 'error'
                });
            }

            if(action === CAPTURE_BIO){
                Toaster.show({
                    message: "Bio Data Capture Cancelled 😞",
                    timeout: 0,
                    intent: Intent.DANGER,
                    action: {
                        onClick: () => this._onCaptureBio(),
                        icon: 'hand',
                        text: 'Recapture'
                    },
                    icon: 'error' });
            }
        }
    }

    componentWillUnmount(){
        const {socket, enrolmentSocket, authUser} = this.props;
        stopSocketListeners({socket, enrolmentSocket}, {authUser});
    }

    _onCaptureBio(recapture = false){
        const {authUser, socket, enrolmentSocket} = this.props;
        const {beneficiary: {bid}, bioChanged} = this.state;
        console.log('bio', bioChanged, recapture);
        if(bioChanged || recapture){
            emitReCaptureBioData({socket, enrolmentSocket}, authUser, {bid});
        }else{
            emitCaptureBioData(socket, authUser, {bid});
        }
        this.setState({capturingBioData: true});
    }

    _onCancelBioCapture(){
        const {authUser, socket} = this.props;
        emitCancelBioDataCapture(socket, authUser);
        this.setState({capturingBioData: false, confirmCancelCaptureBioData: false});
    }

    _updateBeneficiary(){
        const {beneficiary, bioChanged} = this.state;
        const validating = beneficiary.valid === "invalid";

        let data = new FormData();

        data.append('validating', validating ? 1 : 0);

        if(isFormValid()){
            data.append('bid', beneficiary.bid);
            data.append('surname', beneficiary.surname);
            data.append('forenames', beneficiary.forenames);
            data.append('date_of_birth', beneficiary.date_of_birth);
            data.append('gender', beneficiary.gender);
            data.append('phone_number', beneficiary.phone_number);
            data.append('address', beneficiary.address);
            data.append('identification_id', beneficiary.identification_id);
            data.append('identification_number', beneficiary.identification_number);

            data.append('bank_name', beneficiary.bank_name);
            data.append('bank_branch', beneficiary.bank_branch);
            data.append('account_number', beneficiary.account_number);
            data.append('allowance', beneficiary.allowance);

            data.append('region_id', beneficiary.region_id);
            data.append('district_id', beneficiary.district_id);
            data.append('location_id', beneficiary.location_id);
            data.append('module_id', beneficiary.module_id);
            data.append('rank_id', beneficiary.rank_id);

            data.append('active', beneficiary.status === 'active' ? 1 : 0);
        }

        data.append('can_operate_device', beneficiary.operator ? 1 : 0);
        if(beneficiary.operator){
            data.append('pin', beneficiary.pin);
        }

        data.append('bio', bioChanged ? 1 : 0);
        if(bioChanged){
            const {capturedBio: bio} = this.state;

            data.append('thumb_right_image', bio.thumb_right.encoded);
            data.append('thumb_right_fmd', bio.thumb_right.fmd);

            data.append('thumb_left_image', bio.thumb_left.encoded);
            data.append('thumb_left_fmd', bio.thumb_left.fmd);

            data.append('index_right_image', bio.index_right.encoded);
            data.append('index_right_fmd', bio.index_right.encoded);

            data.append('index_left_image', bio.index_left.encoded);
            data.append('index_left_fmd', bio.index_right.fmd);

            data.append('portrait', bio.portrait.encoded);
            data.append('form', bio.form.encoded);
        }

        this.props.updateBeneficiary(this.state.beneficiary.uuid, data);
        this.setState({confirmUpdate: false});
    }

    _isFormValid(){
        const {beneficiary, capturedBio, bioChanged} = this.state;

        let required = _omit(beneficiary, ['pin', 'operator', 'valid', 'status']);

        if(beneficiary.operator)
            required = {...required, pin: beneficiary.pin};

        if(bioChanged)
            required = {...required,
                thumb_right_image: capturedBio.thumb_right.encoded,
                thumb_right_fmd: capturedBio.thumb_right.fmd,
                thumb_left_image: capturedBio.thumb_left.encoded,
                thumb_left_fmd: capturedBio.thumb_left.fmd,
                index_right_image: capturedBio.index_right.encoded,
                index_right_fmd: capturedBio.index_right.fmd,
                index_left_image: capturedBio.index_left.encoded,
                index_left_fmd: capturedBio.index_left.fmd
        };

        return isFormValid(required);
    }

    _onInputChange(name, value){
        this.setState(() => (
            {beneficiary: {...this.state.beneficiary, [name]: value}}
            )
        );
    }

    _deleteBeneficiary(){
        this.setState({confirmDelete: false});
        this.props.deleteBeneficiary(this.state.beneficiary.uuid);
    }

    _goBack(){
        this.props.history.goBack();
    }

    _cancelAction(){
        const {updatingBeneficiary, deletingBeneficiary} = this.props;
        if(updatingBeneficiary || deletingBeneficiary) return;
        this.setState({alert: false});
    }

    _confirmAction(){
        switch (this.state.alert.action){
            case actionTypes.UPDATE_BENEFICIARY:
                return this._updateBeneficiary();
            case actionTypes.DELETE_BENEFICIARY:
                return this._deleteBeneficiary();
            default:
                return null;
        }
    }

    render(){
        const {loadingBeneficiary, updatingBeneficiary, deletingBeneficiary,
            OPERATION_SUCCESSFUL, authUser, OPERATION_FAILED} = this.props;

        const {bio, beneficiary, beneficiaryBuffer, confirmCancelCaptureBioData, capturingBioData,
            confirmDelete, confirmUpdate, reviewingBioData, bioChanged, userAuthorized} = this.state;

        const disableUpdateButton = !this._isFormValid() || _isEqual(beneficiary, beneficiaryBuffer);

        const editActionAllowed = authUser.root 
            || Can.User(authUser).perform(EDIT, BENEFICIARY, BENEFICIARIES);
        const deleteActionAllowed = authUser.root;

        const disableLocationsSelection = type =>  userAuthorized 
            && _isEqual(type, authUser.role.level.type) 
            && !authUser.root;

        return (
            <div className="wrapper">

                <Unauthorized open={!userAuthorized} history={this.props.history}/>

                <Operating
                    content={"Updating Beneficiary..."}
                    intent={Intent.SUCCESS}
                    on={OPERATION_SUCCESSFUL.data.scheduled 
                        && OPERATION_FAILED.action !== UPDATE_BENEFICIARY}/>

                <CapturingBioAlert 
                    open={capturingBioData}
                    onCancel={() => this.setState({confirmCancelCaptureBioData: true})}/>

                <ConfirmAlert 
                    open={confirmCancelCaptureBioData}
                    intent={Intent.DANGER}
                    onConfirm={this._onCancelBioCapture} 
                    onCancel={() => this.setState({confirmCancelCaptureBioData: false})} />

                <ConfirmAlert 
                    open={confirmDelete}
                    intent={Intent.DANGER}
                    onConfirm={this._deleteBeneficiary} 
                    onCancel={() => this.setState({confirmDelete: false})} />

                <ConfirmAlert 
                    open={confirmUpdate} 
                    onConfirm={this._updateBeneficiary} 
                    onCancel={() => this.setState({confirmUpdate: false})} />

                <div className="toolbar">
                    <Button intent={Intent.DANGER} 
                        onClick={this._goBack}
                        disabled={updatingBeneficiary || reviewingBioData}
                        icon={"undo"} text={'Go Back'}/>
                    <Button 
                        disabled={updatingBeneficiary || reviewingBioData || !editActionAllowed}
                        onClick={() => this._onCaptureBio(bioChanged)}
                        intent={Intent.PRIMARY} icon="hand">{bioChanged ? 'ReCapture' : 'Capture'} Bio Data</Button>
                    <Button
                        disabled={disableUpdateButton || reviewingBioData || !editActionAllowed}
                        loading={updatingBeneficiary}
                        intent={Intent.PRIMARY}
                        onClick={() => this.setState({confirmUpdate: true})}
                        icon="tick" text={'Update'}/>
                </div>

                <div className="content">

                    <div className="bio">
                        <header>
                            <Text>Picture</Text>
                            {/* {bio.portrait && <Button
                                onClick={() => donwloadjs(bio.portrait.path)}
                                className="pt-small pt-minimal" icon="download"/>} */}
                        </header>
                        <div className="picture">
                            <div>
                                {bio.portrait && <img src={`${bio.portrait.path}`} alt=""/>}
                            </div>
                        </div>
                        <div className="bio-data">
                            <header>
                                <Text>Fingerprints (4)</Text>

                            </header>
                            <section>
                                <div className="fingerprint">
                                    <div className="header">
                                        <span>Thumb Right</span>
                                    </div>
                                    <div className="img">
                                        {bio.thumbRight
                                            && <img src={`${bio.thumbRight.path}`} alt=""/>}
                                    </div>
                                </div>
                                <div className="fingerprint">
                                    <div className="header">
                                        <span>Thumb Left</span>
                                    </div>
                                    <div className="img">
                                        {bio.thumbLeft
                                            && <img src={`${bio.thumbLeft.path}`} alt=""/>}
                                    </div>
                                </div>
                                <div className="fingerprint">
                                    <div className="header">
                                        <span>Index Right</span>
                                    </div>
                                    <div className="img">
                                        {bio.indexRight
                                            && <img src={`${bio.indexRight.path}`} alt=""/>}
                                    </div>
                                </div>
                                <div className="fingerprint">
                                    <div className="header">
                                        <span>Index Left</span>
                                    </div>
                                    <div className="img">
                                        {bio.indexLeft
                                            && <img src={`${bio.indexLeft.path}`} alt=""/>}
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>

                    <div className="info-wrapper">
                        <header>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <Icon intent={Intent.PRIMARY} icon={'mugshot'}/>
                                <strong
                                    className={`${loadingBeneficiary ? 'pt-skeleton' : ''}`}
                                    style={{marginLeft: 10}}>{this.state.beneficiaryBuffer.bid}</strong>
                            </div>
                            <label className="pt-control pt-switch pt-align-right device-operator-toggle">
                                <span style={{marginRight: 10}}><Icon icon={'mobile-phone'}/></span>
                                <input
                                    checked={this.state.beneficiary.operator || ''}
                                    onChange={() => this._onInputChange('operator', !this.state.beneficiary.operator)}
                                    type="checkbox" />
                                <span className="pt-control-indicator"/>
                            </label>
                            <ButtonGroup className="pt-small">
                                {
                                    this.state.beneficiary.status === "inactive"
                                        ? (
                                            <Button
                                                disabled={!editActionAllowed}
                                                intent={Intent.SUCCESS}
                                                onClick={() => this._onInputChange('status', 'active')}
                                                icon="person">Activate</Button>
                                        )
                                        : (
                                            <Button
                                                disabled={!editActionAllowed}
                                                intent={Intent.WARNING}
                                                onClick={() => this._onInputChange('status', 'inactive')}
                                                icon="blocked-person">Deactivate</Button>
                                        )
                                }
                                {deleteActionAllowed && (
                                    <Button
                                        intent={Intent.DANGER}
                                        disabled={updatingBeneficiary || reviewingBioData}
                                        loading={deletingBeneficiary}
                                        onClick={() => this.setState({confirmDelete: true})}
                                        icon="trash">Delete</Button>
                                )}
                            </ButtonGroup>
                        </header>
                        <div className="info">
                            <section className="bms-input-group">
                                <header>
                                    <Text>Personal Information</Text>
                                </header>
                                <section className="section">
                                    <section>
                                        <label className="pt-label">
                                            Surname
                                            <input
                                                value={this.state.beneficiary.surname || ''}
                                                className={`pt-input pt-fill ${loadingBeneficiary && 'pt-skeleton'}`}
                                                name={'surname'}
                                                onChange={({target: {name, value}}) => this._onInputChange(name, value)}
                                                type="text" dir="auto" />
                                        </label>
                                        <label className="pt-label">
                                            Date Of Birth
                                            <MaskedInput
                                                mask={
                                                    [
                                                        /[1-3]/, /[0-9]/,
                                                        "/", /\d/, /\d/,
                                                        "/", /[1-2]/, /\d/, /\d/, /\d/
                                                    ]
                                                }
                                                className={`pt-input pt-fill ${loadingBeneficiary && 'pt-skeleton'}`}
                                                value={this.state.beneficiary.date_of_birth || ''}
                                                onChange={({target: {name, value}}) => this._onInputChange(name, value)}
                                                name={'date_of_birth'}
                                                guide={true}
                                            />
                                        </label>
                                        <label className="pt-label">
                                            Phone Number
                                            <input
                                                value={this.state.beneficiary.phone_number || ''}
                                                name={'phone_number'}
                                                onChange={({target: {name, value}}) => this._onInputChange(name, value)}
                                                className={`pt-input pt-fill ${loadingBeneficiary && 'pt-skeleton'}`}
                                                type="text" dir="auto" />
                                        </label>
                                        <label className="pt-label">
                                            ID Type
                                            <IDTypes
                                                disabled={loadingBeneficiary}
                                                small={false}
                                                value={this.state.beneficiary.identification_id || ''}
                                                onChange={({value}) => this._onInputChange('identification_id', value)}/>
                                        </label>
                                    </section>
                                    <section>
                                        <label className="pt-label">
                                            Forenames
                                            <input
                                                value={this.state.beneficiary.forenames || ''}
                                                name={'forenames'}
                                                onChange={({target: {name, value}}) => this._onInputChange(name, value)}
                                                className={`pt-input pt-fill ${loadingBeneficiary && 'pt-skeleton'}`}
                                                type="text" dir="auto" />
                                        </label>
                                        <RadioGroup
                                            onChange={({currentTarget: {name, value}}) => this._onInputChange(name, value)}
                                            selectedValue={this.state.beneficiary.gender || ''}
                                            className={`radio-group-label`}
                                            inline
                                            name={'gender'}
                                            label="Gender"
                                        >
                                            <Radio
                                                className={loadingBeneficiary ? 'pt-skeleton' : ''}
                                                name={'gender'} label="Male" value="1" />
                                            <Radio
                                                className={loadingBeneficiary ? 'pt-skeleton' : ''}
                                                name={'gender'} label="Female" value="0" />
                                        </RadioGroup>
                                        <label className="pt-label">
                                            Address
                                            <input
                                                value={this.state.beneficiary.address || ''}
                                                name={'address'}
                                                onChange={({target: {name, value}}) => this._onInputChange(name, value)}
                                                className={`pt-input pt-fill ${loadingBeneficiary && 'pt-skeleton'}`}
                                                type="text" dir="auto" />
                                        </label>
                                        <label className="pt-label">
                                            ID Number
                                            <input
                                                value={this.state.beneficiary.identification_number || ''}
                                                name={'identification_number'}
                                                onChange={({target: {name, value}}) => this._onInputChange(name, value)}
                                                className={`pt-input pt-fill ${loadingBeneficiary && 'pt-skeleton'}`}
                                                type="text" dir="auto" />
                                        </label>
                                    </section>
                                </section>
                            </section>
                            <section className="bms-input-group">
                                <header>
                                    <Text>Bank Information</Text>
                                </header>
                                <section className="section">
                                    <section>
                                        <label className="pt-label">
                                            Name
                                            <input
                                                value={this.state.beneficiary.bank_name || ''}
                                                name={'bank_name'}
                                                onChange={({target: {name, value}}) => this._onInputChange(name, value)}
                                                className={`pt-input pt-fill ${loadingBeneficiary && 'pt-skeleton'}`}
                                                type="text" dir="auto" />
                                        </label>
                                        <label className="pt-label">
                                            Account Number
                                            <input
                                                value={this.state.beneficiary.account_number || ''}
                                                name={'account_number'}
                                                onChange={({target: {name, value}}) => this._onInputChange(name, value)}
                                                className={`pt-input pt-fill ${loadingBeneficiary && 'pt-skeleton'}`}
                                                type="text" dir="auto" />
                                        </label>
                                    </section>
                                    <section>
                                        <label className="pt-label">
                                            Branch
                                            <input
                                                value={this.state.beneficiary.bank_branch || ''}
                                                name={'bank_branch'}
                                                onChange={({target: {name, value}}) => this._onInputChange(name, value)}
                                                className={`pt-input pt-fill ${loadingBeneficiary && 'pt-skeleton'}`}
                                                type="text" dir="auto" />
                                        </label>
                                        <label className="pt-label">
                                            Allowance
                                            <span className="pt-text-muted">(&#8373;)</span>
                                            <input
                                                value={this.state.beneficiary.allowance || ''}
                                                name={'allowance'}
                                                onChange={({target: {name, value}}) => this._onInputChange(name, value)}
                                                className={`pt-input pt-fill ${loadingBeneficiary && 'pt-skeleton'}`}
                                                type="text" dir="auto" />
                                        </label>
                                    </section>
                                </section>
                            </section>
                            <section className="bms-input-group">
                                <header>
                                    <Text>Official Information</Text>
                                </header>
                                <section className="section">
                                    <section>
                                        <label className="pt-label">
                                            Region
                                            {/*<span className="pt-text-muted">(required)</span>*/}
                                            <Regions
                                                small={false}
                                                dependent={true}
                                                disabled={
                                                    loadingBeneficiary 
                                                    || disableLocationsSelection('region')
                                                    || disableLocationsSelection('district')
                                                    || disableLocationsSelection('location')
                                                }
                                                value={this.state.beneficiary.region_id || ''}
                                                onChange={({value}) => this._onInputChange('region_id', value)}/>
                                        </label>
                                        <label className="pt-label">
                                            District
                                            {/*<span className="pt-text-muted">(required)</span>*/}
                                            <Districts
                                                small={false}
                                                dependent={true}
                                                disabled={
                                                    loadingBeneficiary 
                                                    || disableLocationsSelection('district')
                                                    || disableLocationsSelection('location')
                                                }
                                                value={this.state.beneficiary.district_id || ''}
                                                onChange={({value}) => this._onInputChange('district_id', value)}/>
                                        </label>
                                        <label className="pt-label">
                                            Location
                                            {/*<span className="pt-text-muted">(required)</span>*/}
                                            <Locations
                                                dependent={true}
                                                small={false}
                                                disabled={loadingBeneficiary || disableLocationsSelection('location')}
                                                value={this.state.beneficiary.location_id || ''}
                                                onChange={({value}) => this._onInputChange('location_id', value)}/>
                                        </label>
                                    </section>
                                    <section>
                                        <label className="pt-label">
                                            Module
                                            {/*<span className="pt-text-muted">(required)</span>*/}
                                            <Modules
                                                small={false}
                                                disabled={loadingBeneficiary}
                                                value={this.state.beneficiary.module_id || ''}
                                                onChange={({value}) => this._onInputChange('module_id', value)}/>
                                        </label>
                                        <label className="pt-label">
                                            Rank
                                            {/*<span className="pt-text-muted">(required)</span>*/}
                                            <Ranks
                                                small={false}
                                                disabled={loadingBeneficiary}
                                                value={this.state.beneficiary.rank_id || ''}
                                                onChange={({value}) => this._onInputChange('rank_id', value)}/>
                                        </label>
                                        {this.state.beneficiary.operator ? (
                                            <label className="pt-label">
                                                PIN
                                                <span className="pt-text-muted">(Used To Login With Clocking Device)</span>
                                                <MaskedInput
                                                    mask={[/\d/, /\d/, /\d/, /\d/]}
                                                    className={`pt-input pt-fill ${loadingBeneficiary && 'pt-skeleton'}`}
                                                    value={this.state.beneficiary.pin || ''}
                                                    onChange={({target: {name, value}}) => this._onInputChange(name, value)}
                                                    name={'pin'}
                                                    guide={true}
                                                />
                                            </label>
                                        ) : null}
                                    </section>
                                </section>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    static propTypes = {
        authUser: PropTypes.object.isRequired,
        socket: PropTypes.object.isRequired,
        enrolmentSocket: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        beneficiaryBio: PropTypes.object.isRequired,
        OPERATION_SUCCESSFUL: PropTypes.object.isRequired,
        OPERATION_FAILED: PropTypes.object.isRequired,

        loadingBeneficiary: PropTypes.bool.isRequired,
        updatingBeneficiary: PropTypes.bool.isRequired,
        deletingBeneficiary: PropTypes.bool.isRequired,

        beneficiary: PropTypes.object.isRequired,

        loadBeneficiary: PropTypes.func.isRequired,
        updateBeneficiary: PropTypes.func.isRequired,
        deleteBeneficiary: PropTypes.func.isRequired,
        onBioDataCaptured: PropTypes.func.isRequired,
        onBioDataCaptureCancelled: PropTypes.func.isRequired,
        onBeneficiaryUpdated: PropTypes.func.isRequired,
        onBeneficiaryUpdateFailed: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
    };
}

const mapStateToProps = (
    {OPERATION_FAILED, OPERATION_SUCCESSFUL, authUser, beneficiaryBio, socket, loadingBeneficiary,
        updatingBeneficiary, deletingBeneficiary, beneficiary, enrolmentSocket}) => (
        {OPERATION_FAILED, OPERATION_SUCCESSFUL, authUser, beneficiaryBio, socket, loadingBeneficiary,
            updatingBeneficiary, deletingBeneficiary, beneficiary, enrolmentSocket});

const mapDispatchToProps = dispatch => bindActionCreators({
    loadBeneficiary, updateBeneficiary, deleteBeneficiary, onBioDataCaptured, onBioDataCaptureCancelled,
    onBeneficiaryUpdated, onBeneficiaryUpdateFailed, reset
}, dispatch);



export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Beneficiary));