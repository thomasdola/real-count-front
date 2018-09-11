import React from "react";
import {ShortList} from '../Lists';
import PropTypes from 'prop-types';

export default class Active extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            values: [
                {id: 1, name: "Is Valid"},
                {id: 0, name: "Is Not Valid"}
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
                onChange={value => this.props.onChange({label: "valid", value})}
                items={this.state.values}/>
        );
    }
}