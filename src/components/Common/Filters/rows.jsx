import React from 'react';
import PropTypes from 'prop-types';
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


export const ShortList = ({defaultValue, items, onChange}) => {
    const list = items.map(function(item){
        return <option key={item.id} value={item.value}>{item.name}</option>
    });
    return (
        <div className="pt-select bms-small pt-fill">
            <select value={defaultValue} onChange={onChange}>
                {list}
            </select>
        </div>
    );
};

export const LongList = ({defaultValue, items, onChange}) => {
    const list = items.map(function(item){
        return <option key={item.id} value={item.value}>{item.name}</option>
    });
    return (
        <div className="pt-select bms-small pt-fill">
            <select value={defaultValue} onChange={onChange}>
                {list}
            </select>
        </div>
    );
};

export class Range extends React.Component{
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


export class Region extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            region: 'one',
            regions: [
                {id: 1, value: 'one', name: "One"},
                {id: 2, value: 'two', name: "Two"},
                {id: 3, value: 'three', name: "Three"}
            ]
        };
    }

    static propTypes = {
        regions: PropTypes.array.isRequired,
        onRegionChange: PropTypes.func.isRequired,
        defaultRegion: PropTypes.number
    };

    render(){
        return (
            <LongList 
                defaultValue={this.state.region}
                onChange={e => this.setState({region: e.target.value})}
                items={this.state.regions}/>
        );
    }
}

export class District extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            district: 'one',
            districts: [
                {id: 1, value: 'one', name: "One"},
                {id: 2, value: 'two', name: "Two"},
                {id: 3, value: 'three', name: "Three"}
            ]
        };
    }

    render(){
        return (
            <LongList 
                defaultValue={this.state.district}
                onChange={e => this.setState({district: e.target.value})} 
                items={this.state.districts}/>
        );
    }
}

export class Location extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            location: 'one',
            locations: [
                {id: 1, value: 'one', name: "One"},
                {id: 2, value: 'two', name: "Two"},
                {id: 3, value: 'three', name: "Three"}
            ]
        };
    }

    render(){
        return (
            <LongList 
                defaultValue={this.state.location}
                onChange={e => this.setState({location: e.target.value})}
                items={this.state.locations}/>
        );
    }
}

export class Module extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            module: 'one',
            modules: [
                {id: 1, value: 'one', name: "One"},
                {id: 2, value: 'two', name: "Two"},
                {id: 3, value: 'three', name: "Three"}
            ]
        };
    }

    render(){
        return (
            <LongList 
                defaultValue={this.state.module}
                onChange={e => this.setState({module: e.target.value})}
                items={this.state.modules}/>
        );
    }
}

export class Rank extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            rank: 'one',
            ranks: [
                {id: 1, value: 'one', name: "One"},
                {id: 2, value: 'two', name: "Two"},
                {id: 3, value: 'three', name: "Three"}
            ]
        };
    }

    render(){
        return (
            <ShortList 
                defaultValue={this.state.rank}
                onChange={e => this.setState({rank: e.target.value})}
                items={this.state.ranks}/>
        );
    }
}

export class Active extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            active: 1,
            actives: [
                {id: 1, value: 1, name: "is active"},
                {id: 2, value: 0, name: "is not active"}
            ]
        };
    }

    render(){
        return (
            <ShortList 
                defaultValue={this.state.active}
                onChange={e => this.setState({active: e.target.value})}
                items={this.state.actives}/>
        );
    }
}

export class Valid extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            valid: 2,
            valids: [
                {id: 1, value: 1, name: "is valid"},
                {id: 2, value: 0, name: "is not valid"}
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
