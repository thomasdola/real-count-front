import React from 'react';
import {Classes, Dialog, Icon, ProgressBar, Spinner, Text} from '@blueprintjs/core';
import {Link, Route} from 'react-router-dom';
import Filters, {parseFilters} from "../../Common/Filters";
import {Date as DateFilter} from "../../Common/filterRows";
import {Backup} from './Modal';
import {BackupsTable} from './Table';
import {SchedulesList} from './List';

import './index.css';
import queryString from "query-string";
import {parseSort} from "../../Common/Table/helpers";
import _isEqual from "lodash/isEqual";
import _omit from "lodash/omit";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {deleteBackup, loadBackups, restoreBackup} from "../../../actions/backupActions";
import {browserDownload} from '../../../actions/downloadActions';
import {reset} from "../../../actions/operationActions";
import {
    initSocketListeners,
    onBackupCreated,
    onBackupCreationFailed,
    onBackupDeleted,
    onBackupDeletionFailed,
    onBackupRestorationFailed,
    onBackupRestored,
    stopSocketListeners
} from '../../../actions/socket/backupActions';
import {connect} from "react-redux";
import {formatDateFilter} from "../../Common/filterRows/Date";
import {Search} from "../Beneficiaries";
import _has from "lodash/has";
import {Intent} from "@blueprintjs/core/lib/esm/index";
import {ConfirmAlert} from "../Beneficiary";
import Toaster from '../../Common/Toaster';
import {CREATE_BACKUP, DELETE_BACKUP, GZIP, RESTORE_BACKUP} from "../../../actions/types";

import {BACKUPS} from '../../../api/constants/Gates';
import {BACKUP} from '../../../api/constants/Entities';
import {ADD, DELETE, DOWNLOAD, RESTORE} from '../../../api/constants/Actions';
import Can from "../../../helpers/Can";
import format from 'date-fns/format';

export const Operating = ({on, intent, percentage, content}) => {
    const value = percentage ? (percentage / 100) : 1;
    return (<Dialog
        backdropClassName="transparent__back"
        style={{width: '300px', paddingBottom: 0}}
        lazy
        canOutsideClickClose={false}
        isOpen={on}
    >
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-even'}} className="pt-dialog-body">
            {content ? <div style={{marginBottom: 5}}>{content}</div> : null}
            <ProgressBar intent={intent} value={value}/>
        </div>
    </Dialog>
)};

class Backups extends React.Component{
    constructor(props){
        super(props);

        this._handleMoveCancel = this._handleMoveCancel.bind(this);
        this._handleMoveConfirm = this._handleMoveConfirm.bind(this);
        this._applyFilters = this._applyFilters.bind(this);
        this._clearFilters = this._clearFilters.bind(this);
        this._onSortChange = this._onSortChange.bind(this);
        this._onPerPageChange = this._onPerPageChange.bind(this);
        this._onSearchQueryChange = this._onSearchQueryChange.bind(this);
        this._onClearSearch = this._onClearSearch.bind(this);
        this._onSearch = this._onSearch.bind(this);
        this._onRestoreBackup = this._onRestoreBackup.bind(this);
        this._onDeleteBackup = this._onDeleteBackup.bind(this);
    }

    state = {
        clearHistoryAlert: false,
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
        colSortDirs: {},
        searchQuery: '',
        selectedBackup: null,
        confirmDeleteBackup: false,
        confirmRestoreBackup: false
    };

    componentDidMount(){
        const {loadBackups, location: {search}, socket, authUser,
            onBackupCreated, onBackupCreationFailed, onBackupRestored, onBackupRestorationFailed,
            onBackupDeleted, onBackupDeletionFailed} = this.props;
        initSocketListeners(socket, {
            authUser,
            onBackupCreated, onBackupCreationFailed,
            onBackupRestored, onBackupRestorationFailed,
            onBackupDeleted, onBackupDeletionFailed
        });
        const params = queryString.parse(search);
        loadBackups(params);
    }

    static getDerivedStateFromProps(nextProps, prevState){
        const {location: {search: newSearch}} = nextProps;
        const {searchQuery, colSortDirs, filters} = prevState;
        const {q, f, s} = queryString.parse(newSearch);
        const newQuery = q || '';
        const newSorts = s ? parseSort(s) : {};
        const newFilters = f ? parseFilters(f) : [];

        if(_isEqual(searchQuery, q) && _isEqual(colSortDirs, newSorts)
            && _isEqual(filters, newFilters)){
            return null;
        }

        return {
            searchQuery: newQuery,
            colSortDirs: newSorts,
            filters: newFilters
        };
    }

    componentDidUpdate(prevProps){
        const {location: {search: oldSearch},
            OPERATION_SUCCESSFUL: OLD_OPERATION_SUCCESSFUL,
            OPERATION_FAILED: OLD_OPERATION_FAILED} = prevProps;
        const {location: {search: newSearch}, loadBackups, OPERATION_SUCCESSFUL, OPERATION_FAILED} = this.props;

        const params = queryString.parse(newSearch);
        if(!_isEqual(queryString.parse(newSearch), queryString.parse(oldSearch))){
            loadBackups(params);
        }

        const {action: FA} = OPERATION_FAILED;

        if(!_isEqual(OLD_OPERATION_SUCCESSFUL, OPERATION_SUCCESSFUL)){
            const {action, data} = OPERATION_SUCCESSFUL;

            if(action === CREATE_BACKUP && !data.scheduled){
                Toaster.show({
                    message: "Backup Successfully Created 😃",
                    intent: Intent.SUCCESS,
                    icon: 'tick'
                });
            }

            if(action === DELETE_BACKUP && !data.scheduled){
                Toaster.show({
                    message: "Backup Successfully Deleted 😃",
                    intent: Intent.SUCCESS,
                    icon: 'tick'
                });
            }

            if(action === RESTORE_BACKUP && !data.scheduled){
                Toaster.show({
                    message: "Backup Successfully Restored 😃",
                    intent: Intent.SUCCESS,
                    icon: 'tick'
                });
            }

            if((action === RESTORE_BACKUP || action === DELETE_BACKUP || action === CREATE_BACKUP) && !data.scheduled){
                loadBackups(params);
            }
        }

        if(!_isEqual(OLD_OPERATION_FAILED, OPERATION_FAILED)){
            if(FA === CREATE_BACKUP
                || FA === RESTORE_BACKUP
                || FA === DELETE_BACKUP){
                console.log(OPERATION_FAILED.data);
                this.props.reset();
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
        stopSocketListeners(socket, {authUser});
    }

    _applyFilters(filters){
        const filtersString = filters.map(filter => {
            if(filter.label.startsWith('date')) return formatDateFilter(filter);
            return `${filter.label}|${filter.value}`;
        }).join();
        const {location: {search}, history} = this.props;
        const params = Object.assign({}, queryString.parse(search), {f: filtersString});
        history.push(`/backups?${queryString.stringify(params)}`);
    }

    _clearFilters(){
        const {location: {search}, history} = this.props;
        const params = _omit(queryString.parse(search), 'f');
        history.push(`/backups?${queryString.stringify(params)}`);
    }

    _onSortChange(columnKey, sortDir){
        const {location: {search}, history} = this.props;
        const params = Object.assign({}, queryString.parse(search), {s: `${columnKey}|${sortDir}`});
        history.push(`/backups?${queryString.stringify(params)}`);
    }

    _onPerPageChange(value){
        const {location: {search}, history} = this.props;
        const params = Object.assign({}, queryString.parse(search), {pp: value});
        history.push(`/backups?${queryString.stringify(params)}`);
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
        this.props.history.push(`/backups?${queryString.stringify(params)}`);
    }

    _handleMoveCancel(){
        this.setState({clearHistoryAlert: false});
    }
    _handleMoveConfirm(){
        this.setState({clearHistoryAlert: false});
    }

    _onRestoreBackup(){
        console.log('restoring...', this.state.selectedBackup);
        let data = new FormData();
        this.props.restoreBackup(this.state.selectedBackup.uuid, data);
        this.setState({
            selectedBackup: null,
            confirmRestoreBackup: false
        });
    }

    _onDeleteBackup(){
        console.log('deleting...', this.state.selectedBackup);
        this.props.deleteBackup(this.state.selectedBackup.uuid);
        this.setState({
            selectedBackup: null,
            confirmDeleteBackup: false
        });
    }

    static _onDownloadBackup({path}){
        browserDownload(path, GZIP);
    }

    _confirmRestoreBackup(backup){
        this.setState({
            confirmRestoreBackup: true,
            selectedBackup: backup
        });
    }

    _confirmDeleteBackup(backup){
        this.setState({
            confirmDeleteBackup: true,
            selectedBackup: backup
        });
    }

    render(){

        const {loadingBackups, backups, authUser,
            backupsPagination: {current_page: currentPage, per_page: perPage, total, total_pages: totalPages},
            location: {search}, loadingBackupSchedules, updatingBackupSchedule, OPERATION_FAILED,
            restoringBackup, deletingBackup, OPERATION_SUCCESSFUL: {action, data: {scheduled}}} = this.props;

        const addActionAllowed = authUser.root ? true : Can.User(authUser).perform(ADD, BACKUP, BACKUPS);
        const restoreActionAllowed = authUser.root ? true : Can.User(authUser).perform(RESTORE, BACKUP, BACKUPS);
        const downloadActionAllowed = authUser.root ? true : Can.User(authUser).perform(DOWNLOAD, BACKUP, BACKUPS);
        const deleteActionAllowed = authUser.root ? true : Can.User(authUser).perform(DELETE, BACKUP, BACKUPS);

        const restoreBackupScheduled = action === RESTORE_BACKUP && scheduled 
            && OPERATION_FAILED.action !== RESTORE_BACKUP;
        const createBackupScheduled = action === CREATE_BACKUP && scheduled 
            && OPERATION_FAILED.action !== CREATE_BACKUP;
        const deleteBackupScheduled = action === DELETE_BACKUP && scheduled 
            && OPERATION_FAILED.action !== DELETE_BACKUP;

        const nextPage = currentPage < totalPages;
        const prevPage = currentPage > 1;
        const nextPageSearch = queryString.stringify(Object.assign({}, queryString.parse(search), {p: currentPage + 1}));
        const prevPageSearch = queryString.stringify(Object.assign({}, queryString.parse(search), {p: currentPage - 1}));

        const {confirmDeleteBackup, confirmRestoreBackup} = this.state;

        return <div className="backups__wrapper">

            {addActionAllowed && <Route path="/backups/new" component={Backup} />}

            <Operating
                content={"Restoring..."}
                intent={Intent.WARNING}
                on={restoringBackup || restoreBackupScheduled}/>

            <Operating
                content={"Creating Backup..."}
                intent={Intent.NONE}
                on={createBackupScheduled}/>

            <Operating
                content={"Deleting..."}
                intent={Intent.DANGER}
                on={deletingBackup || deleteBackupScheduled}/>

            <ConfirmAlert
                open={confirmDeleteBackup}
                intent={Intent.DANGER}
                onConfirm={this._onDeleteBackup}
                onCancel={() => this.setState({confirmDeleteBackup: false})} />

            <ConfirmAlert
                open={confirmRestoreBackup}
                intent={Intent.WARNING}
                onConfirm={this._onRestoreBackup}
                onCancel={() => this.setState({confirmRestoreBackup: false})} />

            <div className="backups__toolbar">
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

                {/*<Icon icon="blank"/>*/}
            </div>

            <div className="backups__content">
                <div className="list">
                    <header>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            {loadingBackups ? <Spinner className="pt-small"/> : <Icon icon="database"/>}
                            <Text className="backups__text">
                                Backups <small className="pt-text-muted">({total})</small>
                            </Text>
                        </div>
                        <Link
                            to="/backups/new"
                            className="pt-intent-primary pt-button pt-small pt-icon-small-plus">Backup</Link>

                    </header>
                    <section className="table__section">
                        <BackupsTable
                            data={backups}
                            downloadAllowed={downloadActionAllowed}
                            onDownloadBackup={row => Backups._onDownloadBackup(row)}
                            deleteAllowed={deleteActionAllowed}
                            onDeleteBackup={row => this._confirmDeleteBackup(row)}
                            restoreAllowed={restoreActionAllowed}
                            onRestoreBackup={row => this._confirmRestoreBackup(row)}
                            onSortChange={this._onSortChange}
                            colSortDirs={this.state.colSortDirs}/>
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
                        <div className="pt-control-group">
                            <Link to={`/backups/?${prevPageSearch}`}
                                  className={`pt-button pt-icon-chevron-left ${!prevPage && 'pt-disabled'}`}/>
                            <button className="pt-button pt-small pt-minimal pt-disabled">
                                {currentPage}
                            </button>
                            <Link to={`/backups/?${nextPageSearch}`}
                                  className={`pt-button pt-icon-chevron-right ${!nextPage && 'pt-disabled'}`}/>
                        </div>

                    </footer>
                </div>
                <div className="schedules">
                    <section className={`wrapper ${Classes.ELEVATION_2}`}>
                        <header>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                {loadingBackupSchedules || updatingBackupSchedule
                                    ? <Spinner className="pt-small"/>
                                    : <Icon icon="history"/>}
                                <Text className="schedules__text">
                                    Backup Schedules
                                </Text>
                            </div>
                        </header>
                        <section className="new-schedule">
                            <SchedulesList />
                        </section>
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

        backupsPagination: PropTypes.object.isRequired,
        OPERATION_SUCCESSFUL: PropTypes.object.isRequired,
        OPERATION_FAILED: PropTypes.object.isRequired,

        loadBackups: PropTypes.func.isRequired,
        deleteBackup: PropTypes.func.isRequired,
        restoreBackup: PropTypes.func.isRequired,
        loadingBackups: PropTypes.bool.isRequired,

        deletingBackup: PropTypes.bool.isRequired,
        restoringBackup: PropTypes.bool.isRequired,
        creatingBackup: PropTypes.bool.isRequired,
        downloadingBackup: PropTypes.bool.isRequired,
        loadingBackupSchedules: PropTypes.bool.isRequired,
        updatingBackupSchedule: PropTypes.bool.isRequired,
        backups: PropTypes.array.isRequired,

        onBackupCreated: PropTypes.func.isRequired,
        onBackupCreationFailed: PropTypes.func.isRequired,
        onBackupRestored: PropTypes.func.isRequired,
        onBackupRestorationFailed: PropTypes.func.isRequired,
        onBackupDeleted: PropTypes.func.isRequired,
        onBackupDeletionFailed: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
    };
}

const mapStateToProps = (
    {socket, restoringBackup, creatingBackup, loadingBackups, loadingBackupSchedules, backups,
        OPERATION_SUCCESSFUL, OPERATION_FAILED, authUser,
        backupsPagination, deletingBackup, downloadingBackup, updatingBackupSchedule}) => ({OPERATION_SUCCESSFUL,
    socket, restoringBackup, OPERATION_FAILED, creatingBackup, backupsPagination, loadingBackups, backups,
    authUser,
    loadingBackupSchedules, downloadingBackup, deletingBackup, updatingBackupSchedule});
const mapDispatchToProps = dispatch => bindActionCreators(
    {loadBackups, deleteBackup, restoreBackup, onBackupCreated, onBackupCreationFailed, reset,
        onBackupRestored, onBackupRestorationFailed, onBackupDeleted, onBackupDeletionFailed}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Backups)