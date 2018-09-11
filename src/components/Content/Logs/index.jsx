import React from 'react';
import {
    Button,
    ButtonGroup,
    Icon,
    Intent,
    Popover,
    PopoverInteractionKind,
    Spinner,
    Text,
    Tooltip
} from '@blueprintjs/core';
import Filters, {parseFilters} from "../../Common/Filters";
import {DateTime as DateFilter} from "../../Common/filterRows";
import {LogsTable} from './Table';
import {exportLogs, loadLogs} from '../../../actions/logActions';
import {browserDownload} from '../../../actions/downloadActions';
import {
    ACTIVITY_LOGS_EXPORT_FAILED,
    ACTIVITY_LOGS_EXPORTED,
    NEW_ACTIVITY_LOG,
    onNewActivityLog,
    initSocketListeners,
    onLogsExported,
    onLogsExportFailed,
    stopSocketListeners
} from '../../../actions/socket/logActions';
import {reset} from "../../../actions/operationActions";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import './index.css';
import PropTypes from "prop-types";
import queryString from "query-string";
import {Link} from "react-router-dom";
import {parseSort} from "../../Common/Table/helpers";
import _isEqual from "lodash/isEqual";
import _omit from "lodash/omit";
import {formatDateFilter} from "../../Common/filterRows/Date";
import {EXPORT_LOGS, PDF} from "../../../actions/types";
import Toaster from "../../Common/Toaster";
import {LOGS} from '../../../api/constants/Gates';
import {LOG} from '../../../api/constants/Entities';
import {EXPORT} from '../../../api/constants/Actions';
import Can from "../../../helpers/Can";
import format from "date-fns/format";
import {Operating} from "../Backups";

class Logs extends React.Component{

    constructor(props){
        super(props);

        this._onSortChange = this._onSortChange.bind(this);
        this._applyFilters = this._applyFilters.bind(this);
        this._clearFilters = this._clearFilters.bind(this);
        this._onPerPageChange = this._onPerPageChange.bind(this);
        this._handleExportLogs = this._handleExportLogs.bind(this);
        this._onKeyPress = this._onKeyPress.bind(this);
        this._toggleLiveMode = this._toggleLiveMode.bind(this);
    }

    state = {
        colSortDirs: {},
        filterRows: [
            {
                label: "Date",
                isExpanded: false,
                body: {
                    component: DateFilter,
                    props: { value: format(new Date(), 'X'), operator: 'lessThan', rightValue: format(new Date(), 'X')}
                }
            }
        ],
        filters: [],
        exportFilename: '',
        live: false
    };

    componentDidMount(){
        const {loadLogs, location: {search}, onLogsExported, onLogsExportFailed, onNewActivityLog, socket,
            authUser} = this.props;
        const hooks = [
            {event: ACTIVITY_LOGS_EXPORTED, listener: onLogsExported},
            {event: ACTIVITY_LOGS_EXPORT_FAILED, listener: onLogsExportFailed}
        ];
        initSocketListeners(socket, {authUser, hooks});
        if(this.state.live){
            initSocketListeners(socket, {authUser, hooks: [{channel: 'gate_logs_channel',
                    event: NEW_ACTIVITY_LOG, listener: onNewActivityLog}]});
        }

        const params = queryString.parse(search);
        loadLogs(params);
    }

    static getDerivedStateFromProps(nextProps, prevState){
        const {location: {search: newSearch}} = nextProps;
        const {searchQuery, colSortDirs, filters, live: oldLive} = prevState;
        const {q, f, s, p, pp} = queryString.parse(newSearch);
        const newQuery = q || '';
        const newSorts = s ? parseSort(s) : {};
        const newFilters = f ? parseFilters(f) : [];

        const live = !q && !f && !s && !p && !pp;

        if(_isEqual(searchQuery, q) && _isEqual(colSortDirs, newSorts)
            && _isEqual(filters, newFilters) && _isEqual(live, oldLive)){
            return null;
        }

        return {
            searchQuery: newQuery,
            colSortDirs: newSorts,
            filters: newFilters,
            live
        };
    }

    componentDidUpdate(prevProps, prevState){
        const {location: {search: oldSearch}, OPERATION_SUCCESSFUL: OLD_OPERATION_SUCCESSFUL,
            OPERATION_FAILED: OLD_OPERATION_FAILED} = prevProps;
        const {location: {search: newSearch}, loadLogs, OPERATION_SUCCESSFUL, OPERATION_FAILED, authUser,
            socket, onNewActivityLog, history} = this.props;

        if(!_isEqual(prevState.live, this.state.live) && this.state.live){
            initSocketListeners(socket, {authUser, hooks: [{channel: 'gate_logs_channel',
                    event: NEW_ACTIVITY_LOG, listener: onNewActivityLog}]});
            history.push(`/audit-trail`);
        }
        else{
            stopSocketListeners(socket, {authUser, events: [NEW_ACTIVITY_LOG]});
        }

        if(!_isEqual(queryString.parse(newSearch), queryString.parse(oldSearch))){
            const params = queryString.parse(newSearch);
            loadLogs(params);
        }

        if(!_isEqual(OLD_OPERATION_SUCCESSFUL, OPERATION_SUCCESSFUL)){
            const {action, data: {scheduled, logs}} = OPERATION_SUCCESSFUL;
            if(action === EXPORT_LOGS && !scheduled){
                Toaster.show({
                    message: "Logs Export Ready 😃",
                    timeout: 0,
                    intent: Intent.SUCCESS,
                    action: {
                        onClick: () => Logs._onDownloadLogs(logs),
                        icon: 'cloud-download',
                        text: 'download'
                    },
                    icon: 'tick' });
            }
        }

        if(!_isEqual(OLD_OPERATION_FAILED, OPERATION_FAILED)){
            if(OPERATION_FAILED.action === EXPORT_LOGS){
                this.props.reset();
                console.log(OPERATION_FAILED.data);
                Toaster.show({
                    message: "Operation Failed 😞",
                    intent: Intent.DANGER,
                    icon: 'error'
                });
            }
        }
    }

    componentWillUnmount(){
        const {socket, authUser} = this.props;
        stopSocketListeners(socket, {authUser, events: [ACTIVITY_LOGS_EXPORTED, ACTIVITY_LOGS_EXPORT_FAILED,
                NEW_ACTIVITY_LOG]});
    }

    _toggleLiveMode(){
        const {live: oldLive} = this.state;
        const live = !oldLive;
        if(live){
            this.setState({live, filters: [], colSortDirs: {}});
        }
        else{
            this.setState({live});
        }
    }

    static _onDownloadLogs({path}){
        browserDownload(path, PDF, true);
    }

    _applyFilters(filters){
        const filtersString = filters.map(filter => {
            if(filter.label.startsWith('date')) return formatDateFilter(filter);
            return `${filter.label}|${filter.value}`;
        }).join();
        const {location: {search}, history} = this.props;
        const params = Object.assign({}, queryString.parse(search), {f: filtersString});
        history.push(`/audit-trail?${queryString.stringify(params)}`);
    }

    _clearFilters(){
        const {location: {search}, history} = this.props;
        const params = _omit(queryString.parse(search), 'f');
        history.push(`/audit-trail?${queryString.stringify(params)}`);
    }

    _onSortChange(columnKey, sortDir){
        const {location: {search}, history} = this.props;
        const params = Object.assign({}, queryString.parse(search), {s: `${columnKey}|${sortDir}`});
        history.push(`/audit-trail?${queryString.stringify(params)}`);
    }

    _onPerPageChange(value){
        const {location: {search}, history} = this.props;
        const params = Object.assign({}, queryString.parse(search), {pp: value});
        history.push(`/audit-trail?${queryString.stringify(params)}`);
    }

    _onKeyPress({keyCode}){
        if(keyCode === 13){
            this._handleExportLogs();
        }
    }

    _handleExportLogs(){
        if(this.state.exportFilename.trim()){
            const {location: {search}, exportLogs} = this.props;
            const params = queryString.parse(search);
            exportLogs({...params, filename: this.state.exportFilename});
        }
    }

    render(){
        const {loadingLogs, exportingLogs, logs, authUser, OPERATION_SUCCESSFUL: {data: {scheduled}}, OPERATION_FAILED,
            logsPagination: {current_page: currentPage, per_page: perPage, total, total_pages: totalPages},
            location: {search}} = this.props;

        const exportActionAllowed = authUser.root ? true : Can.User(authUser).perform(EXPORT, LOG, LOGS);

        const nextPage = currentPage < totalPages;
        const prevPage = currentPage > 1;
        const nextPageSearch = queryString.stringify(Object.assign({}, queryString.parse(search), {p: currentPage + 1}));
        const prevPageSearch = queryString.stringify(Object.assign({}, queryString.parse(search), {p: currentPage - 1}));

        return <div className="logs__wrapper">

            <Operating
                content={"Exporting... 😃"}
                intent={Intent.NONE}
                on={scheduled && OPERATION_FAILED.action !== EXPORT_LOGS}/>

            <div className="logs__toolbar">

                <Filters
                    onClearClick={this._clearFilters}
                    onDoneClick={this._applyFilters}
                    filters={this.state.filters}
                    rows={this.state.filterRows}/>

                {(total && exportActionAllowed) ? (
                    <ButtonGroup>
                        <Popover
                            disabled={!total}
                            hasBackdrop
                            interactionKind={PopoverInteractionKind.CLICK}>
                            <Tooltip disabled={!total} content={'export'}>
                                <Button
                                    disabled={!total}
                                    intent={Intent.PRIMARY} icon="export"/>
                            </Tooltip>
                            <div style={{padding: 3}}>
                                <div style={{width: 350}} className="pt-input-group">
                                    <input
                                        type="text"
                                        value={this.state.exportFilename || ''}
                                        onChange={({target: {value}}) => this.setState({exportFilename: value})}
                                        onKeyDown={this._onKeyPress}
                                        className="pt-input"
                                        placeholder="Filename" />
                                    <Button
                                        loading={exportingLogs}
                                        intent={Intent.PRIMARY}
                                        onClick={this._handleExportLogs}
                                        icon={'tick'}
                                        className=""/>
                                </div>
                            </div>
                        </Popover>
                    </ButtonGroup>
                ) : null}

            </div>

            <div className="logs__content">
                <section>
                    <header>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            {loadingLogs ? <Spinner className="pt-small"/> : <Icon icon="history"/>}
                            <Text className="logs__text">
                                Logs <small className="pt-text-muted">({total})</small>
                            </Text>
                        </div>

                        {/*<label style={{marginBottom: 0}} className="pt-control pt-switch pt-align-right">*/}
                            {/*<span style={{marginRight: 10}}>Live</span>*/}
                            {/*<input*/}
                                {/*checked={this.state.live}*/}
                                {/*onChange={() => this._toggleLiveMode()}*/}
                                {/*type="checkbox" />*/}
                            {/*<span className="pt-control-indicator"/>*/}
                        {/*</label>*/}

                        <div className="per-page__wrapper">
                            <div className="pt-select bms-small">
                                <select value={perPage || ''}
                                        onChange={({target: {value}}) => this._onPerPageChange(Number.parseInt(value, 10))}>
                                    <option value="30">30</option>
                                    <option value="40">40</option>
                                    <option value="50">50</option>
                                </select>
                            </div>
                            <span>per page</span>
                        </div>

                        <div className="pt-control-group bms-small">
                            <Link to={`/audit-trail/?${prevPageSearch}`}
                                  className={`pt-button pt-icon-chevron-left pt-small ${!prevPage && 'pt-disabled'}`}/>
                            <button className="pt-button pt-small pt-minimal pt-disabled">
                                {currentPage}
                            </button>
                            <Link to={`/audit-trail/?${nextPageSearch}`}
                                  className={`pt-button pt-icon-chevron-right pt-small ${!nextPage && 'pt-disabled'}`}/>
                        </div>

                    </header>
                    <section>
                        <LogsTable
                            data={logs}
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
        socket: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        logsPagination: PropTypes.object.isRequired,
        OPERATION_SUCCESSFUL: PropTypes.object.isRequired,
        OPERATION_FAILED: PropTypes.object.isRequired,

        loadLogs: PropTypes.func.isRequired,
        onLogsExported: PropTypes.func.isRequired,
        onLogsExportFailed: PropTypes.func.isRequired,
        onNewActivityLog: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,

        exportLogs: PropTypes.func.isRequired,
        loadingLogs: PropTypes.bool.isRequired,
        exportingLogs: PropTypes.bool.isRequired,

        logs: PropTypes.array.isRequired,
    };
}

const mapStateToProps = (
    {authUser, OPERATION_FAILED, OPERATION_SUCCESSFUL, socket, logsPagination, loadingLogs, exportingLogs, logs}) => (
        {authUser, OPERATION_FAILED, OPERATION_SUCCESSFUL, socket, logsPagination, loadingLogs, exportingLogs, logs});
const mapDispatchToProps = dispatch => bindActionCreators({loadLogs, exportLogs, reset, onLogsExported,
    onLogsExportFailed, onNewActivityLog}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Logs);