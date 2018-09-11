import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {generate} from '../../../../actions/reportActions';
import {Button, Text} from '@blueprintjs/core';
import * as serverEntities from '../../../../helpers/server/entities';
import {isFormValid} from "../../Enrollment";

class Detail extends React.Component{
    static propTypes = {
        generate: PropTypes.func.isRequired,
        generatingReport: PropTypes.bool.isRequired,
    };

    state = {
        filename: '',
        bid: '',
    };

    constructor(props){
        super(props);

        this._onGenerateReport = this._onGenerateReport.bind(this);
    }

    _onGenerateReport(){
        let data = new FormData();
        data.append('type', serverEntities.BENEFICIARY_INFORMATION);

        data.append('format', 'pdf');
        data.append('filename', this.state.filename);
        data.append('bid', `${this.state.bid}`);

        this.props.generate(data);
    }

    _isFormValid(){
        return isFormValid(this.state);
    }

    render(){

        const disableGenerateButton = !this._isFormValid();

        return (
            <div className={`form__wrapper`}>
                <header className="form__header">
                    <Text>Beneficiary Details</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(Detail);