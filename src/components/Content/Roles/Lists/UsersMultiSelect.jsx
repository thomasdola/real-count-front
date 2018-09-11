import PropTypes from "prop-types";
import React from "react";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {MultipleLongList} from "../../../Common/Lists";
import {loadDanglingUsers} from '../../../../actions/userActions';

class UsersMultiSelect extends React.Component{
    static propTypes = {
        users: PropTypes.array.isRequired,
        onChange: PropTypes.func.isRequired,
        loadDanglingUsers: PropTypes.func.isRequired,
        values: PropTypes.array.isRequired,
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

    _handleOnChange(users){
        const {onChange} = this.props;
        onChange({label: "users", value: users});
    }

    render(){
        const {users, values, small, disabled} = this.props;
        return (
            <MultipleLongList
                disabled={disabled || users.length < 1}
                label={'action'}
                small={small}
                defaultValues={values}
                onChange={this._handleOnChange}
                items={users}/>
        ) ;
    }
}

const mapStateToProps = ({danglingUsers}) => ({users: danglingUsers});
const mapDispatchToProps = dispatch => bindActionCreators({loadDanglingUsers}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UsersMultiSelect);