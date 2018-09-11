import React from "react";
import {ShortList} from '../Lists';
import PropTypes from 'prop-types';

export default class Mapping extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            values: [
                {id: 1, name: "mapped"},
                {id: 0, name: "not yet mapped"}
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
                onChange={value => this.props.onChange({label: "mapping", value})}
                items={this.state.values}/>
        );
    }
}