import React from 'react';
import PropTypes from "prop-types";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {editRole} from '../../../../actions/roleActions';
import PWrapper from "./PWrapper";
import {Motion, spring} from "react-motion";
import {Intent} from "@blueprintjs/core/lib/esm/index";
import {EDIT_GROUP_WITH_POLICIES} from "../../../../actions/types";
import Toaster from "../../../Common/Toaster";
import _isEqual from "lodash/isEqual";
import queryString from "query-string";
import _find from "lodash/find";
import {withRouter} from "react-router-dom";


class AvailablePolicies extends React.Component {

    constructor(props){
        super(props);

        this._handleDeletePolicyConfirm = this._handleDeletePolicyConfirm.bind(this);
        this._handleAddPolicyToGroup = this._handleAddPolicyToGroup.bind(this);
    }

    state = {
        selectedRole: null
    };

    static getDerivedStateFromProps(nextProps, prevState){
        const {location: {search: newSearch}, userGroups} = nextProps;
        const {selectedRole} = prevState;
        const {role} = queryString.parse(newSearch);
        const newSelectedRole = _find(userGroups, {uuid: role});

        if(_isEqual(newSelectedRole, selectedRole)){
            return null;
        }

        return {
            selectedRole: {...newSelectedRole}
        };
    }

    componentDidUpdate(prevProps){
        const {OPERATION_SUCCESSFUL: OLD_OPERATION_SUCCESSFUL, OPERATION_FAILED: OLD_OPERATION_FAILED} = prevProps;
        const {OPERATION_SUCCESSFUL, OPERATION_FAILED} = this.props;

        if(!_isEqual(OLD_OPERATION_SUCCESSFUL, OPERATION_SUCCESSFUL)){
            if(OPERATION_SUCCESSFUL.action === EDIT_GROUP_WITH_POLICIES){
                Toaster.show({
                    message: `Policy(ies) Successfully Added 😃`,
                    intent: Intent.SUCCESS,
                    icon: 'tick' });
            }
        }

        if(!_isEqual(OLD_OPERATION_FAILED, OPERATION_FAILED)){
            if(OPERATION_FAILED.action === EDIT_GROUP_WITH_POLICIES){
                console.log(OPERATION_FAILED.data);
                Toaster.show({
                    message: `Could Not Add Policy(ies) 😞`,
                    intent: Intent.DANGER,
                    icon: 'error'
                });
            }
        }
    }

    _handleAddPolicyToGroup(policies){
        const {editRole} = this.props;
        const {selectedRole: {uuid}} = this.state;
        let policiesId = policies.map(({id}) => id);
        let data = new FormData();

        for(let i = 0; i < policiesId.length; i++){
            data.append('policies[]', policiesId[i]);
        }
        console.log(policies, policiesId, data.values());
        editRole(uuid, data, EDIT_GROUP_WITH_POLICIES);
    }

    _handleDeletePolicyConfirm(policy){
        this.props.onDeletePolicy(policy);
    }

    render(){
        const {data, editingPolicy, deletingPolicy, open, editingGroup, authUser} = this.props;

        return (
            <Motion style={{x: spring(open ? 0 : 100, {stiffness: 240, damping: 26})}}>
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
                            selectable
                            filterable
                            deletePolicy={this._handleDeletePolicyConfirm}
                            addMorePolicyToGroup={this._handleAddPolicyToGroup}
                            editingGroup={editingGroup}
                            deletingPolicy={deletingPolicy}
                            editingPolicy={editingPolicy}/>
                    </div>
                }
            </Motion>
        );
    }

    static propTypes = {
        location: PropTypes.object.isRequired,
        authUser: PropTypes.object.isRequired,
        data: PropTypes.array.isRequired,
        editRole: PropTypes.func.isRequired,
        onDeletePolicy: PropTypes.func.isRequired,
        deletingPolicy: PropTypes.bool.isRequired,
        editingPolicy: PropTypes.bool.isRequired,
        editingGroup: PropTypes.bool.isRequired,
        open: PropTypes.bool.isRequired,
        userGroups: PropTypes.array.isRequired,
        OPERATION_SUCCESSFUL: PropTypes.object.isRequired,
        OPERATION_FAILED: PropTypes.object.isRequired,
    };
}

const mapStateToProps = (
    {authUser, OPERATION_FAILED, OPERATION_SUCCESSFUL, editingPolicy, deletingPolicy, userGroups, editingGroup}) => (
        {authUser, OPERATION_FAILED, OPERATION_SUCCESSFUL, editingPolicy, deletingPolicy, userGroups, editingGroup});

const mapDispatchToProps = dispatch => bindActionCreators({editRole}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AvailablePolicies));