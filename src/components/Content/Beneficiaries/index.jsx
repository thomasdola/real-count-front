import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {loadBeneficiaries} from '../../../actions/beneficiaryActions';
import {Button, ButtonGroup, Icon, Position, Spinner, Tooltip} from '@blueprintjs/core';
import {Active, Districts, Gender, IDTypes, Locations, Modules, Ranks, Regions, Valid} from '../../Common/filterRows';
import Filters, {parseFilters} from '../../Common/Filters';
import {BeneficiariesTable} from './Table';
import {Link, withRouter} from 'react-router-dom';
import queryString from 'query-string';
import _isEqual from 'lodash/isEqual';
import _omit from 'lodash/omit';
import _has from 'lodash/has';
import _unionBy from 'lodash/unionBy';
import _find from 'lodash/find';
import {parseSort} from "../../Common/Table/helpers";
import './index.css';
import Can from "../../../helpers/Can";
import {BENEFICIARIES} from '../../../api/constants/Gates';
import {BENEFICIARY} from '../../../api/constants/Entities';
import {EDIT} from '../../../api/constants/Actions';

export const Search = ({value, onQueryChange, onQueryClear, onSearch}) => {
    const _onKeyPress = ({keyCode}) => {
        if(keyCode === 13){
            onSearch();
        }
    };

    return (
        <div className="pt-input-group" style={{flexBasis: '500px'}}>
            <input
                onKeyDown={_onKeyPress}
                value={value}
                onChange={onQueryChange} 
                type="text" className="pt-input" placeholder="Search" />

                {value && 
                    <button onClick={onQueryClear} 
                    className={`pt-button pt-minimal pt-intent-danger pt-icon-small-cross`}/>
                }

                <button onClick={onSearch} 
                className={`pt-button pt-intent-primary pt-icon-search`}/>
        </div>
    );
};

export const roleScopeFilters = ({level: {type}, scope}) => {
    switch(type){
        case "location":
            return [{label: 'region', value: scope.region_id.toString()},
                    {label: 'district', value: scope.district_id.toString()},
                    {label: 'location', value: scope.location_id.toString()}];
        case "district":
            return [{label: 'region', value: scope.region_id.toString()},
                {label: 'district', value: scope.district_id.toString()}];
        case "region":
            return [{label: 'region', value: scope.region_id.toString()}];
        default:
            return [];
    }
};

export const formatRowsWithScopeFilters = (rows, scopeFilters) => {
    return rows.map(row => {
        const {label, body: {props}, body} = row;
        const scopeFilter = _find(scopeFilters, {label: label.toLocaleLowerCase()});
        if(scopeFilter){
            return {...row,
                isExpanded: true,
                disabled: true,
                body: {...body,
                    props: {...props,
                        value: scopeFilter.value, disabled: true
                    }
                }
            };
        }else{
            return row;
        }
    });
};


export function stringifyFilters(filters) {
    return filters.map(({label, value}) => `${label}|${value}`).join();
}

class Beneficiaries extends React.Component{

    constructor(props){
        super(props);

        this._onSortChange = this._onSortChange.bind(this);
        this._onPerPageChange = this._onPerPageChange.bind(this);
        this._onSearchQueryChange = this._onSearchQueryChange.bind(this);
        this._onSearch = this._onSearch.bind(this);
        this._applyFilters = this._applyFilters.bind(this);
        this._clearFilters = this._clearFilters.bind(this);
        this._onClearSearch = this._onClearSearch.bind(this);
    }

    state = {
        searchQuery: "",
        colSortDirs: {},
        filterRows: [
            {
                label: "Region",
                isExpanded: false,
                body: {
                    component: Regions,
                    props: { value: '', disabled: false }
                }
            },
            {
                label: "District",
                isExpanded: false,
                body: {
                    component: Districts,
                    props: { value: '', small: true, dataList: true }
                }
            },
            {
                label: "Location",
                isExpanded: false,
                body: {
                    component: Locations,
                    props: { value: '', small: true, dataList: true }
                }
            },
            {
                label: "Module",
                isExpanded: false,
                body: {
                    component: Modules,
                    props: { value: '' }
                }
            },
            {
                label: "Rank",
                isExpanded: false,
                body: {
                    component: Ranks,
                    props: { value: '' }
                }
            },
            {
                label: "Identification",
                isExpanded: false,
                body: {
                    component: IDTypes,
                    props: { value: '' }
                }
            },
            {
                label: "Gender",
                isExpanded: false,
                body: {
                    component: Gender,
                    props: { value: '' }
                }
            },
            {
                label: "Valid",
                isExpanded: false,
                body: {
                    component: Valid,
                    props: { value: '' }
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
        filters: []
    };

    componentDidMount(){
        const {loadBeneficiaries, location: {search}, authUser: {role, root}} = this.props;
        const roleScopeFilters = Beneficiaries.getScopeFilters(role);
        let params = queryString.parse(search);
        let newFilters = params.f ? parseFilters(params.f) : [];
        newFilters = _unionBy(roleScopeFilters, newFilters, 'label');
        params = root ? params : {...params, f: stringifyFilters(newFilters)};
        loadBeneficiaries(params);
    }

    static getDerivedStateFromProps(nextProps, prevState){
        const {location: {search: newSearch}, authUser: {role, root}} = nextProps;
        const {searchQuery, colSortDirs, filters, filterRows: oldFilterRows} = prevState;
        const roleScopeFilters = Beneficiaries.getScopeFilters(role);
        const {q, f, s} = queryString.parse(newSearch);
        const newQuery = q || '';
        const newSorts = s ? parseSort(s) : {};
        let newFilters = f ? parseFilters(f) : [];

        const filterRows = root ? oldFilterRows : Beneficiaries.formatRows(oldFilterRows, roleScopeFilters);

        newFilters = root ? newFilters : _unionBy(roleScopeFilters, newFilters, 'label');

        if(_isEqual(searchQuery, q) && _isEqual(colSortDirs, newSorts)
            && _isEqual(filters, newFilters) && _isEqual(oldFilterRows, filterRows))
            return null;

        return {
            searchQuery: newQuery,
            colSortDirs: newSorts,
            filters: newFilters,
            filterRows
        };
    }

    static formatRows(rows, scopeFilters){
        return formatRowsWithScopeFilters(rows, scopeFilters);
    }

    static getScopeFilters(role){
        return roleScopeFilters(role);
    }

    componentDidUpdate(prevProps){
        const {location: {search: oldSearch}} = prevProps;
        const {location: {search: newSearch}, loadBeneficiaries} = this.props;
        const params = queryString.parse(newSearch);
        console.log('search params', params, stringifyFilters(this.state.filters));

        if(!_isEqual(params, queryString.parse(oldSearch))){
            loadBeneficiaries({...queryString.parse(newSearch), f: stringifyFilters(this.state.filters)});
        }
    }

    _applyFilters(filters){
        const filtersString = stringifyFilters(filters);
        const {location: {search}, history} = this.props;
        const params = Object.assign({}, queryString.parse(search), {f: filtersString});
        history.push(`?${queryString.stringify(params)}`);
    }

    _clearFilters(){
        const {location: {search}, history} = this.props;
        const params = _omit(queryString.parse(search), 'f');
        history.push(`?${queryString.stringify(params)}`);
    }

    _onSortChange(columnKey, sortDir){
        const {location: {search}, history} = this.props;
        const params = Object.assign({}, queryString.parse(search), {s: `${columnKey}|${sortDir}`});
        history.push(`?${queryString.stringify(params)}`);
    }

    _onPerPageChange(value){
        const {location: {search}, history} = this.props;
        const params = Object.assign({}, queryString.parse(search), {pp: value});
        history.push(`?${queryString.stringify(params)}`);
    }

    _onSearchQueryChange({target: {value}}){
        this.setState(() => ({searchQuery: value}));
    }

    _onSearch(){
        const {location: {search}} = this.props;
        const {searchQuery} = this.state;
        const params = Object.assign({}, queryString.parse(search), {q: searchQuery.trim()});
        searchQuery.trim() &&
        this.props.history.push(`?${queryString.stringify(params)}`);
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
        const {beneficiaries,
            beneficiariesPagination: {current_page: currentPage, total, per_page: perPage, total_pages: totalPages},
            loadingBeneficiaries, location: {search}, authUser } = this.props;

        const nextPage = currentPage < totalPages;
        const prevPage = currentPage > 1;

        const {filterRows, filters, searchQuery} = this.state;

        const queryParams = queryString.parse(search);
        const nextPageSearch = {...queryParams, p: currentPage + 1};
        const prevPageSearch = {...queryParams, p: currentPage - 1};

        const editActionAllowed = Can.User(authUser).perform(EDIT, BENEFICIARY, BENEFICIARIES);

        return <div className="beneficiaries__wrapper">

            <div className="beneficiaries__toolbar">

                <Search 
                    value={searchQuery} 
                    onQueryChange={this._onSearchQueryChange} 
                    onQueryClear={this._onClearSearch} 
                    onSearch={this._onSearch}/>

                <Filters
                    onClearClick={this._clearFilters}
                    onDoneClick={this._applyFilters}
                    filters={filters}
                    rows={filterRows}/>

                <ButtonGroup>
                    <Tooltip disabled={!prevPage}  content={"prev page"} position={Position.BOTTOM}>
                        <Link to={`?${prevPageSearch}`}
                                className={`pt-button pt-icon-chevron-left ${!prevPage && 'pt-disabled'}`}/>
                    </Tooltip>
                    <Button disabled text={currentPage}/>
                    <Tooltip disabled={!nextPage} content={"next page"} position={Position.BOTTOM}>
                        <Link disabled={!nextPage} to={`?${nextPageSearch}`}
                                className={`pt-button pt-icon-chevron-right ${!nextPage && 'pt-disabled'}`}/>
                    </Tooltip>
                </ButtonGroup>
            </div>

            <div className="beneficiaries__content">
                <section>
                    <header>
                        <div>
                            {loadingBeneficiaries ? <Spinner className="pt-small"/> : <Icon icon="walk"/>}

                            <div style={{fontVariant: 'small-caps', marginLeft: 5}}>
                                <span style={{fontWeight: 'bold'}}>BENEFICIARIES</span> 
                                <span style={{padding: '0 5px'}}>→</span>
                                <span className="pt-text-muted">{total}</span>
                            </div>
                        </div>
                        <div style={{fontVariant: 'small-caps'}} className="per-page__wrapper">
                            <div className="pt-select pt-minimal bms-small">
                                <select 
                                    value={perPage}
                                    onChange={({target: {value}}) => this._onPerPageChange(Number.parseInt(value, 10))}>
                                    <option value="20">20</option>
                                    <option value="30">30</option>
                                    <option value="40">40</option>
                                </select>
                            </div>
                            <span>per page</span>
                        </div>
                    </header>
                    <section>
                        <BeneficiariesTable
                            onSortChange={this._onSortChange}
                            colSortDirs={this.state.colSortDirs}
                            allowAction={editActionAllowed}
                            data={beneficiaries}
                        />
                    </section>
                </section>
                
            </div>
        </div>
    }


    static propTypes = {
        authUser: PropTypes.object.isRequired,
        beneficiaries: PropTypes.array.isRequired,
        beneficiariesPagination: PropTypes.object.isRequired,
        loadBeneficiaries: PropTypes.func.isRequired,
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        loadingBeneficiaries: PropTypes.bool.isRequired
    };
}
const mapStateToProps = ({authUser, beneficiaries, beneficiariesPagination, loadingBeneficiaries}) => ({
    authUser, beneficiaries, beneficiariesPagination, loadingBeneficiaries
});
const mapDispatchToProps = dispatch => bindActionCreators({loadBeneficiaries}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Beneficiaries));