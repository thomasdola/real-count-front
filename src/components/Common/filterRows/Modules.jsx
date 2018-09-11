import PropTypes from "prop-types";
import React from "react";
import {loadModules} from '../../../actions/moduleActions';
import {connect} from 'react-redux';
import {ShortList} from '../Lists';
import {bindActionCreators} from "redux";

class Modules extends React.Component{
    static propTypes = {
        modules: PropTypes.array.isRequired,
        onChange: PropTypes.func.isRequired,
        value: PropTypes.any.isRequired,
        loadModules: PropTypes.func.isRequired,
        small: PropTypes.bool,
        required: PropTypes.bool,
        disabled: PropTypes.bool,
    };

    constructor(props){
        super(props);
        this._handleOnChange = this._handleOnChange.bind(this);
    }

    componentDidMount(){
        const {loadModules} = this.props;
        loadModules();
    }

    _handleOnChange(value){
        const {onChange} = this.props;
        onChange({label: "module", value});
    }

    render(){
        const {modules, value, small, required, disabled} = this.props;
        return (
            <ShortList
                disabled={disabled}
                required={required}
                small={small}
                defaultValue={value}
                onChange={this._handleOnChange}
                items={modules}/>
        );
    }
}

const mapStateToProps = ({modules}) => ({modules});
const mapDispatchToProps = dispatch => bindActionCreators({loadModules}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Modules);