import PropTypes from "prop-types";
import React from "react";
import {connect} from 'react-redux';
import {MultipleLongList} from '../Lists';

class Policies extends React.Component{
    static propTypes = {
        policies: PropTypes.array.isRequired,
        onChange: PropTypes.func.isRequired,
        values: PropTypes.array.isRequired,
        small: PropTypes.bool,
        disabled: PropTypes.bool,
    };

    constructor(props){
        super(props);
        this._handleOnChange = this._handleOnChange.bind(this);
    }

    _handleOnChange(policies){
        const {onChange} = this.props;
        onChange({label: "policies", value: policies});
    }

    render(){
        const {policies, values, small, disabled} = this.props;
        return (
            <MultipleLongList
                disabled={disabled || policies.length < 1}
                label={'policy'}
                small={small}
                defaultValues={values}
                onChange={this._handleOnChange}
                items={policies}/>
        ) ;
    }
}

const mapStateToProps = ({policies}) => ({policies});

export default connect(mapStateToProps)(Policies);