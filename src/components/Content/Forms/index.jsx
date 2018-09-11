import React from 'react';
import PropTypes from 'prop-types';
import {Button, Classes, Icon, Intent, NumericInput, Spinner, Text} from '@blueprintjs/core';
import {Link, Route, withRouter} from 'react-router-dom';
import Regions from "../../Common/filterRows/Regions";
import Districts from "../../Common/filterRows/Districts";
import Locations from "../../Common/filterRows/Locations";
import Modules from "../../Common/filterRows/Modules";
import Ranks from "../../Common/filterRows/Ranks";
import Filters, {parseFilters} from '../../Common/Filters';
import {Form} from './Modal';
import {FormsTable} from './Table';
import {bindActionCreators} from 'redux';
import _find from 'lodash/find';
import {
    clearPreset,
    closeDownloadFormAlert,
    deleteFullyEnrolled,
    generateForms,
    loadFormGroups
} from '../../../actions/formGroupActions';
import {
    initSocketListeners,
    onFormsGenerated,
    onFormsGenerationFailed,
    stopSocketListeners
} from '../../../actions/socket/formActions';
import {connect} from 'react-redux';
import {reset} from "../../../actions/operationActions";
import {browserDownload} from "../../../actions/downloadActions";
import './index.css';
import queryString from "query-string";
import _isEqual from "lodash/isEqual";
import _omit from "lodash/omit";
import _has from 'lodash/has';
import {parseSort} from "../../Common/Table/helpers";
import {formatRowsWithScopeFilters, roleScopeFilters, Search, stringifyFilters} from '../Beneficiaries';
import {isFormValid} from '../Enrollment';
import Toaster from "../../Common/Toaster";
import {GENERATE_FORMS, PDF} from "../../../actions/types";
import {Operating} from "../Backups";
import _unionBy from 'lodash/unionBy';

class Forms extends React.Component{
    constructor(props){
        super(props);

        this._applyFilters = this._applyFilters.bind(this);
        this._clearFilters = this._clearFilters.bind(this);
        this._generateForms = this._generateForms.bind(this);
        this._onFormInputChange = this._onFormInputChange.bind(this);
        this._onPerPageChange = this._onPerPageChange.bind(this);
        this._onSearchQueryChange = this._onSearchQueryChange.bind(this);
        this._onClearSearch = this._onClearSearch.bind(this);
        this._onSortChange = this._onSortChange.bind(this);
        this._onSearch = this._onSearch.bind(this);
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
                    props: { value: '' , small: true, dataList: true }
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
            }
        ],
        filters: [],
        form: {
            region: "",
            district: "",
            location: "",
            module: "",
            rank: "",
            count: 1,
            title: ""
        },
        searchQuery: "",
        colSortDirs: {}
    };

    componentDidMount(){
        const {loadFormGroups, location: {search}, socket, authUser, onFormsGenerated, 
        onFormsGenerationFailed, authUser: {role, root}} = this.props;
        
        let params = queryString.parse(search);
        let newFilters = params.f ? parseFilters(params.f) : [];

        const roleScopeFilters = Forms.getScopeFilters(role);

        newFilters = _unionBy(roleScopeFilters, newFilters, 'label');
        params = root ? params : {...params, f: stringifyFilters(newFilters)};
        loadFormGroups(params);

        initSocketListeners(socket, { authUser, onFormsGenerationFailed, onFormsGenerated });
    }

    static getDerivedStateFromProps(nextProps, prevState){
        const {location: {search: newSearch}, formPreset, authUser: {root, role: {scope}, role}} = nextProps;
        const {searchQuery, colSortDirs, filters, form, filterRows: oldFilterRows} = prevState;
        const {q, f, s} = queryString.parse(newSearch);
        const newQuery = q || '';
        const newSorts = s ? parseSort(s) : {};
        let newFilters = f ? parseFilters(f) : [];

        const oldPreset = Object.assign({},
            {region: form.region, district: form.district, location: form.location, module: form.module,
                rank: form.rank, count: form.count});
        const newPreset = Object.assign({},
            {region: formPreset.region, district: formPreset.district, location: formPreset.location,
            module: formPreset.module, rank: formPreset.rank, count: formPreset.count});

        const roleScopeFilters = Forms.getScopeFilters(role);

        const filterRows = root ? oldFilterRows : Forms.formatRows(oldFilterRows, roleScopeFilters);
        
        newFilters = root ? newFilters : _unionBy(roleScopeFilters, newFilters, 'label');

        if(_isEqual(searchQuery, q)
            && _isEqual(colSortDirs, newSorts)
            && _isEqual(filters, newFilters)
            && _isEqual(oldPreset, newPreset)
            && _isEqual(oldFilterRows, filterRows)
        )
            return null;        

        return {
            searchQuery: newQuery,
            colSortDirs: newSorts,
            filters: newFilters,
            filterRows,
            form: {
                ...form,
                region: !root ? scope.region_id : formPreset.region,
                district: !root ? scope.district_id : formPreset.district,
                location: !root ? scope.location_id : formPreset.location,
                module: formPreset.module,
                rank: formPreset.rank,
                count: formPreset.count
            }
        }
    }

    componentDidUpdate(prevProps){
        const {location: {search: oldSearch}, OPERATION_SUCCESSFUL: OLD_OPERATION_SUCCESSFUL,
            OPERATION_FAILED: OLD_OPERATION_FAILED} = prevProps;

        const {location: {search: newSearch}, loadFormGroups, OPERATION_SUCCESSFUL, OPERATION_FAILED} = this.props;

        const params = queryString.parse(newSearch);
        if(!_isEqual(params, queryString.parse(oldSearch))){
            loadFormGroups(params);
        }

        if(!_isEqual(OLD_OPERATION_SUCCESSFUL, OPERATION_SUCCESSFUL)){
            const {action, data: {scheduled, group}} = OPERATION_SUCCESSFUL;
            if(action === GENERATE_FORMS && !scheduled){
                loadFormGroups(params);
                Toaster.show({
                    message: `Generated Successfully 😃`,
                    intent: Intent.SUCCESS,
                    timeout: 0,
                    action: {
                        onClick: () => Forms.download(group),
                        icon: 'cloud-download',
                        text: 'download'
                    },
                    icon: 'tick' });
            }
        }

        if(!_isEqual(OLD_OPERATION_FAILED, OPERATION_FAILED)){
            if(OPERATION_FAILED.action === GENERATE_FORMS){
                this.props.reset();
                console.log(OPERATION_FAILED.data);
                Toaster.show({
                    message: `Could Not Generate Forms 😞`,
                    intent: Intent.DANGER,
                    icon: 'error'
                });
            }
        }
    }

    componentWillUnmount(){
        const {socket, authUser} = this.props;
        stopSocketListeners(socket, {authUser})
    }

    static formatRows(rows, scopeFilters){
        return formatRowsWithScopeFilters(rows, scopeFilters);
    }

    static getScopeFilters(role){
        return roleScopeFilters(role);
    }

    _generateForms(e){
        const {form: {count, region, district, module, rank, location, title}} = this.state;
        e.preventDefault();

        let data = new FormData();
        data.append("number_of_form", count);
        data.append("module_id", module);
        data.append("rank_id", rank);
        data.append("region_id", region);
        data.append("district_id", district);
        data.append("location_id", location);
        data.append("filename", title);

        this.props.generateForms(data);
    }

    static download({path}){
        browserDownload(path, PDF, true);
    }

    _applyFilters(filters){
        const filtersString = filters.map(({label, value}) => `${label}|${value}`).join();
        const {location: {search}, history} = this.props;
        const params = Object.assign({}, queryString.parse(search), {f: filtersString});
        const query = Object.values(params).length > 0
            ? `?${queryString.stringify(params)}` : '';
        history.push(`/forms${query}`);
    }

    _clearFilters(){
        const {location: {search}, history} = this.props;
        const params = _omit(queryString.parse(search), 'f');
        const query = Object.values(params).length > 0
            ? `?${queryString.stringify(params)}` : '';
        history.push(`/forms${query}`);
    }

    _onSortChange(columnKey, sortDir){
        const {location: {search}, history} = this.props;
        const params = Object.assign({}, queryString.parse(search), {s: `${columnKey}|${sortDir}`});
        const query = Object.values(params).length > 0
            ? `?${queryString.stringify(params)}` : '';
        history.push(`/forms${query}`);
    }

    _onPerPageChange(value){
        const {location: {search}, history} = this.props;
        const params = Object.assign({}, queryString.parse(search), {pp: value});
        const query = Object.values(params).length > 0
            ? `?${queryString.stringify(params)}` : '';
        history.push(`/forms${query}`);
    }

    _onSearchQueryChange({target: {value}}){
        this.setState(() => ({searchQuery: value}));
    }

    _onClearSearch(){
        const {location: {search}} = this.props;
        const parsedSearch = queryString.parse(search);
        if(_has(parsedSearch, 'q')){
            const params = _omit(parsedSearch, 'q');
            const query = Object.values(params).length > 0
                ? `?${queryString.stringify(params)}` : '';
            this.props.history.push(`/forms${query}`);
        }else{
            this.setState({searchQuery: ''});
        }
    }

    _onSearch(){
        const {location: {search}} = this.props;
        const {searchQuery} = this.state;
        const params = Object.assign({}, queryString.parse(search), {q: searchQuery.trim()});
        const query = Object.values(params).length > 0
            ? `?${queryString.stringify(params)}` : '';
        searchQuery.trim() &&
        this.props.history.push(`/forms${query}`);
    }

    static _onlyOne({name}){
        return name === "SUPERVISOR"
            || name === "GANG LEADER"
            || name === "TEAM LEADER";

    }

    _onFormInputChange(name, value){
        let {form} = this.state;

        if(name === "count"){
            const rankObj = _find(this.props.ranks, {id: Number.parseInt(form.rank, 10)});
            const onlyOneAllowed = rankObj ? Forms._onlyOne(rankObj) : false;
            const count = onlyOneAllowed ? 1 : value;
            form = {...form, count};
        }else if(name === "rank"){
            const rankObj = _find(this.props.ranks, {id: Number.parseInt(value, 10)});
            const onlyOneAllowed = rankObj ? Forms._onlyOne(rankObj) : false;
            const count = onlyOneAllowed ? 1 : form.count;
            form = {...form, count, [name]: value};
        }else{
            form = {...form, [name]: value};
        }

        this.setState(() => ({form}));
    }

    render(){
        const {forms, location: {search}, generatingForms, loadingForms, formsPagination: 
                {current_page: currentPage, total, per_page: perPage, total_pages: totalPages},
            OPERATION_SUCCESSFUL, OPERATION_FAILED, authUser} = this.props;

        const {form} = this.state;

        const nextPage = currentPage < totalPages;
        const prevPage = currentPage > 1;

        const nextPageSearch = queryString.stringify(Object.assign({}, queryString.parse(search), {p: currentPage + 1}));
        const prevPageSearch = queryString.stringify(Object.assign({}, queryString.parse(search), {p: currentPage - 1}));

        const disableGenerateButton = !isFormValid(form);

        const disableLocationsSelection = type =>  _isEqual(type, authUser.role.level.type) && !authUser.root;

        return <div className="forms__wrapper">

            <Route path="/forms/:uuid" component={Form}/>

            <Operating
                content={"Generating Forms... 😃"}
                intent={Intent.SUCCESS}
                on={OPERATION_SUCCESSFUL.data.scheduled && OPERATION_FAILED.action !== GENERATE_FORMS}/>

            <div className="forms__toolbar">

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

            </div>

            <div className="forms__content">
                <div className="list">
                    <header>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            {loadingForms ? <Spinner className="pt-small"/> : <Icon icon="history"/>}
                            <Text className="forms__text">
                                Forms history <small>({total})</small>
                            </Text>
                        </div>
                    </header>
                    <section className="table__section">
                        <FormsTable
                            onSortChange={this._onSortChange}
                            colSortDirs={this.state.colSortDirs}
                            data={forms}/>
                    </section>
                    <footer>
                        <div className="per-page__wrapper">
                            <div className="pt-select pt-minimal bms-small">
                                <select
                                    value={perPage || ''}
                                    onChange={({target: {value}}) => this._onPerPageChange(value)}>
                                    <option value="20">20</option>
                                    <option value="30">30</option>
                                    <option value="40">40</option>
                                </select>
                            </div>
                            <span> per page</span>
                        </div>
                        <div className="pt-button-group pt-small">
                            <Link
                                to={`/forms/?${prevPageSearch}`}
                                className={`pt-button pt-icon-chevron-left ${!prevPage && 'pt-disabled'}`}/>
                            <Button disabled text={currentPage}/>
                            <Link
                                to={`/forms/?${nextPageSearch}`}
                                className={`pt-button pt-icon-chevron-right ${!nextPage && 'pt-disabled'}`}/>
                        </div>

                    </footer>
                </div>
                <div className="form">
                    <form onSubmit={this._generateForms} className={`wrapper ${Classes.ELEVATION_2}`}>
                        <header>
                            <div>
                                <Icon intent={Intent.NONE} icon="properties"/>
                                <span style={{marginLeft: 10}}>new form</span>
                            </div>
                            <Button 
                                disabled={disableGenerateButton}
                                loading={generatingForms} 
                                intent={Intent.PRIMARY}
                                type={'submit'} icon="tick" 
                                className="pt-small" text="Generate"/>
                        </header>
                        <section className="new-form">
                            <label className="pt-label">
                                Region
                                <Regions
                                    disabled={disableLocationsSelection('region') 
                                        || disableLocationsSelection('district')
                                        || disableLocationsSelection('location')}
                                    onChange={({value}) => this._onFormInputChange("region", value)}
                                    value={form.region || ''}
                                    small={false}/>
                            </label>
                            <label className="pt-label">
                                District
                                <Districts
                                    disabled={disableLocationsSelection('district')
                                        || disableLocationsSelection('location')}
                                    dependent={true}
                                    onChange={({value}) => this._onFormInputChange("district", value)}
                                    value={form.district || ''}
                                    small={false}/>
                            </label>
                            <label className="pt-label">
                                Location
                                <Locations
                                    disabled={disableLocationsSelection('location')}
                                    dependent={true}
                                    onChange={({value}) => this._onFormInputChange("location", value)}
                                    value={form.location || ''}
                                    small={false}/>
                            </label>
                            <label className="pt-label">
                                Module
                                <Modules
                                    required
                                    onChange={({value}) => this._onFormInputChange("module", value)}
                                    value={form.module || ''}
                                    small={false}/>
                            </label>
                            <label className="pt-label">
                                Rank
                                <Ranks
                                    required
                                    onChange={({value}) => this._onFormInputChange("rank", value)}
                                    value={form.rank || ''}
                                    small={false}/>
                            </label>
                            <NumericInput 
                                min={1}
                                placeholder="How Many to generate?"
                                className="pt-fill"
                                onValueChange={(vN, vS) => this._onFormInputChange("count", vS)}
                                value={form.count || ''}
                                clampValueOnBlur/>

                            <label style={{marginTop: 15}} className="pt-label">
                                Title
                                <input 
                                    value={this.state.form.title || ''} 
                                    onChange={({target: {value}}) => this._onFormInputChange("title", value)}
                                    className="pt-input pt-fill" type="text" dir="auto" />
                            </label>
                        </section>
                    </form>
                </div>
            </div>
        </div>
    }

    static propTypes = {
        authUser: PropTypes.object.isRequired,
        socket: PropTypes.object.isRequired,
        formPreset: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        formsPagination: PropTypes.object.isRequired,
        generatedForm: PropTypes.object.isRequired,
        OPERATION_FAILED: PropTypes.object.isRequired,
        OPERATION_SUCCESSFUL: PropTypes.object.isRequired,

        forms: PropTypes.array.isRequired,
        ranks: PropTypes.array.isRequired,

        loadFormGroups: PropTypes.func.isRequired,
        closeDownloadFormAlert: PropTypes.func.isRequired,
        deleteFullyEnrolled: PropTypes.func.isRequired,
        clearPreset: PropTypes.func.isRequired,
        generateForms: PropTypes.func.isRequired,
        onFormsGenerated: PropTypes.func.isRequired,
        onFormsGenerationFailed: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,

        loadingForms: PropTypes.bool.isRequired,
        generatingForms: PropTypes.bool.isRequired,
    };
}

const mapStateToProps = (
    {OPERATION_FAILED, OPERATION_SUCCESSFUL, authUser, socket, forms, clearingHistory, generatingForms, loadingForms,
        formsPagination, generatedForm, formPreset, ranks }) => ({OPERATION_FAILED, OPERATION_SUCCESSFUL, authUser,
    socket, forms, formPreset, formsPagination, clearingHistory, generatingForms, loadingForms, ranks, generatedForm});

const mapDispatchToProps = dispatch => bindActionCreators({loadFormGroups, deleteFullyEnrolled, generateForms,
        clearPreset, closeDownloadFormAlert, onFormsGenerationFailed, onFormsGenerated, reset}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Forms));