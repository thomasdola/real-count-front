import React from 'react';
import PropTypes from "prop-types";
import {connect} from 'react-redux';
import PWrapper from "./PWrapper";
import {Motion, spring} from "react-motion";


class DefaultPolicies extends React.Component {

    constructor(props){
        super(props);
        this._handleDeletePolicyConfirm = this._handleDeletePolicyConfirm.bind(this);
    }

    _handleDeletePolicyConfirm(policy){
        this.props.onDeletePolicy(policy);
    }

    render(){
        const {data, editingPolicy, deletingPolicy, open, authUser} = this.props;

        return (
            <Motion style={{x: spring(open ? 0 : -100, {stiffness: 240, damping: 26})}}>
                {({x}) =>
                    <div style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        WebkitTransform: `translate3d(${x}%, 0, 0)`,
                        transform: `translate3d(${x}%, 0, 0)`,
                    }}>
                        <PWrapper
                            data={data}
                            user={authUser}
                            deletePolicy={this._handleDeletePolicyConfirm}
                            deletingPolicy={deletingPolicy}
                            editingPolicy={editingPolicy}/>
                    </div>
                }
            </Motion>
        );
    }

    static propTypes = {
        data: PropTypes.array.isRequired,
        onDeletePolicy: PropTypes.func.isRequired,
        deletingPolicy: PropTypes.bool.isRequired,
        editingPolicy: PropTypes.bool.isRequired,
        open: PropTypes.bool.isRequired,
        OPERATION_FAILED: PropTypes.object.isRequired,
        OPERATION_SUCCESSFUL: PropTypes.object.isRequired,
        authUser: PropTypes.object.isRequired,
    };
}

const mapStateToProps = (
    {authUser, OPERATION_FAILED, OPERATION_SUCCESSFUL, editingPolicy, deletingPolicy}) => (
        {authUser, OPERATION_FAILED, OPERATION_SUCCESSFUL, editingPolicy, deletingPolicy});

export default connect(mapStateToProps)(DefaultPolicies);