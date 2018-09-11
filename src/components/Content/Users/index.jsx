import React from 'react';
import {Icon, Spinner, Text} from '@blueprintjs/core';
import {Link, Route} from 'react-router-dom';
import {NewUser, User} from './Modal';
import {UsersTable} from './Table';
import '../../Common/Table/table.css';
import './index.css';
import {Active, Districts, Regions} from "../../Common/filterRows";
import Filters, {parseFilters} from '../../Common/Filters';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import queryString from "query-string";
import {parseSort} from "../../Common/Table/helpers";
import _isEqual from "lodash/isEqual";
import {formatTimeFilter} from "../../Common/filterRows/Time";
import _omit from "lodash/omit";
import {loadRoles} from "../../../actions/roleActions";
import {loadUsers} from "../../../actions/userActions";
import {loadPolicies} from "../../../actions/policyActions";
import {Search} from "../Beneficiaries";
import _has from "lodash/has";
import {ADD_USER, DELETE_USER, EDIT_USER} from "../../../actions/types";

import {USERS} from '../../../api/constants/Gates';
import {USER} from '../../../api/constants/Entities';
import {ADD} from '../../../api/constants/Actions';
import Can from "../../../helpers/Can";
import _unionBy from 'lodash/unionBy';
import {formatRowsWithScopeFilters, stringifyFilters, roleScopeFilters} from '../Beneficiaries';


class Users extends React.Component{

    constructor(props){
        super(props);

        this._applyFilters = this._applyFilters.bind(this);
        this._clearFilters = this._clearFilters.bind(this);
        this._onSortChange = this._onSortChange.bind(this);
        this._onPerPageChange = this._onPerPageChange.bind(this);
        this._onSearchQueryChange = this._onSearchQueryChange.bind(this);
        this._onClearSearch = this._onClearSearch.bind(this);
        this._onSearch = this._onSearch.bind(this);
    }

    state = {
        colSortDirs: {},
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
            },
            {
                label: "Active",
                isExpanded: false,
                body: {
                    component: Active,
                    props: { value: '' }
                }
            }
        ],
        filters: [],
        searchQuery: '',
    };

    componentDidMount(){
        const {loadUsers, loadRoles, loadPolicies, location: {search}, authUser: {root, role}} = this.props;
        let params = queryString.parse(search);

        let newFilters = params.f ? parseFilters(params.f) : [];
        
        const roleScopeFilters = Users.getScopeFilters(role);

        newFilters = _unionBy(roleScopeFilters, newFilters, 'label');
        params = root ? params : {...params, f: stringifyFilters(newFilters)};

        loadUsers(params);
        loadRoles({f: 'policies|1'});
        loadPolicies();
    }

    static getDerivedStateFromProps(nextProps, prevState){
        const {location: {search: newSearch}, authUser: {root, role}} = nextProps;
        const {searchQuery, colSortDirs, filters, filterRows: oldFilterRows} = prevState;
        const {q, f, s} = queryString.parse(newSearch);
        const newQuery = q || '';
        const newSorts = s ? parseSort(s) : {};
        let newFilters = f ? parseFilters(f) : [];

        const roleScopeFilters = Users.getScopeFilters(role);
        
        const filterRows = root ? oldFilterRows : Users.formatRows(oldFilterRows, roleScopeFilters);
        
        newFilters = root ? newFilters : _unionBy(roleScopeFilters, newFilters, 'label');

        if(_isEqual(searchQuery, q) && _isEqual(colSortDirs, newSorts) && _isEqual(filters, newFilters)){
            return null;
        }

        return {
            searchQuery: newQuery,
            colSortDirs: newSorts,
            filters: newFilters,
            filterRows
        };
    }

    componentDidUpdate(prevProps){
        const {location: {search: oldSearch}} = prevProps;
        const {location: {search: newSearch}, loadUsers} = this.props;

        const params = queryString.parse(newSearch);
        if(!_isEqual(queryString.parse(newSearch), queryString.parse(oldSearch))){
            loadUsers(params);
        }

        const {OPERATION_SUCCESSFUL: OLD_OPERATION_SUCCESSFUL} = prevProps;
        const {OPERATION_SUCCESSFUL} = this.props;

        if(!_isEqual(OLD_OPERATION_SUCCESSFUL, OPERATION_SUCCESSFUL)){
            const {action} = OPERATION_SUCCESSFUL;

            if(action === ADD_USER || action === EDIT_USER || action === DELETE_USER){
                loadUsers(params);
            }
        }
    }

    static formatRows(rows, scopeFilters){
        return formatRowsWithScopeFilters(rows, scopeFilters);
    }

    static getScopeFilters(role){
        return roleScopeFilters(role);
    }

    _applyFilters(filters){
        const filtersString = filters.map(filter => {
            if(filter.label.startsWith('clock')) return formatTimeFilter(filter);
            return `${filter.label}|${filter.value}`;
        }).join();
        const {location: {search}, history} = this.props;
        const params = Object.assign({}, queryString.parse(search), {f: filtersString});
        history.push(`/users?${queryString.stringify(params)}`);
    }

    _clearFilters(){
        const {location: {search}, history} = this.props;
        const params = _omit(queryString.parse(search), 'f');
        history.push(`/users?${queryString.stringify(params)}`);
    }

    _onSortChange(columnKey, sortDir){
        const {location: {search}, history} = this.props;
        const params = Object.assign({}, queryString.parse(search), {s: `${columnKey}|${sortDir}`});
        history.push(`/users?${queryString.stringify(params)}`);
    }

    _onPerPageChange(value){
        const {location: {search}, history} = this.props;
        const params = Object.assign({}, queryString.parse(search), {pp: value});
        history.push(`/users?${queryString.stringify(params)}`);
    }

    _onSearchQueryChange({target: {value}}){
        this.setState(() => ({searchQuery: value}));
    }

    _onSearch(){
        const {location: {search}} = this.props;
        const {searchQuery} = this.state;
        const params = Object.assign({}, queryString.parse(search), {q: searchQuery.trim()});
        searchQuery.trim() &&
        this.props.history.push(`/users?${queryString.stringify(params)}`);
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

    render(){
        const {loadingUsers, users,
            usersPagination: {current_page: currentPage, per_page: perPage, total, total_pages: totalPages},
            location: {search}, authUser} = this.props;

        const addActionAllowed = authUser.root ? true : Can.User(authUser).perform(ADD, USER, USERS);

        const nextPage = currentPage < totalPages;
        const prevPage = currentPage > 1;

        const nextPageSearch = queryString.stringify(Object.assign({}, queryString.parse(search), {p: currentPage + 1}));
        const prevPageSearch = queryString.stringify(Object.assign({}, queryString.parse(search), {p: currentPage - 1}));

        return <div className="users__wrapper">

            <Route path="/users/:uuid/edit" component={User}/>
            {addActionAllowed && <Route path="/users/new" component={NewUser}/>}

            <div className="users__toolbar">
                <Search
                    value={this.state.searchQuery || ''}
                    onQueryChange={this._onSearchQueryChange}
                    onQueryClear={this._onClearSearch}
                    onSearch={this._onSearch}/>

                <Filters
                    rows={this.state.filterRows}
                    filters={this.state.filters}
                    onDoneClick={this._applyFilters}
                    onClearClick={this._clearFilters}/>

                {addActionAllowed && <Link
                    to="/users/new"
                    className="pt-button pt-intent-primary pt-icon-new-person"/>}

            </div>

            <div className="users__content">
                <section>
                    <header>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            {loadingUsers ? <Spinner className="pt-small"/> : <Icon icon="people"/>}
                            <Text className="devices__text">
                                Users <small className="pt-text-muted">({total})</small>
                            </Text>
                        </div>
                        <div className="per-page__wrapper">
                            <div className="pt-select bms-small">
                                <select value={perPage || ''}
                                        onChange={({target: {value}}) => this._onPerPageChange(Number.parseInt(value, 10))}>
                                    <option value="20">20</option>
                                    <option value="30">30</option>
                                    <option value="40">40</option>
                                </select>
                            </div>
                            <span>per page</span>
                        </div>

                        <div className="pt-control-group pt-small">
                            <Link to={`/users/?${prevPageSearch}`}
                                  className={`pt-button pt-icon-chevron-left ${!prevPage && 'pt-disabled'}`}/>
                            <button className="pt-button pt-small pt-minimal pt-disabled">
                                {currentPage}
                            </button>
                            <Link to={`/users/?${nextPageSearch}`}
                                  className={`pt-button pt-icon-chevron-right ${!nextPage && 'pt-disabled'}`}/>
                        </div>
                    </header>
                    <section>
                        <UsersTable
                            data={users}
                            onSortChange={this._onSortChange}
                            colSortDirs={this.state.colSortDirs}
                        />
                    </section>
                </section>
                
            </div>
        </div>
    }

    static propTypes = {
        authUser: PropTypes.object.isRequired,
        OPERATION_SUCCESSFUL: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,

        usersPagination: PropTypes.object.isRequired,

        loadRoles: PropTypes.func.isRequired,
        loadUsers: PropTypes.func.isRequired,
        loadPolicies: PropTypes.func.isRequired,

        loadingUsers: PropTypes.bool.isRequired,

        users: PropTypes.array.isRequired,
        roles: PropTypes.array.isRequired,
    };
}

const mapStateToProps = ({OPERATION_SUCCESSFUL, loadingUsers, users, userGroups, authUser, usersPagination}) => (
    {OPERATION_SUCCESSFUL, usersPagination, loadingUsers, users, roles: userGroups, authUser});
const mapDispatchToProps = dispatch => bindActionCreators({loadUsers, loadRoles, loadPolicies}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Users);