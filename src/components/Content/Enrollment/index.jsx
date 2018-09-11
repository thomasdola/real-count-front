import React from 'react';
import {Button, ButtonGroup, Icon, Intent, Radio, RadioGroup, Text} from '@blueprintjs/core';
import IDTypes from "../../Common/filterRows/IDTypes";
import Regions from "../../Common/filterRows/Regions";
import Districts from "../../Common/filterRows/Districts";
import Locations from "../../Common/filterRows/Locations";
import Modules from "../../Common/filterRows/Modules";
import Ranks from "../../Common/filterRows/Ranks";
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {CheckBID} from './Modals';
import MaskedInput from "react-text-mask";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {enrol, invalidateBid} from "../../../actions/enrolmentActions";
import {reset} from "../../../actions/operationActions";
import _forOwn from 'lodash/forOwn';
import _every from 'lodash/every';
import {base64ToDataURI, CapturingBioAlert, ConfirmAlert} from '../Beneficiary';
import _isEqual from 'lodash/isEqual';
import _isArray from 'lodash/isArray';

import "./index.css";
import Toaster from "../../Common/Toaster";
import {CAPTURE_BIO, ENROL_BENEFICIARY} from "../../../actions/types";
import {Operating} from "../Backups";
import {
    emitCancelBioDataCapture,
    emitCaptureBioData,
    emitReCaptureBioData,
    initSocketListeners,
    stopSocketListeners,
    onBeneficiaryEnrolFailed,
    onBeneficiaryEnrolled,
    onBioDataCaptured,
    onBioDataCaptureCancelled
} from "../../../actions/socket/enrolmentActions";

export function isFormValid(form){
    let valids = [];
    _forOwn(form, (value, key) => {
        if(typeof(value) === "number"){
            if(value){
                valids = [...valids, {[key]: value, valid: true}]
            }else{
                valids = [...valids, {[key]: value, valid: false}]
            }
        }else if(typeof(value) === "string"){
            if(value.trim().length > 0){
                valids = [...valids, {[key]: value, valid: true}]
            }else{
                valids = [...valids, {[key]: value, valid: false}]
            }
        }else if(_isArray(value)){
            if(value.length > 0){
                valids = [...valids, {[key]: value, valid: true}]
            }else{
                valids = [...valids, {[key]: value, valid: false}]
            }
        }else{
            valids = [...valids, {[key]: value, valid: false}]
        }
    });

    console.log('form validation', valids);

    return _every(valids, 'valid');
}



class BeneficiaryEnrolment extends React.Component {

    constructor(props){
        super(props);

        this._enrolBeneficiary = this._enrolBeneficiary.bind(this);
        this._onInputChange = this._onInputChange.bind(this);
        this._onCaptureBio = this._onCaptureBio.bind(this);
        this._onCancelBioCapture = this._onCancelBioCapture.bind(this);
    }

    state = {
        beneficiary: {
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

            region: "",
            district: "",
            location: "",
            module: "",
            rank: ""
        },
        bio: {
            indexRight: { path: "" },
            indexLeft: { path: "" },
            thumbRight: { path: "" },
            thumbLeft: { path: "" },
            portrait: { path: "" },
            form: { path: "" }
        },
        capturedBio: {
            thumb_left: {fmd: '', encoded: ''},
            thumb_right: {fmd: '', encoded: ''},
            index_left: {fmd: '', encoded: ''},
            index_right: {fmd: '', encoded: ''},
            portrait: {encoded: ''},
            form: {encoded: ''}
        },
        capturedBioBuffer: {
            thumb_left: {fmd: '', encoded: ''},
            thumb_right: {fmd: '', encoded: ''},
            index_left: {fmd: '', encoded: ''},
            index_right: {fmd: '', encoded: ''},
            portrait: {encoded: ''},
            form: {encoded: ''}
        },
        confirmCancelCaptureBioData: false,
        bioDataCaptured: false,
        capturingBioData: false,
        reviewingBioData: false,
    };

    componentDidMount(){
        const {socket, enrolmentSocket, authUser, onBioDataCaptured, onBioDataCaptureCancelled,
            onBeneficiaryEnrolFailed, onBeneficiaryEnrolled} = this.props;
        initSocketListeners({socket, enrolmentSocket}, {
            authUser, onBeneficiaryEnrolled,
            onBioDataCaptured,
            onBioDataCaptureCancelled,
            onBeneficiaryEnrolFailed
        });
    }

    static getDerivedStateFromProps(nextProps, prevState){
        const {allowToEnroll: {bid, official}} = nextProps;
        const {beneficiary: {region, district, location, module, rank}, beneficiary} = prevState;

        if(_isEqual(official, Object.assign({}, {region, district, location, module, rank}))
            && _isEqual(bid, beneficiary.bid))
            return null;

        return {
            beneficiary: {
                ...beneficiary,
                bid,
                region: official.region,
                district: official.district,
                location: official.location,
                module: official.module,
                rank: official.rank
            }
        };
    }

    componentDidUpdate(prevProps, prevState){
        const {OPERATION_SUCCESSFUL: OLD_OPERATION_SUCCESSFUL, OPERATION_FAILED: OLD_OPERATION_FAILED} = prevProps;
        const {OPERATION_SUCCESSFUL, OPERATION_FAILED, history, invalidateBid} = this.props;

        if(!_isEqual(OLD_OPERATION_SUCCESSFUL, OPERATION_SUCCESSFUL)){
            const {data: {beneficiary, scheduled}, data, action} = OPERATION_SUCCESSFUL;

            if(action === ENROL_BENEFICIARY && !scheduled){
                invalidateBid();
                Toaster.show({
                    message: `Beneficiary Enrolled Successfully 😃`,
                    intent: Intent.SUCCESS,
                    timeout: 0,
                    action: {
                        onClick: () => history.push(`/beneficiaries/${beneficiary}`),
                        icon: 'link',
                        text: 'view'
                    },
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
                        bioDataCaptured: true,
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
            if(OPERATION_FAILED.action === ENROL_BENEFICIARY){
                this.props.reset();
                console.log(OPERATION_FAILED.data);
                Toaster.show({
                    message: `Could Not Enrol Beneficiary 😞`,
                    intent: Intent.DANGER,
                    icon: 'error'
                });
            }

            if(OPERATION_FAILED.action === CAPTURE_BIO){
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
        this.props.invalidateBid();
    }

    _enrolBeneficiary(){
        const {beneficiary, bioDataCaptured} = this.state;

        let data = new FormData();

        if(isFormValid(beneficiary)){

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

            data.append('region_id', beneficiary.region);
            data.append('district_id', beneficiary.district);
            data.append('location_id', beneficiary.location);
            data.append('module_id', beneficiary.module);
            data.append('rank_id', beneficiary.rank);
        }

        data.append('bio', bioDataCaptured);

        if(bioDataCaptured){
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

        this.props.enrol(data);
    }

    _onCaptureBio(recapture = false){
        console.log('capture bio');
        const {authUser, socket, enrolmentSocket} = this.props;
        const {beneficiary: {bid}, bioDataCaptured} = this.state;
        if(bioDataCaptured || recapture){
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

    _onInputChange(name, value){
        this.setState(() => (
                {beneficiary: {...this.state.beneficiary, [name]: value}}
            )
        );
    }

    render(){
        const {beneficiary, capturingBioData, confirmCancelCaptureBioData, bio, bioDataCaptured} = this.state;
        const {allowToEnroll: {bid}, enrollingBeneficiary, OPERATION_SUCCESSFUL, OPERATION_FAILED} = this.props;

        const disabledSaveButton = !isFormValid(beneficiary);

        return (
            <div className="wrapper">

                <Operating
                    content={"Saving Beneficiary... 😃"}
                    intent={Intent.NONE}
                    on={OPERATION_SUCCESSFUL.data.scheduled 
                        && OPERATION_FAILED.action !== ENROL_BENEFICIARY}/>

                <CheckBID />

                <CapturingBioAlert 
                    open={capturingBioData}
                    onCancel={() => this.setState({confirmCancelCaptureBioData: true})}/>

                <ConfirmAlert 
                    open={confirmCancelCaptureBioData}
                    intent={Intent.DANGER}
                    onConfirm={this._onCancelBioCapture} 
                    onCancel={() => this.setState({confirmCancelCaptureBioData: false})} />

                <div className="toolbar">
                    <Button
                        intent={Intent.DANGER}
                        onClick={() => this.props.history.goBack()}
                        className="" icon="undo">Cancel</Button>
                    <Button
                        intent={Intent.PRIMARY}
                        onClick={() => this._onCaptureBio()}
                        className="" icon="hand">{bioDataCaptured ? 'ReCapture' : 'Capture'} Bio</Button>
                    <ButtonGroup>
                        <Button
                            loading={enrollingBeneficiary}
                            disabled={disabledSaveButton}
                            intent={Intent.PRIMARY}
                            onClick={this._enrolBeneficiary}
                            icon="tick">Save</Button>
                    </ButtonGroup>
                </div>
                <div className="content">
                    <div className="bio">
                        <header>
                            <Text>Picture</Text>
                        </header>
                        <div className="picture">
                            <div>
                                <img src="" alt=""/>
                            </div>
                        </div>
                        <div className="bio-data">
                            <header>
                                <Text>Fingerprints</Text>
                            </header>
                            <section>
                                <div className="fingerprint">
                                    <div className="header">
                                        <span>Thumb Right</span>
                                    </div>
                                    <div className="img">
                                        {bio.thumbRight.path
                                        && <img src={`${bio.thumbRight.path}`} alt=""/>}
                                    </div>
                                </div>
                                <div className="fingerprint">
                                    <div className="header">
                                        <span>Thumb Left</span>
                                    </div>
                                    <div className="img">
                                        {bio.thumbLeft.path
                                        && <img src={`${bio.thumbLeft.path}`} alt=""/>}
                                    </div>
                                </div>
                                <div className="fingerprint">
                                    <div className="header">
                                        <span>Index Right</span>
                                    </div>
                                    <div className="img">
                                        {bio.indexRight.path
                                        && <img src={`${bio.indexRight.path}`} alt=""/>}
                                    </div>
                                </div>
                                <div className="fingerprint">
                                    <div className="header">
                                        <span>Index Left</span>
                                    </div>
                                    <div className="img">
                                        {bio.indexLeft.path
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
                                    style={{marginLeft: 10}}>{bid}</strong>
                            </div>
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
                                                name={'surname'}
                                                value={beneficiary.surname || ''}
                                                onChange={({target: {name, value}}) => this._onInputChange(name, value)}
                                                className="pt-input pt-fill" type="text" dir="auto" />
                                        </label>
                                        <label className="pt-label">
                                            Date Of Birth
                                            <MaskedInput
                                                mask={
                                                    [
                                                        /[1-3]/, /[0-9]/,
                                                        "/", /[0-1]/, /[0-2]/,
                                                        "/", /[1-2]/, /\d/, /\d/, /\d/
                                                    ]
                                                }
                                                className="pt-input pt-fill"
                                                value={beneficiary.date_of_birth || ''}
                                                onChange={({target: {name, value}}) => this._onInputChange(name, value)}
                                                name={'date_of_birth'}
                                                guide={true}
                                            />
                                        </label>
                                        <label className="pt-label">
                                            Phone Number
                                            <input
                                                name={'phone_number'}
                                                value={beneficiary.phone_number || ''}
                                                onChange={({target: {name, value}}) => this._onInputChange(name, value)}
                                                className="pt-input pt-fill" type="text" dir="auto" />
                                        </label>
                                        <label className="pt-label">
                                            ID Type
                                            <IDTypes
                                                small={false}
                                                value={this.state.beneficiary.identification_id || ''}
                                                onChange={({value}) => this._onInputChange('identification_id', value)}/>
                                        </label>
                                    </section>
                                    <section>
                                        <label className="pt-label">
                                            Forenames
                                            <input
                                                name={'forenames'}
                                                value={beneficiary.forenames || ''}
                                                onChange={({target: {name, value}}) => this._onInputChange(name, value)}
                                                className="pt-input pt-fill" type="text" dir="auto" />
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
                                                name={'gender'} label="Male" value="male" />
                                            <Radio
                                                name={'gender'} label="Female" value="female" />
                                        </RadioGroup>
                                        <label className="pt-label">
                                            Address
                                            <input
                                                name={'address'}
                                                value={beneficiary.address || ''}
                                                onChange={({target: {name, value}}) => this._onInputChange(name, value)}
                                                className="pt-input pt-fill" type="text" dir="auto" />
                                        </label>
                                        <label className="pt-label">
                                            ID Number
                                            <input
                                                name={'identification_number'}
                                                value={beneficiary.identification_number || ''}
                                                onChange={({target: {name, value}}) => this._onInputChange(name, value)}
                                                className="pt-input pt-fill" type="text" dir="auto" />
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
                                                name={'bank_name'}
                                                value={beneficiary.bank_name || ''}
                                                onChange={({target: {name, value}}) => this._onInputChange(name, value)}
                                                className="pt-input pt-fill" type="text" dir="auto" />
                                        </label>
                                        <label className="pt-label">
                                            Account Number
                                            <input
                                                name={'account_number'}
                                                value={beneficiary.account_number || ''}
                                                onChange={({target: {name, value}}) => this._onInputChange(name, value)}
                                                className="pt-input pt-fill" type="text" dir="auto" />
                                        </label>
                                    </section>
                                    <section>
                                        <label className="pt-label">
                                            Branch
                                            <input
                                                name={'bank_branch'}
                                                value={beneficiary.bank_branch || ''}
                                                onChange={({target: {name, value}}) => this._onInputChange(name, value)}
                                                className="pt-input pt-fill" type="text" dir="auto" />
                                        </label>
                                        <label className="pt-label">
                                            Allowance
                                            <span className="pt-text-muted">(&#8373;)</span>
                                            <input
                                                name={'allowance'}
                                                value={beneficiary.allowance || ''}
                                                onChange={({target: {name, value}}) => this._onInputChange(name, value)}
                                                className="pt-input pt-fill" type="text" dir="auto" />
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
                                            <Regions
                                                disabled
                                                small={false}
                                                dependent={true}
                                                value={this.state.beneficiary.region || ''}
                                                onChange={({value}) => this._onInputChange('region', value)}/>
                                        </label>
                                        <label className="pt-label">
                                            District
                                            <Districts
                                                disabled
                                                small={false}
                                                dependent={true}
                                                value={this.state.beneficiary.district || ''}
                                                onChange={({value}) => this._onInputChange('district', value)}/>
                                        </label>
                                        <label className="pt-label">
                                            Location
                                            <Locations
                                                disabled
                                                dependent={true}
                                                small={false}
                                                value={this.state.beneficiary.location || ''}
                                                onChange={({value}) => this._onInputChange('location', value)}/>
                                        </label>
                                    </section>
                                    <section>
                                        <label className="pt-label">
                                            Module
                                            <Modules
                                                disabled
                                                small={false}
                                                value={this.state.beneficiary.module || ''}
                                                onChange={({value}) => this._onInputChange('module', value)}/>
                                        </label>
                                        <label className="pt-label">
                                            Rank
                                            <Ranks
                                                disabled
                                                small={false}
                                                value={this.state.beneficiary.rank || ''}
                                                onChange={({value}) => this._onInputChange('rank', value)}/>
                                        </label>
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
        allowToEnroll: PropTypes.object.isRequired,
        OPERATION_SUCCESSFUL: PropTypes.object.isRequired,
        OPERATION_FAILED: PropTypes.object.isRequired,

        enrollingBeneficiary: PropTypes.bool.isRequired,

        enrolledBeneficiary: PropTypes.string.isRequired,

        enrol: PropTypes.func.isRequired,
        invalidateBid: PropTypes.func.isRequired,
        onBioDataCaptured: PropTypes.func.isRequired,
        onBioDataCaptureCancelled: PropTypes.func.isRequired,
        onBeneficiaryEnrolled: PropTypes.func.isRequired,
        onBeneficiaryEnrolFailed: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
    };
}

const mapStateToProps = (
    {OPERATION_FAILED, OPERATION_SUCCESSFUL, authUser, socket, enrolmentSocket, allowToEnroll, enrolledBeneficiary,
        enrollingBeneficiary}) => (
    {OPERATION_FAILED, OPERATION_SUCCESSFUL, authUser, socket, enrolmentSocket, allowToEnroll, enrolledBeneficiary,
        enrollingBeneficiary});
const mapDispatchToProps = dispatch => bindActionCreators({ reset,
    enrol, invalidateBid, onBioDataCaptured, onBioDataCaptureCancelled, onBeneficiaryEnrolled, onBeneficiaryEnrolFailed
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BeneficiaryEnrolment));