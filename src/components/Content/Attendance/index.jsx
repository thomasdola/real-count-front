import React from 'react';
import PropTypes from 'prop-types';
import {Button, ButtonGroup, Icon, Intent, Position, Spinner, Text, Tooltip} from '@blueprintjs/core';
import Filters, {parseFilters} from '../../Common/Filters';
import {Districts, Locations, Modules, Ranks, Regions, Time} from '../../Common/filterRows';
import {addWeeks, endOfWeek, format, getTime, isThisWeek, startOfWeek, subWeeks} from 'date-fns';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
    loadBeneficiaryWeeklyAttendance,
    loadTodayAttendance,
    viewWeeklyAttendanceFor
} from '../../../actions/attendanceActions';
import {initSocketListeners, stopSocketListeners, onBeneficiaryClocked} from '../../../actions/socket//attendanceActions';
import queryString from "query-string";
import _isEqual from "lodash/isEqual";
import _has from 'lodash/has';
import _omit from 'lodash/omit';
import _unionBy from 'lodash/unionBy';
import {AttendanceWeeklyChart} from './chart';
import {AttendanceWeeklyCalendar} from './calendar';
import {DailyAttendanceTable} from './table';
import './index.css';
import {Link} from "react-router-dom";
import {parseSort} from "../../Common/Table/helpers";
import {formatTimeFilter} from "../../Common/filterRows/Time";
import {Search, formatRowsWithScopeFilters, stringifyFilters, roleScopeFilters} from '../Beneficiaries';

const dateFormat = 'DD/MM/YYYY';
const NA = "NewAttendance";

class Attendance extends React.Component{

    constructor(props){
        super(props);

        this._applyFilters = this._applyFilters.bind(this);
        this._clearFilters = this._clearFilters.bind(this);
        this._nextWeek = this._nextWeek.bind(this);
        this._previousWeek = this._previousWeek.bind(this);
        this._onViewBeneficiaryWeeklyAttendance = this._onViewBeneficiaryWeeklyAttendance.bind(this);
        this._onPerPageChange = this._onPerPageChange.bind(this);
        this._onSearchQueryChange = this._onSearchQueryChange.bind(this);
        this._onClearSearch = this._onClearSearch.bind(this);
        this._onSearch = this._onSearch.bind(this);
        this._onSortChange = this._onSortChange.bind(this);
        this._initServerEventsListeners = this._initServerEventsListeners.bind(this);
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
                    props: { value: '', small: true, dataList: true}
                }
            },
            {
                label: "Location",
                isExpanded: false,
                body: {
                    component: Locations,
                    props: { value: '' , small: true, dataList: true}
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
                label: "Clock In Time",
                isExpanded: false,
                body: {
                    component: Time,
                    props: { value: format(new Date(), 'X'), label: "clockInTime", operator: 'lessThan',
                        rightValue: format(new Date(), 'X') }
                }
            },
            {
                label: "Clock Out Time",
                isExpanded: false,
                body: {
                    component: Time,
                    props: { value: format(new Date(), 'X'), label: "clockOutTime", operator: 'lessThan',
                        rightValue: format(new Date(), 'X') }
                }
            }
        ],
        live: false,
        weekRange: {start: startOfWeek(new Date()), end: endOfWeek(new Date())},
        filters: [],
        searchQuery: '',
        colSortDirs: {}
    };

    componentDidMount(){
        const {loadTodayAttendance, location: {search}, authUser: {root, role}, socket, authUser, 
            onBeneficiaryClocked} = this.props;
        let params = queryString.parse(search);
        let newFilters = params.f ? parseFilters(params.f) : [];

        const roleScopeFilters = Attendance.getScopeFilters(role);
        
        newFilters = _unionBy(roleScopeFilters, newFilters, 'label');
        params = root ? params : {...params, f: stringifyFilters(newFilters)};

        loadTodayAttendance(params);

        if(this.state.live){
            initSocketListeners(socket, {authUser, onBeneficiaryClocked});
        }
    }

    static getDerivedStateFromProps(nextProps, prevState){
        const {location: {search: newSearch}, authUser: {root, role}} = nextProps;
        const {searchQuery, colSortDirs, filters, filterRows: oldFilterRows, live: oldLive} = prevState;
        const {q, f, s, p, pp} = queryString.parse(newSearch);
        const newQuery = q || '';
        const newSorts = s ? parseSort(s) : {};
        let newFilters = f ? parseFilters(f) : [];

        const roleScopeFilters = Attendance.getScopeFilters(role);
        
        const filterRows = root ? oldFilterRows : Attendance.formatRows(oldFilterRows, roleScopeFilters);
        
        newFilters = root ? newFilters : _unionBy(roleScopeFilters, newFilters, 'label');

        let live = oldLive;
        if(q || s || f || p || pp){
            live = false;
        }
        

        if(_isEqual(searchQuery, q)
            && _isEqual(colSortDirs, newSorts)
            && _isEqual(filters, newFilters) && _isEqual(oldLive, live))
        {
            return null;
        }

        return {
            searchQuery: newQuery,
            colSortDirs: newSorts,
            filters: newFilters,
            filterRows, live
        };
    }

    componentDidUpdate(prevProps){
        const {location: {search: oldSearch}, weeklyAttendanceFor: oldW, live: oldLive} = prevProps;
        const {location: {search: newSearch}, loadTodayAttendance, weeklyAttendanceFor, socket,
            authUser, onBeneficiaryClocked} = this.props;

        if(!_isEqual(queryString.parse(newSearch), queryString.parse(oldSearch))){
            const params = queryString.parse(newSearch);
            loadTodayAttendance(params);
        }

        if(oldW.uuid !== weeklyAttendanceFor.uuid){
            this._onViewBeneficiaryWeeklyAttendance(weeklyAttendanceFor);
        }

        if(this.state.live && !_isEqual(this.state.live, oldLive)){
            initSocketListeners(socket, {authUser, onBeneficiaryClocked});
        }

        if(!this.state.live && !_isEqual(this.state.live, oldLive)){
            stopSocketListeners(socket, {authUser});
        }
    }

    componentWillUnmount(){
        const {socket, authUser} = this.props;
        stopSocketListeners(socket, {authUser});
    }

    static formatRows(rows, scopeFilters){
        return formatRowsWithScopeFilters(rows, scopeFilters);
    }

    static getScopeFilters(role){
        return roleScopeFilters(role);
    }

    _initServerEventsListeners(){
        const {socket} = this.props;

        const channel = "channel";
        
        socket.on(`${channel}_channel:${NA}`, data => {
            console.log(NA, data);
        })
    }

    _nextWeek(){
        const date = addWeeks(this.state.weekRange.start, 1);
        const weekRange = {start: startOfWeek(date), end: endOfWeek(date)};
        this.setState({weekRange});

        this.props.loadBeneficiaryWeeklyAttendance(this.props.weeklyAttendanceFor.uuid, {
            start_date: format(weekRange.start, 'X'),
            end_date: format(weekRange.end, 'X')
        });

    }
    _previousWeek(){
        const date = subWeeks(this.state.weekRange.start, 1);
        const weekRange = {start: startOfWeek(date), end: endOfWeek(date)};
        this.setState({weekRange});

        this.props.loadBeneficiaryWeeklyAttendance(this.props.weeklyAttendanceFor.uuid, {
            start_date: format(weekRange.start, 'X'),
            end_date: format(weekRange.end, 'X')
        });
    }

    _applyFilters(filters){
        // console.log()
        const filtersString = filters.map(filter => {
            if(filter.label.startsWith('clock')) return formatTimeFilter(filter);
            return `${filter.label}|${filter.value}`;
        }).join();
        console.log('_applyFilters', filters, filtersString);
        const {location: {search}, history} = this.props;
        const params = Object.assign({}, queryString.parse(search), {f: filtersString});
        console.log(params);
        history.push(`/attendance/?${queryString.stringify(params)}`);
    }

    _clearFilters(){
        console.log("clear filters");
        const {location: {search}, history} = this.props;
        const params = _omit(queryString.parse(search), 'f');
        console.log(params);
        history.push(`/attendance/?${queryString.stringify(params)}`);
    }

    _onSortChange(columnKey, sortDir){
        console.log(columnKey, sortDir);

        const {location: {search}, history} = this.props;
        const params = Object.assign({}, queryString.parse(search), {s: `${columnKey}|${sortDir}`});
        console.log(params);
        history.push(`/attendance/?${queryString.stringify(params)}`);
    }

    _onPerPageChange(value){
        const {location: {search}, history} = this.props;
        const params = Object.assign({}, queryString.parse(search), {pp: value});
        console.log(params);
        history.push(`/attendance/?${queryString.stringify(params)}`);
    }

    _onSearchQueryChange({target: {value}}){
        this.setState(() => ({searchQuery: value}));
    }

    _onKeyPress({keyCode}){
        if(keyCode === 13){
            this._onSearch();
        }
    }

    _onSearch(){
        const {location: {search}} = this.props;
        const {searchQuery} = this.state;
        const params = Object.assign({}, queryString.parse(search), {q: searchQuery.trim()});
        searchQuery.trim() &&
        this.props.history.push(`/attendance/?${queryString.stringify(params)}`);
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

    _onViewBeneficiaryWeeklyAttendance(beneficiary){
        this.props.loadBeneficiaryWeeklyAttendance(beneficiary.uuid, {
            start_date: getTime(this.state.weekRange.start),
            end_date: getTime(this.state.weekRange.end)
        });
    }

    render(){
        const {dailyAttendance, loadingDailyAttendance, weeklyBeneficiaryAttendance: {calendar, chart},
            loadingBeneficiaryWeeklyAttendance, weeklyAttendanceFor: {full_name, bid}, viewWeeklyAttendanceFor,
            attendancePagination: {current_page: currentPage, total, per_page: perPage, total_pages: totalPages}, 
            location: {search}} = this.props;

        const nextPage = currentPage < totalPages;
        const prevPage = currentPage > 1;

        const nextPageSearch = queryString.stringify(Object.assign({}, queryString.parse(search), {p: currentPage + 1}));
        const prevPageSearch = queryString.stringify(Object.assign({}, queryString.parse(search), {p: currentPage - 1}));

        return <div className="attendance__wrapper">

            <div className="attendance__toolbar">
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

                <div className="date-control">
                    <ButtonGroup>
                        <Tooltip 
                            position={Position.BOTTOM} 
                            disabled={!(bid && full_name)}
                            content="Previous Week">
                            <Button 
                                disabled={!(bid && full_name)}
                                intent={Intent.PRIMARY}
                                className="pt-minimal pt-small" 
                                onClick={this._previousWeek} 
                                icon="chevron-left"/>
                        </Tooltip>
                    </ButtonGroup>
                    <p className="date">
                        {format(this.state.weekRange.start, dateFormat)} - {format(this.state.weekRange.end, dateFormat)}
                    </p>
                    <ButtonGroup>
                        <Tooltip disabled={isThisWeek(this.state.weekRange.end)} position={Position.BOTTOM} content="Next Week">
                            <Button 
                                className="pt-minimal pt-small" 
                                intent={Intent.PRIMARY}
                                disabled={isThisWeek(this.state.weekRange.end)} 
                                onClick={this._nextWeek} icon="chevron-right"/>
                        </Tooltip>
                    </ButtonGroup>
                </div>
            </div>
            <div className="attendance__content">
                <div className="list">
                    <header>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            {
                                loadingDailyAttendance
                                    ? <Spinner className="pt-small"/> : <Icon icon="calendar"/>
                            }
                            <Text className="daily__text">Daily Attendance</Text>
                        </div>
                        <div>
                            <Icon icon="people"/>
                            <Text className="beneficiaries__text">
                                <strong><small>{total}</small></strong>
                                <span style={{marginLeft: '5px'}} className="pt-text-muted">Beneficiary(ies)</span>
                            </Text>
                        </div>
                    </header>

                    <section className="table__section">
                        <DailyAttendanceTable
                            colSortDirs={this.state.colSortDirs}
                            data={dailyAttendance}
                            onSortChange={this._onSortChange}
                            onViewWeeklyAttendance={viewWeeklyAttendanceFor}/>
                    </section>

                    <footer>
                        <div className="per-page__wrapper">
                            <div className="pt-select pt-minimal bms-small">
                                <select value={perPage || ''}
                                        onChange={({target: {value}}) => this._onPerPageChange(Number.parseInt(value, 10))}>
                                    <option value="30">30</option>
                                    <option value="40">40</option>
                                    <option value="50">50</option>
                                </select>
                            </div>
                            <span> per page.</span>
                        </div>
                        <div className="pt-control-group pt-small">
                            <Link to={`/attendance/?${prevPageSearch}`}
                                  className={`pt-button pt-icon-chevron-left ${!prevPage && 'pt-disabled'}`}/>
                            <button className="pt-button pt-small pt-minimal pt-disabled">
                                {currentPage}
                            </button>
                            <Link to={`/attendance/?${nextPageSearch}`}
                                  className={`pt-button pt-icon-chevron-right ${!nextPage && 'pt-disabled'}`}/>
                        </div>

                    </footer>
                </div>
                <div className="single">
                    <header>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            {
                                loadingBeneficiaryWeeklyAttendance
                                    ? <Spinner className="pt-small"/> : <Icon icon="timeline-events"/>
                            }

                            {
                                bid && full_name && (
                                    <span style={{marginLeft: 10}}>
                                        <strong>{`${full_name} | ${bid}`}</strong>
                                    </span>
                                )
                            }

                            <span style={{marginLeft: '5px'}} className="pt-text-muted">Weekly Attendance Calendar</span>
                        </div>
                    </header>
                    <section>
                        <div className="calendar">
                            <AttendanceWeeklyCalendar data={calendar}/>
                        </div>
                        <div className="graph">
                            <div className="graph-header">
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    {
                                        loadingBeneficiaryWeeklyAttendance
                                        ? <Spinner className="pt-small"/> : <Icon icon="timeline-line-chart"/>
                                    }
                                    {
                                        bid && full_name && (
                                            <span style={{marginLeft: 10}}>
                                                <strong>{`${full_name} | ${bid}`}</strong>
                                            </span>
                                        )
                                    }

                                    <span style={{marginLeft: '5px'}} className="pt-text-muted">Weekly Attendance Chart</span>
                                </div>
                                {/* <Button className="pt-small" intent={Intent.NONE} icon="cog"/> */}
                            </div>
                            <div className="graph-section">
                                <AttendanceWeeklyChart data={chart}/>
                            </div>     
                        </div>
                    </section>
                </div>
            </div>
        </div>
    }

    static propTypes = {
        authUser: PropTypes.object.isRequired,
        socket: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        weeklyAttendanceFor: PropTypes.object.isRequired,
        attendancePagination: PropTypes.object.isRequired,
        weeklyBeneficiaryAttendance: PropTypes.object.isRequired,

        loadTodayAttendance: PropTypes.func.isRequired,
        loadBeneficiaryWeeklyAttendance: PropTypes.func.isRequired,
        viewWeeklyAttendanceFor: PropTypes.func.isRequired,
        
        dailyAttendance: PropTypes.array.isRequired,
        
        loadingDailyAttendance: PropTypes.bool.isRequired,
        loadingBeneficiaryWeeklyAttendance: PropTypes.bool.isRequired,
        onBeneficiaryClocked: PropTypes.func.isRequired

    };
}

const mapStateToProps =
    ({
         authUser, socket, weeklyBeneficiaryAttendance, weeklyAttendanceFor, attendancePagination,
         dailyAttendance, loadingDailyAttendance, loadingBeneficiaryWeeklyAttendance}) => ({
        authUser, socket, weeklyBeneficiaryAttendance, dailyAttendance, weeklyAttendanceFor,
    loadingDailyAttendance, loadingBeneficiaryWeeklyAttendance, attendancePagination});
const mapDispatchToProps = dispatch => bindActionCreators({loadTodayAttendance, loadBeneficiaryWeeklyAttendance,
    viewWeeklyAttendanceFor, onBeneficiaryClocked}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Attendance);