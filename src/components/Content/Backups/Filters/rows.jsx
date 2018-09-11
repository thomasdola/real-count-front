import React from 'react';
import {Icon, Popover} from '@blueprintjs/core';
import { DatePicker } from "@blueprintjs/datetime";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";

const DateInputSmall = ({...props}) => (
    <Popover inline={true}>
        <div className="pt-input-group bms-small">
            <span className="pt-icon pt-icon-calendar"/>
            <input type="text" className="pt-input"/>
        </div>
        <DatePicker {...props}/>
    </Popover>
);

export class Date extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            option: "lessThan",
            options: [
                {id: 1, value: "lessThan", name: "is before"},
                {id: 2, value: "equalTo", name: "is equal to"},
                {id: 3, value: "greaterThan", name: "is after"},
                {id: 4, value: "between", name: "is between"},
            ]
        };
    }

    render(){
        const lessThan = (
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '5px'}}>
                <div style={{width: '70%'}}>
                    <DateInputSmall/>
                </div> 
                <Icon iconName="key-enter"/>
            </div>
        );

        const greaterThan = (
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '5px'}}>
                <div style={{width: '70%'}}>
                    <DateInputSmall/>
                </div>
                <Icon iconName="key-enter"/>
            </div>
        );

        const equalTo = (
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '5px'}}>
                <div style={{width: '70%'}}>
                    <DateInputSmall/>
                </div>
                <Icon iconName="key-enter"/>
            </div>
        );

        const between = (
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '5px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{width: '45%'}}>
                        <DateInputSmall/>
                    </div>
                    <span>-</span>    
                    <div style={{width: '45%'}}>
                        <DateInputSmall/>
                    </div>
                </div> 
                <Icon iconName="key-enter"/>
            </div>
        );

        return (
            <div>
                <ShortList 
                    defaultValue={this.state.option} 
                    items={this.state.options} 
                    onChange={e => this.setState({option: e.target.value})}/>
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


export const ShortList = ({defaultValue, items, onChange}) => {
    const list = items.map(function(item){
        return <option key={item.id} value={item.value}>{item.name}</option>
    })
    return (
        <div className="pt-select bms-small pt-fill">
            <select value={defaultValue} onChange={onChange}>
                {list}
            </select>
        </div>
    );
}

export const LongList = ({defaultValue, items, onChange}) => {
    const list = items.map(function(item){
        return <option key={item.id} value={item.value}>{item.name}</option>
    })
    return (
        <div className="pt-select bms-small pt-fill">
            <select value={defaultValue} onChange={onChange}>
                {list}
            </select>
        </div>
    );
}

export class Health extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            valid: 1,
            valids: [
                {id: 1, value: 2, name: "is good"},
                {id: 2, value: 1, name: "is acceptable"},
                {id: 3, value: 0, name: "is bad"}
            ]
        };
    }

    render(){
        return (
            <ShortList 
                defaultValue={this.state.valid}
                onChange={e => this.setState({valid: e.target.value})}
                items={this.state.valids}/>
        );
    }
}
