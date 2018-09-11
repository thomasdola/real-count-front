import React from 'react';
import PropTypes from 'prop-types';
import {DateRangePicker} from "@blueprintjs/datetime";
import {Popover} from "@blueprintjs/core";
import {format} from "date-fns";
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';

export default class DateRange extends React.Component{
    static propTypes = {
        from: PropTypes.any,
        to: PropTypes.any,
        onChange: PropTypes.func.isRequired
    };

    state = {
        popOpen: false
    };

    constructor(props){
        super(props);

        this._handleDateChange = this._handleDateChange.bind(this);
    }

    _handleDateChange([from, to]){
        console.log('data range', from, to);
        if(from && to){
            this.props.onChange({from, to});
            this.setState({popOpen: false});
        }
    }

    render(){
        const {from, to} = this.props;
        const dateString = from ? format(from, 'DD/MM/YYYY') : null;
        const rightDateString = to ? format(to, 'DD/MM/YYYY') : null;
        const dates = dateString && rightDateString ? `${dateString} - ${rightDateString}` : '';
        return (
            <Popover isOpen={this.state.popOpen}>
                <div className="pt-input-group">
                    <span className="pt-icon pt-icon-calendar"/>
                    <input
                        readOnly
                        onClick={() => this.setState({popOpen: true})}
                        value={dates}
                        type="text"
                        className="pt-input"/>
                </div>
                <DateRangePicker onChange={this._handleDateChange}/>
            </Popover>
        );
    }
}