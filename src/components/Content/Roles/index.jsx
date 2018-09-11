import React from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    ButtonGroup,
    Icon,
    Intent,
    Menu,
    MenuItem,
    Popover,
    Position,
    Spinner,
    Text,
    Tooltip
} from '@blueprintjs/core';
import {Link, Route} from 'react-router-dom';
import Filters, {parseFilters} from '../../Common/Filters';
import {AvailablePolicies, DefaultPolicies, RolesTable, UsersTable} from './Lists';
import {AddUsers, EditPolicy, EditRole, NewPolicy, NewRole} from './Modals';
import {Districts, Regions} from "../../Common/filterRows";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {deleteRole, editRole, loadActions, loadEntities, loadGates, loadRoles} from '../../../actions/roleActions';
import {loadDanglingUsers, loadGroupUsers} from '../../../actions/userActions';
import {deletePolicy, loadGroupPolicies, loadPolicies} from '../../../actions/policyActions';

import './index.css';
import {formatTimeFilter} from "../../Common/filterRows/Time";
import queryString from "query-string";
import _omit from "lodash/omit";
import {parseSort} from "../../Common/Table/helpers";
import _isEqual from "lodash/isEqual";
import _has from "lodash/has";
import {Search} from "../Beneficiaries";
import Toaster from "../../Common/Toaster";
import {
    ADD_GROUP,
    ADD_POLICY,
    DELETE_GROUP,
    DELETE_POLICY,
    EDIT_GROUP,
    EDIT_GROUP_WITH_POLICIES,
    EDIT_GROUP_WITH_USERS,
    EDIT_POLICY
} from "../../../actions/types";
import {ConfirmAlert} from "../Beneficiary";
import _differenceBy from 'lodash/differenceBy';
import _find from 'lodash/find';

import {ROLES} from '../../../api/constants/Gates';
import {ROLE, POLICY} from '../../../api/constants/Entities';
import {ADD, DELETE, EDIT} from '../../../api/constants/Actions';
import Can from "../../../helpers/Can";
import _unionBy from 'lodash/unionBy';
import {formatRowsWithScopeFilters, stringifyFilters, roleScopeFilters} from '../Beneficiaries';

import _includes from 'lodash/includes';
import _filter from 'lodash/filter';

export const OPEN_POLICY = {DEFAULT: 0, AVAILABLE: 1};

class Roles extends React.Component{
    constructor(props){
        super(props);

        this._handleDeleteRoleCancel = this._handleDeleteRoleCancel.bind(this);
        this._handleDeleteRoleConfirm = this._handleDeleteRoleConfirm.bind(this);
        this._applyFilters = this._applyFilters.bind(this);
        this._clearFilters = this._clearFilters.bind(this);
        this._onPerPageChange = this._onPerPageChange.bind(this);
        this._onSearchQueryChange = this._onSearchQueryChange.bind(this);
        this._onClearSearch = this._onClearSearch.bind(this);
        this._onSearch = this._onSearch.bind(this);
        this._onSortChange = this._onSortChange.bind(this);
        this._onDeleteRole = this._onDeleteRole.bind(this);
        this._onDeletePolicy = this._onDeletePolicy.bind(this);
        this._onDeleteGroupUser = this._onDeleteGroupUser.bind(this);
        this._handleShowAllPolicies = this._handleShowAllPolicies.bind(this);
    }

    state = {
        filterRows: [
            {
                label: "Region",
                isExpanded: false,
                body: {
                    component: Regions,
                    props: { value: '' }
                }
            },
            {
                label: "District",
                isExpanded: false,
                body: {
                    component: Districts,
                    props: { value: '', dataList: true, small: true }
                }
            }
        ],
        filters: [],
        searchQuery: '',
        colSortDirs: {},
        openPolicies: OPEN_POLICY.DEFAULT,
        viewUsers: false,
        confirmDeleteRole: false,
        selectedRole: {},
        rolePolicies: []
    };

    componentDidMount(){
        const {loadRoles, loadPolicies, location: {search}, loadDanglingUsers, 
            authUser: {root, role}} = this.props;
        let params = queryString.parse(search);

        let newFilters = params.f ? parseFilters(params.f) : [];
        
        const roleScopeFilters = Roles.getScopeFilters(role);

        newFilters = _unionBy(roleScopeFilters, newFilters, 'label');
        params = root ? params : {...params, f: stringifyFilters(newFilters)};

        loadRoles(params);
        loadPolicies();
        loadDanglingUsers();
    }

    static getDerivedStateFromProps(nextProps, prevState){
        const {location: {search: newSearch}, userGroups, authUser: {root, role: userRole}, policies} = nextProps;
        const {searchQuery, colSortDirs, filters, selectedRole, filterRows: oldFilterRows, rolePolicies} = prevState;
        const {q, f, s, role} = queryString.parse(newSearch);
        const newQuery = q || '';
        const newSorts = s ? parseSort(s) : {};
        let newFilters = f ? parseFilters(f) : [];
        const newSelectedRole = _find(userGroups, {uuid: role});
        const newRolePolicies = _filter(policies, ({roles}) => {
            return _includes(roles, selectedRole.id);
        });

        const roleScopeFilters = Roles.getScopeFilters(userRole);
        
        const filterRows = root ? oldFilterRows : Roles.formatRows(oldFilterRows, roleScopeFilters);
        
        newFilters = root ? newFilters : _unionBy(roleScopeFilters, newFilters, 'label');

        if(_isEqual(searchQuery, q) && _isEqual(colSortDirs, newSorts) && _isEqual(oldFilterRows, filterRows)
            && _isEqual(filters, newFilters) && _isEqual(newSelectedRole, selectedRole) 
            && _isEqual(rolePolicies, newRolePolicies)){
            return null;
        }

        return {
            searchQuery: newQuery,
            colSortDirs: newSorts,
            filters: newFilters,
            selectedRole: {...newSelectedRole},
            filterRows, 
            rolePolicies: newRolePolicies
        };
    }

    componentDidUpdate(prevProps, prevState){
        const {location: {search: oldSearch}, OPERATION_SUCCESSFUL: OLD_OPERATION_SUCCESSFUL,
            OPERATION_FAILED: OLD_OPERATION_FAILED} = prevProps;

        const { selectedRole: oldSelectedRole } = prevState;

        const {location: {search: newSearch}, loadGroupUsers, loadRoles, OPERATION_SUCCESSFUL,
            OPERATION_FAILED, loadPolicies, loadDanglingUsers} = this.props;

        const newParams = _omit(queryString.parse(newSearch), 'role');
        const oldParams = _omit(queryString.parse(oldSearch), 'role');
        if(!_isEqual(newParams, oldParams)){
            loadRoles(newParams);
        }

        if(!_isEqual(this.state.selectedRole, oldSelectedRole)){
            // this.props.loadGroupPolicies({f: `role|${this.state.selectedRole.id}`});
            loadGroupUsers({f: `role|${this.state.selectedRole.id}`});
        }

        const {name: role} = this.state.selectedRole;
        if(!_isEqual(OLD_OPERATION_SUCCESSFUL, OPERATION_SUCCESSFUL)){
            const {action} = OPERATION_SUCCESSFUL;

            if(action === DELETE_GROUP){
                Toaster.show({
                    message: `${role.toUpperCase()} Successfully Deleted 😃`,
                    intent: Intent.SUCCESS,
                    icon: 'tick' });
            }

            if(action === DELETE_POLICY){
                Toaster.show({
                    message: `Policy Deleted Successfully 😃`,
                    intent: Intent.SUCCESS,
                    icon: 'tick' });
            }

            if(action === DELETE_GROUP || action === ADD_GROUP || action === EDIT_GROUP || EDIT_GROUP_WITH_POLICIES
                || EDIT_GROUP_WITH_USERS){
                loadRoles(newParams);
            }

            if(action === DELETE_POLICY || action === ADD_POLICY || action === EDIT_POLICY){
                loadPolicies();
            }

            if(action === EDIT_GROUP_WITH_USERS){
                loadGroupUsers({f: `role|${this.state.selectedRole.id}`});
                loadDanglingUsers()
            }

            if(action === EDIT_GROUP_WITH_POLICIES || action === EDIT_POLICY){
                this.props.loadPolicies();
            }
        }

        if(!_isEqual(OLD_OPERATION_FAILED, OPERATION_FAILED)){
            if(OPERATION_FAILED.action === DELETE_GROUP){
                console.log(OPERATION_FAILED.data);
                Toaster.show({
                    message: `Could Not Delete ${role.toUpperCase()} 😞`,
                    intent: Intent.DANGER,
                    icon: 'error'
                });
            }

            if(!_isEqual(OLD_OPERATION_FAILED, OPERATION_FAILED)){
                if(OPERATION_FAILED.action === DELETE_POLICY){
                    console.log(OPERATION_FAILED.data);
                    Toaster.show({
                        message: `Could Not Delete Policy 😞`,
                        intent: Intent.DANGER,
                        icon: 'error'
                    });
                }
            }
        }
    }

    static formatRows(rows, scopeFilters){
        return formatRowsWithScopeFilters(rows, scopeFilters);
    }

    static getScopeFilters(role){
        return roleScopeFilters(role);
    }

    _handleShowAllPolicies(){
        const {location: {search}} = this.props;
        const parsedSearch = queryString.parse(search);
        if(_has(parsedSearch, 'role')){
            const params = _omit(parsedSearch, 'role');
            this.props.history.push(`?${queryString.stringify(params)}`);
        }
    }

    _onDeleteGroupUser({id}){
        const {selectedRole: {uuid}} = this.state;
        let data = new FormData();
        const usersToBeRemoved = [id];
        for(let i = 0; i < usersToBeRemoved.length; i++){
            data.append('users[]', usersToBeRemoved[i]);
        }
        data.append('single', "0");

        this.props.editRole(uuid, data, EDIT_GROUP_WITH_USERS);
    }

    _onDeleteRole(){
        const {deleteRole} = this.props;
        const {selectedRole} = this.state;
        deleteRole(selectedRole.uuid);
        this.setState({confirmDeleteRole: false});
    }

    _handleDeleteRoleCancel(){
        this.setState({deletePolicyAlert: false});
    }
    _handleDeleteRoleConfirm(){
        this.setState({deletePolicyAlert: false});
    }

    _applyFilters(filters){
        const filtersString = filters.map(filter => {
            if(filter.label.startsWith('clock')) return formatTimeFilter(filter);
            return `${filter.label}|${filter.value}`;
        }).join();
        const {location: {search}, history} = this.props;
        const params = Object.assign({}, queryString.parse(search), {f: filtersString});
        history.push(`/roles?${queryString.stringify(params)}`);
    }

    _clearFilters(){
        const {location: {search}, history} = this.props;
        const params = _omit(queryString.parse(search), 'f');
        history.push(`/roles?${queryString.stringify(params)}`);
    }

    _onSortChange(columnKey, sortDir){
        const {location: {search}, history} = this.props;
        const params = Object.assign({}, queryString.parse(search), {s: `${columnKey}|${sortDir}`});
        history.push(`/roles?${queryString.stringify(params)}`);
    }

    _onPerPageChange(value){
        const {location: {search}, history} = this.props;
        const params = Object.assign({}, queryString.parse(search), {pp: value});
        history.push(`/roles?${queryString.stringify(params)}`);
    }

    _onSearchQueryChange({target: {value}}){
        this.setState(() => ({searchQuery: value}));
    }

    _onClearSearch(){
        const {location: {search}} = this.props;
        const parsedSearch = queryString.parse(search);
        if(_has(parsedSearch, 'q')){
            const params = _omit(parsedSearch, 'q');
            this.props.history.push(`?${queryString.stringify(params)}`);
        }else{
            this.setState({searchQuery: ''});
        }
    }

    _onSearch(){
        const {location: {search}} = this.props;
        const {searchQuery} = this.state;
        const params = Object.assign({}, queryString.parse(search), {q: searchQuery.trim()});
        searchQuery.trim() &&
        this.props.history.push(`/roles?${queryString.stringify(params)}`);
    }

    _onDeletePolicy({uuid: policyUUID, id}){
        const {selectedRole: {uuid}} = this.state;
        const {deletePolicy, editRole} = this.props;
        if(!uuid){
            deletePolicy(policyUUID);
        }else{
            let data = new FormData();
            const policiesBeingRemoved = [id];
            for(let i = 0; i < policiesBeingRemoved.length; i++){
                data.append('policies[]', policiesBeingRemoved[i]);
            }
            editRole(uuid, data, EDIT_GROUP_WITH_POLICIES);
        }
    }

    render(){

        const {loadingGroups, loadingPolicies, loadingUsers, userGroups, policies, groupUsers, authUser,
            userGroupsPagination: {current_page: currentPage, per_page: perPage, total, total_pages: totalPages},
            location: {search}, danglingUsers} = this.props;

        const addRoleActionAllowed = authUser.root ? true : Can.User(authUser).perform(ADD, ROLE, ROLES);
        const editRoleActionAllowed = authUser.root ? true : Can.User(authUser).perform(EDIT, ROLE, ROLES);
        const deleteRoleActionAllowed = authUser.root ? true : Can.User(authUser).perform(DELETE, ROLE, ROLES);

        const addPolicyActionAllowed = authUser.root ? true : Can.User(authUser).perform(ADD, POLICY, ROLES);
        const editPolicyActionAllowed = authUser.root ? true : Can.User(authUser).perform(EDIT, POLICY, ROLES);

        const {confirmDeleteRole, selectedRole, rolePolicies} = this.state;

        const nextPage = currentPage < totalPages;
        const prevPage = currentPage > 1;

        const queryParams = queryString.parse(search);
        const nextPageSearch = queryString.stringify(Object.assign({}, queryParams, {p: currentPage + 1}));
        const prevPageSearch = queryString.stringify(Object.assign({}, queryParams, {p: currentPage - 1}));

        const policiesToDisplay = selectedRole.uuid ? rolePolicies : policies;
        const availablePolicies = _differenceBy(policies, rolePolicies, 'id');

        const roleMenu = <Menu>
            <Link to={`/roles/${selectedRole.uuid}/edit${search}`}
                  className={`pt-menu-item pt-icon-standard pt-icon-edit 
                  ${!editRoleActionAllowed ? 'pt-disabled' : ''}`}>Edit Group</Link>
            <MenuItem
                disabled={!deleteRoleActionAllowed}
                onClick={() => this.setState({confirmDeleteRole: true})}
                intent={Intent.DANGER}
                icon={'trash'} text={'Delete Group'}/>
        </Menu>;

        return <div className="roles__wrapper">

            {addRoleActionAllowed && <Route path={`/roles/new`} component={NewRole}/>}
            {editRoleActionAllowed && <Route path={`/roles/:uuid/edit`} component={EditRole}/>}
            {addPolicyActionAllowed && <Route path={`/roles/policies/new`} component={NewPolicy}/>}
            {editPolicyActionAllowed && <Route path={`/roles/policies/:uuid/edit`} component={EditPolicy}/>}
            {editRoleActionAllowed && <Route path={`/roles/:uuid/users/new`} component={AddUsers}/>}

            <ConfirmAlert
                open={confirmDeleteRole}
                intent={Intent.DANGER}
                onConfirm={this._onDeleteRole}
                onCancel={() => this.setState({confirmDeleteRole: false})} />

            <div className="roles__toolbar">
                <Search
                    value={this.state.searchQuery || ''}
                    onQueryChange={this._onSearchQueryChange}
                    onQueryClear={this._onClearSearch}
                    onSearch={this._onSearch}/>

                <Filters
                    onClearClick={this._clearFilters}
                    onDoneClick={this._applyFilters}
                    filters={this.state.filters}
                    rows={this.state.filterRows}/>

                <ButtonGroup large={false}>
                    {addPolicyActionAllowed && (
                        <Tooltip disabled={!addPolicyActionAllowed} position={Position.LEFT} content="new policy">
                            <Link 
                                to={`/roles/policies/new${search}`}
                                className={`pt-button pt-icon-layer pt-intent-primary`}/>
                        </Tooltip>
                    )}
                    {addRoleActionAllowed && (
                        <Tooltip position={Position.LEFT} content="new role">
                            <Link
                                to={`/roles/new${search}`}
                                className={`pt-button pt-icon-plus pt-intent-primary`}/>
                        </Tooltip>
                    )}
                </ButtonGroup>
            </div>

            <div className="roles__content">
                <div className="list">
                    <header>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            {loadingGroups ? <Spinner className="pt-small"/> : <Icon icon="key"/>}
                            <Text className="devices__text">
                                Roles <small className="pt-text-muted">({total})</small>
                            </Text>
                        </div>

                        {(selectedRole.id && (
                            <div className="group__actions">
                                {(groupUsers.length > 0) || (danglingUsers.length > 0) ? (
                                    <label className="pt-control pt-switch pt-align-right view-users__toggle">
                                        <span style={{marginRight: 10}}>Users</span>
                                        <input
                                            checked={this.state.viewUsers}
                                            onChange={() => this.setState({viewUsers: !this.state.viewUsers})}
                                            type="checkbox" />
                                        <span className="pt-control-indicator"/>
                                    </label>
                                ) : null}
                                <ButtonGroup>
                                    <Popover content={roleMenu}>
                                        <Button intent={Intent.PRIMARY} className="pt-small" icon="more"/>
                                    </Popover>
                                </ButtonGroup>
                            </div>
                        ))}
                    </header>
                    <section className="table__section">
                        <RolesTable
                            data={userGroups}
                            onSortChange={sort => console.log(sort)}
                            colSortDirs={{}}/>
                    </section>
                    <footer>
                        <div className="per-page__wrapper">
                            <div className="pt-select pt-minimal bms-small">
                                <select value={perPage || ''}
                                        onChange={({target: {value}}) => this._onPerPageChange(Number.parseInt(value, 10))}>
                                    <option value="20">20</option>
                                    <option value="30">30</option>
                                    <option value="40">40</option>
                                </select>
                            </div>
                            <span> per page</span>
                        </div>
                        <div className="pt-control-group pt-small">
                            <Link to={`/roles/?${prevPageSearch}`}
                                  className={`pt-button pt-icon-chevron-left ${!prevPage && 'pt-disabled'}`}/>
                            <button className="pt-button pt-small pt-minimal pt-disabled">
                                {currentPage}
                            </button>
                            <Link to={`/roles/?${nextPageSearch}`}
                                  className={`pt-button pt-icon-chevron-right ${!nextPage && 'pt-disabled'}`}/>
                        </div>

                    </footer>
                </div>
                <div className="single">
                    <header>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            {loadingPolicies ? <Spinner className="pt-small"/> : <Icon icon={'layers'}/>}
                            <span style={{marginLeft: 10}}>Policies
                                <small style={{marginLeft: 5}} className="pt-text-muted">({policiesToDisplay.length})</small></span>
                            {selectedRole.uuid && (
                                <Text ellipsize style={{marginLeft: 5}}>
                                    <small className="pt-text-muted">found in </small>
                                    {selectedRole.name} Group
                                </Text>
                            )}
                        </div>
                        {selectedRole.uuid && [
                            <ButtonGroup key="all-policies" className="pt-small" large={false}>
                                <Tooltip content="all policies">
                                    <Button
                                        intent={Intent.NONE}
                                        className="pt-small"
                                        onClick={this._handleShowAllPolicies}
                                        icon={'menu-closed'}/>
                                </Tooltip>
                            </ButtonGroup>,

                            editRoleActionAllowed && (
                                <ButtonGroup key="group-policies-editing" className="pt-small" large={false}>
                                    <Tooltip
                                        disabled={this.state.openPolicies === OPEN_POLICY.AVAILABLE} content="add policy">
                                        <Button
                                            intent={Intent.PRIMARY}
                                            className="pt-small"
                                            onClick={() => {
                                                const openPolicies = this.state.openPolicies === OPEN_POLICY.DEFAULT
                                                    ? OPEN_POLICY.AVAILABLE
                                                    : OPEN_POLICY.DEFAULT;

                                                this.setState({openPolicies})
                                            }}
                                            icon={this.state.openPolicies === OPEN_POLICY.DEFAULT ? 'plus' : 'undo'}/>
                                    </Tooltip>
                                </ButtonGroup>
                            )
                        ]}
                    </header>
                    <section>
                        <div className="policies">
                            <DefaultPolicies
                                selectedRole={selectedRole}
                                onDeletePolicy={this._onDeletePolicy}
                                open={this.state.openPolicies === OPEN_POLICY.DEFAULT}
                                data={policiesToDisplay}/>

                            <AvailablePolicies
                                selectedRole={selectedRole}
                                onDeletePolicy={this._onDeletePolicy}
                                open={this.state.openPolicies === OPEN_POLICY.AVAILABLE}
                                data={availablePolicies}/>
                        </div>
                        {selectedRole.uuid && this.state.viewUsers && (
                            <div className="users">
                                <div className="users-header">
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                        {loadingUsers ? <Spinner className="pt-small"/> : <Icon icon="people"/>}
                                        <span style={{marginLeft: 10}}>Users</span>
                                    </div>
                                    {danglingUsers.length > 0 && editRoleActionAllowed ? (
                                        <ButtonGroup>
                                            <Tooltip disabled={danglingUsers.length < 1} content="add user">
                                                <Link
                                                    to={`/roles/${selectedRole.uuid}/users/new${search}`}
                                                    className={`${danglingUsers.length < 1 && 'pt-disabled'}
                                                pt-button pt-intent-primary pt-small pt-icon-new-person`}/>
                                            </Tooltip>
                                        </ButtonGroup>
                                    ) : null}
                                </div>
                                <div className="users-section">
                                    <UsersTable
                                        onDelete={user => this._onDeleteGroupUser(user)}
                                        deleteAllowed={editRoleActionAllowed}
                                        data={groupUsers}/>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    }

    static propTypes = {
        authUser: PropTypes.object.isRequired,

        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        OPERATION_FAILED: PropTypes.object.isRequired,
        OPERATION_SUCCESSFUL: PropTypes.object.isRequired,

        loadRoles: PropTypes.func.isRequired,
        loadPolicies: PropTypes.func.isRequired,
        loadGroupPolicies: PropTypes.func.isRequired,
        loadGates: PropTypes.func.isRequired,
        loadEntities: PropTypes.func.isRequired,
        loadActions: PropTypes.func.isRequired,
        loadGroupUsers: PropTypes.func.isRequired,
        deleteRole: PropTypes.func.isRequired,
        deletePolicy: PropTypes.func.isRequired,
        loadDanglingUsers: PropTypes.func.isRequired,
        editRole: PropTypes.func.isRequired,

        loadingUsers: PropTypes.bool.isRequired,
        loadingGroups: PropTypes.bool.isRequired,
        loadingPolicies: PropTypes.bool.isRequired,
        userGroupsPagination: PropTypes.object.isRequired,

        userGroups: PropTypes.array.isRequired,
        policies: PropTypes.array.isRequired,
        groupUsers: PropTypes.array.isRequired,
        danglingUsers: PropTypes.array.isRequired,
    };
}

const mapStateToProps = (
    {OPERATION_FAILED, OPERATION_SUCCESSFUL, loadingUsers, loadingGroups, loadingPolicies,
        userGroups, policies, groupUsers, userGroupsPagination, authUser, danglingUsers}) => (
        {OPERATION_FAILED, OPERATION_SUCCESSFUL, loadingPolicies, loadingGroups, loadingUsers,
            userGroups, policies, groupUsers, userGroupsPagination, authUser, danglingUsers});

const mapDispatchToProps = dispatch => bindActionCreators(
    {loadGates, loadEntities, loadActions, loadRoles, loadPolicies, loadGroupPolicies, editRole,
        loadGroupUsers, deleteRole, deletePolicy, loadDanglingUsers}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Roles);