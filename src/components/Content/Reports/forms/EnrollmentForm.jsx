import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {generate} from '../../../../actions/reportActions';
import {Radio, RadioGroup, Button, Text} from '@blueprintjs/core';
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';
import DateRange from "../../../Common/filterRows/DateRange";
import * as serverEntities from '../../../../helpers/server/entities';
import {isFormValid} from "../../Enrollment";
import format from 'date-fns/format';
import Levels from './Levels';
import _isEqual from 'lodash/isEqual';


class EnrollmentForm extends React.Component{
    constructor(props){
        super(props);

        this._onGenerateReport = this._onGenerateReport.bind(this);
        this._handleLevelIdChange = this._handleLevelIdChange.bind(this);
    }

    state = {
        format: 'xlsx',
        filename: '',
        startDate: null,
        endDate: null,

        levelType: "1",
        levelID: "1",
        region: '',
        district: '',
        location: ''
    };

    static getDerivedStateFromProps(nextProps, prevState){
        const {authUser: {root, role: {level, scope}}} = nextProps;
        const {levelType, levelID, region, district, location} = prevState;

        const regionId = !root ? scope.region_id : region;
        const districtId = !root ? scope.district_id : district;
        const locationId = !root ? scope.location_id : location;
        const levelId = root 
            ? levelID 
            : (_isEqual(level.type, 'country') 
                ? 1 
                : (_isEqual(level.type, 'region') 
                    ? scope.region_id 
                    : (_isEqual(level.type, 'district') 
                        ? scope.district_id 
                        : (_isEqual(level.type, 'location') 
                            ? scope.location_id 
                            : 1)
                        )
                    )
                );
        const newLevelType = root ? levelType : EnrollmentForm.levelFromType(level.type);

        if(_isEqual(regionId, region) && _isEqual(districtId, district) 
            && _isEqual(locationId, location) && _isEqual(levelId, levelID) && _isEqual(levelType, newLevelType))
            return null;

        return {
            region: regionId, district: districtId, location: locationId, levelID: levelId, levelType: newLevelType
        };
    }

    static levelFromType(v){
        if(v === "country") return "1";
        if(v === "region") return "2";
        if(v === "district") return "3";
        if(v === "location") return "4";
    }

    _onGenerateReport(){
        const {format: fileFormat, filename, startDate, endDate, levelType, levelID} = this.state;
        const fromDate = format(startDate, 'X');
        const toDate = format(endDate, 'X');

        let data = new FormData();
        data.append('type', serverEntities.ENROLLMENT_FORMS);
        data.append('format', fileFormat);
        data.append('filename', filename);
        data.append('start', fromDate);
        data.append('end', toDate);

        data.append('level', this.state.levelType);
        data.append(`${this._levelType(levelType)}_id`, levelID);

        this.props.generate(data);
    }

    _isFormValid(){
        const {levelType, levelID, format: fileFormat, filename, region, district, location, startDate, endDate} = this.state;
        let required = {levelID, levelType, format: fileFormat, filename,
            startDate: format(startDate, 'X'), endDate: format(endDate, 'X')};

        if(levelType === "2")
            required = {...required, region};

        if(levelType === "3")
            required = {...required, region, district};

        if(levelType === "4")
            required = {...required, region, district, location};

        return isFormValid(required);
    }

    _handleLevelIdChange(levelType, {label, value}){
        console.log(label, value);
        this.setState({[label]:value});
        if(levelType === this.state.levelType){
            this.setState({levelID: value});
        }
    }

    _levelType(v){
        if(v === "1") return "country";
        if(v === "2") return "region";
        if(v === "3") return "district";
        if(v === "4") return "location";
    }

    render(){

        const disableGenerateButton = !this._isFormValid();

        return (
            <div className={`form__wrapper`}>
                <header className="form__header">
                    <Text>Beneficiaries Enrollment Forms</Text>
                    <Button
                        disabled={disableGenerateButton}
                        onClick={this._onGenerateReport}
                        loading={this.props.generatingReport}
                        className="pt-small pt-intent-primary" text={'generate'}/>
                </header>
                <div className="form__section">
                    
                    <Levels 
                        user={this.props.authUser}
                        handleLevelIdChange={this._handleLevelIdChange}
                        handleLevelTypeChange={levelType => this.setState({levelType})}
                        region={this.state.region}
                        district={this.state.district}
                        location={this.state.location}
                        levelType={this.state.levelType}
                        levelId={this.state.levelID}
                        />

                    <label className="pt-label">
                        DateRange
                        <DateRange
                            to={this.state.endDate}
                            from={this.state.startDate}
                            onChange={({from, to}) => this.setState({startDate: from, endDate: to})}/>
                    </label>

                    <RadioGroup
                        selectedValue={this.state.format || ''}
                        className="radio-group-label"
                        onChange={({target: {value}}) => this.setState({format: value})}
                        inline
                        readonly
                        name={'format'}
                        label="Format"
                    >
                        <Radio name={'format'} value={'xlsx'} label="XLSX"/>
                        <Radio name={'format'} value={'pdf'} label="PDF"/>
                    </RadioGroup>
                    <label className="pt-label">
                        Filename
                        <input
                            value={this.state.filename || ''}
                            onChange={({target: {value}}) => this.setState({filename: value})}
                            className="pt-input pt-fill" type="text" dir="auto" />
                    </label>
                </div>
            </div>
        );
    }

    static propTypes = {
        authUser: PropTypes.object.isRequired,
        generate: PropTypes.func.isRequired,
        generatingReport: PropTypes.bool.isRequired,
    };
}

const mapStateToProps = ({authUser, generatingReport}) => ({authUser, generatingReport});
const mapDispatchToProps = dispatch => bindActionCreators({generate}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EnrollmentForm);