import PropTypes from "prop-types";
import React from "react";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {loadDanglingUsers} from "../../../../actions/userActions";
import {LongList} from "../../../Common/Lists";


class UsersSingleSelect extends React.Component{
    static propTypes = {
        users: PropTypes.array.isRequired,
        onChange: PropTypes.func.isRequired,
        loadDanglingUsers: PropTypes.func.isRequired,
        value: PropTypes.object.isRequired,
        small: PropTypes.bool,
        disabled: PropTypes.bool,
    };

    constructor(props){
        super(props);
        this._handleOnChange = this._handleOnChange.bind(this);
    }

    componentDidMount(){
        this.props.loadDanglingUsers();
    }

    _handleOnChange(user){
        const {onChange} = this.props;
        onChange({label: "user", value: user});
    }

    render(){
        const {users, value, small, disabled} = this.props;
        return (
            <LongList
                label={'user'}
                disabled={disabled}
                small={small}
                defaultValue={value.id}
                onChange={this._handleOnChange}
                items={users}/>
        ) ;
    }
}

const mapStateToProps = ({danglingUsers}) => ({users: danglingUsers});
const mapDispatchToProps = dispatch => bindActionCreators({loadDanglingUsers}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UsersSingleSelect);