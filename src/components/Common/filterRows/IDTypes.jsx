import PropTypes from "prop-types";
import React from "react";
import {connect} from 'react-redux';
import {loadIDTypes} from '../../../actions/IDTypeActions';
import {ShortList} from '../Lists';
import {bindActionCreators} from "redux";

class IDTypes extends React.Component{
    static propTypes = {
        idTypes: PropTypes.array.isRequired,
        value: PropTypes.any.isRequired,
        onChange: PropTypes.func.isRequired,
        loadIDTypes: PropTypes.func.isRequired,
        small: PropTypes.bool
    };

    constructor(props){
        super(props);
        this._handleOnChange = this._handleOnChange.bind(this);
    }

    componentDidMount(){
        const {loadIDTypes} = this.props;
        loadIDTypes();
    }

    _handleOnChange(value){
        const {onChange} = this.props;
        onChange({label: "identification", value});
    }

    render(){
        const {idTypes, value, small, ...props} = this.props;
        return (
            <ShortList
                {...props}
                small={small}
                defaultValue={value}
                onChange={this._handleOnChange}
                items={idTypes}/>
        );
    }
}

const mapStateToProps = ({idTypes}) => ({idTypes});
const mapDispatchToProps = dispatch => bindActionCreators({loadIDTypes}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(IDTypes);