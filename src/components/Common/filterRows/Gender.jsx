import React from "react";
import {ShortList} from '../Lists';
import PropTypes from 'prop-types';

export default class Active extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            values: [
                {id: 1, name: "Male"},
                {id: 0, name: "Female"}
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
                onChange={value => this.props.onChange({label: "gender", value})}
                items={this.state.values}/>
        );
    }
}