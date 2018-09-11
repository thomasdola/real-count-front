import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {generate} from '../../../../actions/reportActions';
import {Radio, RadioGroup, Button, Text} from '@blueprintjs/core';
import * as serverEntities from '../../../../helpers/server/entities';
import {isFormValid} from "../../Enrollment";
import _isEqual from 'lodash/isEqual';
import Levels from './Levels';

class Count extends React.Component{
    constructor(props){
        super(props);

        this._onGenerateReport = this._onGenerateReport.bind(this);
        this._handleLevelIdChange = this._handleLevelIdChange.bind(this);
    }

    state = {
        gender: 2,
        format: 'xlsx',
        filename: '',

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
        const newLevelType = root ? levelType : Count.levelFromType(level.type);

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
        let data = new FormData();
        data.append('type', serverEntities.BENEFICIARIES_COUNT);

        data.append('format', this.state.format);
        data.append('gender', this.state.gender);
        data.append('filename', this.state.filename);

        data.append('level', this.state.levelType);
        data.append(`${this._levelType(this.state.levelType)}_id`, this.state.levelID);
        this.props.generate(data);
    }

    _isFormValid(){
        const {levelType, levelID, gender, format, filename, region, district, location} = this.state;
        let required = {levelID, levelType, gender, format, filename};

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
        const {authUser} = this.props;

        const disableGenerateButton = !this._isFormValid();

        return (
            <div className={`form__wrapper`}>
                <header className="form__header">
                    <Text>Beneficiaries Allowance</Text>
                    <Button
                        disabled={disableGenerateButton}
                        onClick={this._onGenerateReport}
                        loading={this.props.generatingReport}
                        className="pt-small pt-intent-primary" text={'generate'}/>
                </header>
                <div className="form__section">
                    
                    <Levels 
                        user={authUser}
                        handleLevelIdChange={this._handleLevelIdChange}
                        handleLevelTypeChange={levelType => this.setState({levelType})}
                        region={this.state.region}
                        district={this.state.district}
                        location={this.state.location}
                        levelType={this.state.levelType}
                        levelId={this.state.levelID}
                        />

                    <RadioGroup
                        onChange={({currentTarget: {value}}) => this.setState({gender: value})}
                        selectedValue={this.state.gender || ''}
                        className="radio-group-label"
                        inline
                        name={'gender'}
                        label="Gender"
                    >
                        <Radio name={'gender'} label="Any" value="2" />
                        <Radio name={'gender'} label="Male" value="1" />
                        <Radio name={'gender'} label="Female" value="0" />
                    </RadioGroup>

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

export default connect(mapStateToProps, mapDispatchToProps)(Count);