import React from "react";
import {ShortList} from '../Lists';
import PropTypes from 'prop-types';

export default class Status extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            values: [
                {id: 1, name: "Is Online"},
                {id: 0, name: "Is Offline"}
            ]
        };
    }

    static propTypes = {
        onChange: PropTypes.func.isRequired,
        value: PropTypes.any.isRequired
    };

    render(){
        return (
            <ShortList
                defaultValue={this.props.value}
                onChange={value => this.props.onChange({label: "status", value})}
                items={this.state.values}/>
        );
    }
}