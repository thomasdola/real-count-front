import React from "react";
import PropTypes from 'prop-types';
import {Icon} from "@blueprintjs/core";
import {ShortList} from "../Lists";
import {TimePicker, TimePickerPrecision} from "@blueprintjs/datetime";
import isBefore from 'date-fns/is_before';
import format from 'date-fns/format';
import _isEqual from 'lodash/isEqual';

const defaultDate = new Date();
export class TimeInputSmall extends React.Component{
    constructor(props){
        super(props);

        this._handleOnTimeChange = this._handleOnTimeChange.bind(this);
    }

    state = {
        date: defaultDate,
        timestamp: format(defaultDate, 'X')
    };

    static getDerivedStateFromProps({value}, {timestamp}){
        if(_isEqual(value, timestamp))
            return null;

        return {
            date: new Date(parseInt(value, 10) * 1000),
            timestamp: value
        };
    }

    _handleOnTimeChange(date){
        const timestamp = format(date, 'X');
        this.setState({date, timestamp});
        this.props.onChange(timestamp);
    }

    render(){
        return (
            <TimePicker
                value={this.state.date}
                onChange={date => this._handleOnTimeChange(date)}
                className="bms-small" precision={TimePickerPrecision.MINUTE}/>
        )
    }
}

export const parseTimeFilter = filter => {
    // {label: '', operator: '', value: '', rightValue: ''}
    let [key, val] = filter.split('|');
    let [opt, opra] = val.split(':');
    let label = key === 'in' ? 'clock in time' : 'clock out time';
    let operator = parseTimeOperator(opt);
    let filterObj = {label, operator};
    if(opt === 'bt'){
        let [v, rv] = opra.split('$');
        filterObj = Object.assign({}, filterObj,
            {value: v, rightValue: rv})
    }else{
        filterObj = Object.assign({}, filterObj, {value: opra, rightValue: format(new Date(), 'X')})
    }

    return filterObj;
};
export const formatTimeFilter = ({label, operator, value, rightValue}) => {
    value = value || format(new Date(), 'X');
    rightValue = rightValue || format(new Date(), 'X');
    //(in,out)|lt:time
    //(in,out)|eq:time
    //(in,out)|gt:time
    //(in,out)|bt:time$time
    //"clock in time|Tue Mar 06 2018 21:36:26 GMT+0000 (GMT)"
    //label, operator, value, rightValue
    let key = label.startsWith('clock in')
        ? 'in'
        : 'out';
    let op = formatTimeOperator(operator);
    let val = operator === 'between'
        ? `${value}$${rightValue}`
        : `${value}`;
    return `${key}|${op}:${val}`;
};
export const formatTimeOperator = operator => {
    if(operator === 'lessThan') return 'lt';
    if(operator === 'greaterThan') return 'gt';
    if(operator === 'equalTo') return 'eq';
    if(operator === 'between') return 'bt';
};
export const parseTimeOperator = key => {
    if(key === 'lt') return 'lessThan';
    if(key === 'gt') return 'greaterThan';
    if(key === 'eq') return 'equalTo';
    if(key === 'bt') return 'between';
};

export default class Time extends React.Component{
    constructor(props){
        super(props);

        this._handleTimeChange = this._handleTimeChange.bind(this);
        this._handleOperatorChange = this._handleOperatorChange.bind(this);
    }

    state = {
        option: "",
        options: [
            {id: "lessThan", name: "is before"},
            {id: "equalTo", name: "is equal to"},
            {id: "greaterThan", name: "is after"},
            {id: "between", name: "is between"},
        ]
    };

    static propTypes = {
        value: PropTypes.string.isRequired,
        operator: PropTypes.oneOf(["lessThan", "equalTo", "greaterThan", "between"]).isRequired,
        rightValue: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired
    };

    static getDerivedStateFromProps(nextProps, prevState){
        const {operator} = nextProps;
        const {option: oldOption} = prevState;

        if(_isEqual(operator, oldOption))
            return null;

        return {option: operator};
    }

    _handleTimeChange(date, {operator}){
        const {onChange, label, value} = this.props;
        if(operator === 'betweenRight' && isBefore(date, value)){
            date = value;
        }
        onChange({label, value: date, operator});
    }

    _handleOperatorChange(value){
        this.setState({option: value});
        const {onChange, label, rightValue} = this.props;
        onChange({label, value: this.props.value, operator: value, rightValue});
    }

    render(){
        const {value, rightValue} = this.props;

        const lessThan = (
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '5px'}}>
                <div style={{width: '70%'}}>
                    <TimeInputSmall value={value} onChange={d => this._handleTimeChange(d, {operator: 'lessThan'})}/>
                </div>
                <Icon icon="key-enter"/>
            </div>
        );

        const greaterThan = (
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '5px'}}>
                <div style={{width: '70%'}}>
                    <TimeInputSmall value={value} onChange={d => this._handleTimeChange(d, {operator: 'greaterThan'})}/>
                </div>
                <Icon icon="key-enter"/>
            </div>
        );

        const equalTo = (
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '5px'}}>
                <div style={{width: '70%'}}>
                    <TimeInputSmall value={value} onChange={d => this._handleTimeChange(d, {operator: 'equalTo'})}/>
                </div>
                <Icon icon="key-enter"/>
            </div>
        );

        const between = (
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '5px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{width: '45%'}}>
                        <TimeInputSmall value={value} onChange={d => this._handleTimeChange(d, {operator: 'betweenLeft'})}/>
                    </div>
                    <span>-</span>
                    <div style={{width: '45%'}}>
                        <TimeInputSmall value={rightValue} onChange={d => this._handleTimeChange(d, {operator: 'betweenRight'})}/>
                    </div>
                </div>
                <Icon icon="key-enter"/>
            </div>
        );

        return (
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                <ShortList
                    defaultValue={this.state.option}
                    items={this.state.options}
                    onChange={this._handleOperatorChange}/>
                {
                    this.state.option === "lessThan"
                    && lessThan
                }
                {
                    this.state.option === "greaterThan"
                    && greaterThan
                }
                {
                    this.state.option === "between"
                    && between
                }
                {
                    this.state.option === "equalTo"
                    && equalTo
                }
            </div>
        );
    }
}