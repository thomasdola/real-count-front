import React from 'react';
import PropTypes from 'prop-types';
import {DatePicker} from "@blueprintjs/datetime";
import {Icon, Popover, Position, PopoverInteractionKind} from "@blueprintjs/core";
import {ShortList} from "../Lists";
import {format, isAfter, isBefore} from "date-fns";
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';
import _isEqual from 'lodash/isEqual';

export const parseDateFilter = filter => {
    // {label: '', operator: '', value: '', rightValue: ''}
    let [label, val] = filter.split('|');
    let [opt, opra] = val.split(':');
    let operator = parseDateOperator(opt);
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
export const formatDateFilter = ({label, operator, value, rightValue}) => {
    value = value || format(new Date(), 'X');
    rightValue = rightValue || format(new Date(), 'X');
    //date|lt:time
    //date|eq:time
    //date|gt:time
    //date|bt:time$time
    //"date|Tue Mar 06 2018 21:36:26 GMT+0000 (GMT)"
    //label, operator, value, rightValue
    let op = formatDateOperator(operator);
    let val = operator === 'between'
        ? `${value}$${rightValue}`
        : `${value}`;

    return `${label}|${op}:${val}`;
};
export const formatDateOperator = operator => {
    if(operator === 'lessThan') return 'lt';
    if(operator === 'greaterThan') return 'gt';
    if(operator === 'equalTo') return 'eq';
    if(operator === 'between') return 'bt';
};
export const parseDateOperator = key => {
    if(key === 'lt') return 'lessThan';
    if(key === 'gt') return 'greaterThan';
    if(key === 'eq') return 'equalTo';
    if(key === 'bt') return 'between';
};

const defaultDate = new Date();

export class DateInputSmall extends React.Component{
    static propTypes = {
        value: PropTypes.string.isRequired,
        onSelection: PropTypes.func.isRequired
    };

    state = {
        popOpen: false,
        value: {
            date: defaultDate,
            timestamp: format(defaultDate, 'X'),
            text: format(defaultDate, 'DD/MM/YYYY')
        }
    };

    constructor(props){
        super(props);

        this._handleDateChange = this._handleDateChange.bind(this);
    }

    static getDerivedStateFromProps({value}, {value: {unix}}){
        if(_isEqual(value, unix))
            return null;
        const newDate = new Date(parseInt(value, 10) * 1000);
        return {
            value: {
                date: newDate,
                timestamp: format(newDate, 'X'),
                text: format(newDate, 'DD/MM/YYYY')
            }
        };
    }

    _handleDateChange(date, hasUserManuallySelectedDate){
        const timestamp = format(date, 'X');
        const text = format(date, 'DD/MM/YYYY');
        this.setState(() => {
            return {
                popOpen: !hasUserManuallySelectedDate,
                value: {date, timestamp, text}
            };
        });
        this.props.onSelection(timestamp);
    }

    render(){
        return (
            <Popover interactionKind={PopoverInteractionKind.CLICK} isOpen={this.state.popOpen} position={Position.TOP}>
                <div className="pt-input-group bms-small">
                    <span className="pt-icon pt-icon-calendar"/>
                    <input
                        title={this.state.value.text}
                        readOnly
                        onClick={() => this.setState({popOpen: true})}
                        value={this.state.value.text}
                        type="text"
                        className="pt-input"/>
                </div>
                <DatePicker
                    value={this.state.value.date}
                    onChange={this._handleDateChange} />
            </Popover>
        );
    }
}

export default class DateFilter extends React.Component{
    constructor(props){
        super(props);

        this._handDateChange = this._handDateChange.bind(this);
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
        onChange: PropTypes.func.isRequired
    };

    static getDerivedStateFromProps(nextProps, prevState){
        const {operator} = nextProps;
        const {option: oldOption} = prevState;

        if(_isEqual(operator, oldOption))
            return null;

        return {option: operator};
    }

    _handDateChange(date, {operator}){
        const {onChange, value, rightValue} = this.props;
        if(operator === 'betweenRight' && isBefore(date, value)){
            date = value;
        }
        if(operator === 'betweenLeft' && isAfter(date, rightValue)){
            date = rightValue;
        }
        onChange({label: 'date', value: date, operator});
    }

    _handleOperatorChange(value){
        this.setState({option: value});
        const {onChange, rightValue} = this.props;
        onChange({label: 'date', value: this.props.value, operator: value, rightValue});
    }

    render(){
        const {value, rightValue} = this.props;

        const lessThan = (
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '5px'}}>
                <div style={{width: '70%'}}>
                    <DateInputSmall value={value} onSelection={d => this._handDateChange(d, {operator: 'lessThan'})}/>
                </div>
                <Icon icon="key-enter"/>
            </div>
        );

        const greaterThan = (
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '5px'}}>
                <div style={{width: '70%'}}>
                    <DateInputSmall value={value} onSelection={d => this._handDateChange(d, {operator: 'greaterThan'})}/>
                </div>
                <Icon icon="key-enter"/>
            </div>
        );

        const equalTo = (
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '5px'}}>
                <div style={{width: '70%'}}>
                    <DateInputSmall value={value} onSelection={d => this._handDateChange(d, {operator: 'equalTo'})}/>
                </div>
                <Icon icon="key-enter"/>
            </div>
        );

        const between = (
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '5px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{width: '45%'}}>
                        <DateInputSmall
                            value={value}
                            onSelection={d => this._handDateChange(d, {operator: 'betweenLeft'})}/>
                    </div>
                    <span>-</span>
                    <div style={{width: '45%'}}>
                        <DateInputSmall
                            value={rightValue}
                            onSelection={d => this._handDateChange(d, {operator: 'betweenRight'})}/>
                    </div>
                </div>
                <Icon icon="key-enter"/>
            </div>
        );

        return (
            <div>
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