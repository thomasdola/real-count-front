import PropTypes from "prop-types";
import React from "react";
import {ShortList} from "../../../Common/Lists";


export default class RolesSelect extends React.Component{
    static propTypes = {
        roles: PropTypes.array.isRequired,
        onChange: PropTypes.func.isRequired,
        value: PropTypes.any.isRequired,
        small: PropTypes.bool,
        disabled: PropTypes.bool,
    };

    constructor(props){
        super(props);
        this._handleOnChange = this._handleOnChange.bind(this);
    }

    _handleOnChange(role){
        const {onChange} = this.props;
        onChange({label: "role", value: role});
    }

    render(){
        const {roles, value, small, disabled} = this.props;
        console.log('value in roles single select', value);
        return (
            <ShortList
                label={'role'}
                disabled={disabled}
                small={small}
                defaultValue={value}
                onChange={this._handleOnChange}
                items={roles}/>
        ) ;
    }
}