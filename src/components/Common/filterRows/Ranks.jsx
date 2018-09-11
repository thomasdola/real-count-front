import PropTypes from "prop-types";
import React from "react";
import {connect} from 'react-redux';
import {loadRanks} from '../../../actions/rankActions';
import {ShortList} from '../Lists';
import {bindActionCreators} from "redux";

class Ranks extends React.Component{
    static propTypes = {
        ranks: PropTypes.array.isRequired,
        onChange: PropTypes.func.isRequired,
        value: PropTypes.any.isRequired,
        loadRanks: PropTypes.func.isRequired,
        small: PropTypes.bool,
        required: PropTypes.bool,
        disabled: PropTypes.bool,
    };

    constructor(props){
        super(props);
        this._handleOnChange = this._handleOnChange.bind(this);
    }

    componentDidMount(){
        const {loadRanks} = this.props;
        loadRanks();
    }

    _handleOnChange(value){
        const {onChange} = this.props;
        onChange({label: "rank", value});
    }

    render(){
        const {ranks, value, small, required, disabled} = this.props;
        return (
            <ShortList
                disabled={disabled}
                required={required}
                small={small}
                defaultValue={value}
                onChange={this._handleOnChange}
                items={ranks}/>
        );
    }
}

const mapStateToProps = ({ranks}) => ({ranks});
const mapDispatchToProps = dispatch => bindActionCreators({loadRanks}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Ranks);