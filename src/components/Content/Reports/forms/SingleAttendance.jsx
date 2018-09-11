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
import format from "date-fns/format";

class SingleAttendance extends React.Component{
    static propTypes = {
        generate: PropTypes.func.isRequired,
        generatingReport: PropTypes.bool.isRequired,
    };

    state = {
        filename: '',
        format: 'pdf',
        bid: '',
        startDate: null,
        endDate: null
    };

    constructor(props){
        super(props);

        this._onGenerateReport = this._onGenerateReport.bind(this);
    }

    _onGenerateReport(){
        let data = new FormData();
        data.append('type', serverEntities.BENEFICIARY_ATTENDANCE);

        data.append('filename', this.state.filename);
        data.append('format', this.state.format);
        data.append('bid', this.state.bid);
        data.append('start', format(this.state.startDate, 'X'));
        data.append('end', format(this.state.endDate, 'X'));

        this.props.generate(data);
    }

    _isFormValid(){
        const {format: fileFormat, filename, startDate, endDate, bid} = this.state;
        return isFormValid({
            startDate: format(startDate, 'X'), endDate: format(endDate, 'X'), format: fileFormat, filename, bid
        });
    }

    render(){

        const disableGenerateButton = !this._isFormValid();

        return (
            <div className={`form__wrapper`}>
                <header className="form__header">
                    <Text>Beneficiary Attendance</Text>
                    <Button
                        disabled={disableGenerateButton}
                        onClick={this._onGenerateReport}
                        loading={this.props.generatingReport}
                        className="pt-small pt-intent-primary" text={'generate'}/>
                </header>
                <div className="form__section">
                    <label className="pt-label">
                        BID
                        <input
                            value={this.state.bid || ''}
                            onChange={({target: {value}}) => this.setState({bid: value})}
                            className="pt-input pt-fill" type="text" dir="auto" />
                    </label>

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
}

const mapStateToProps = ({generatingReport}) => ({generatingReport});
const mapDispatchToProps = dispatch => bindActionCreators({generate}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SingleAttendance);