import React from 'react';
import PropTypes from "prop-types";
import {Button, ButtonGroup, Icon, Intent, Menu, MenuItem, Popover, Spinner, Text, Tooltip} from '@blueprintjs/core';
import {Link, Route, withRouter} from 'react-router-dom';
import Filters, {parseFilters} from '../../Common/Filters';
import {EditDevice, MapDevice, NewAssistant, NewDevice} from './Modal';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
    deleteDevice,
    loadDeviceLogs,
    loadDeviceOperators,
    loadDevices,
    loadDeviceSupervisorAssistants,
    removeAssistant,
} from '../../../actions/deviceActions';
import {initSocketListeners, onDeviceStatusChanged, stopSocketListeners} from '../../../actions/socket/deviceActions';
import {Date as DateFilter, Districts, Mapping, Regions, Status} from "../../Common/filterRows";
import queryString from "query-string";
import _omit from "lodash/omit";
import _isEqual from "lodash/isEqual";
import {AssistantsTable, DevicesTable, LogsTable} from './Table';
import './index.css';
import {parseSort} from "../../Common/Table/helpers";
import {formatDateFilter} from "../../Common/filterRows/Date";
import _has from 'lodash/has';
import {Search} from '../Beneficiaries';
import {ConfirmAlert} from "../Beneficiary";
import {
    ADD_DEVICE,
    ADD_DEVICE_SUPERVISOR_ASSISTANT,
    DELETE_DEVICE,
    EDIT_DEVICE,
    MAP_DEVICE,
    REMOVE_DEVICE_SUPERVISOR_ASSISTANT
} from "../../../actions/types";
import Toaster from "../../Common/Toaster";
import _find from 'lodash/find';

import {DEVICES} from '../../../api/constants/Gates';
import {DEVICE} from '../../../api/constants/Entities';
import {ADD, DELETE, EDIT, MAP, UNMAP} from '../../../api/constants/Actions';
import Can from "../../../helpers/Can";
import _unionBy from 'lodash/unionBy';
import {formatRowsWithScopeFilters, stringifyFilters, roleScopeFilters} from '../Beneficiaries';
import format from 'date-fns/format';

class Devices extends React.Component{

    constructor(props){
        super(props);

        this._onPerPageChange = this._onPerPageChange.bind(this);
        this._onSearchQueryChange = this._onSearchQueryChange.bind(this);
        this._onSearch = this._onSearch.bind(this);
        this._applyFilters = this._applyFilters.bind(this);
        this._clearFilters = this._clearFilters.bind(this);
        this._onClearSearch = this._onClearSearch.bind(this);
        this._onSortChange = this._onSortChange.bind(this);
        this._handleOnDeviceView = this._handleOnDeviceView.bind(this);
        this._onLoadDeviceLogs = this._onLoadDeviceLogs.bind(this);
        this._onRemoveAssistant = this._onRemoveAssistant.bind(this);
        this._deleteDevice = this._deleteDevice.bind(this);
        this._deleteAssistant = this._deleteAssistant.bind(this);
    }

    state = {
        filters: [],
        searchQuery: "",
        colSortDirs: {},
        selectedDevice: {},
        confirmDeleteDevice: false,
        confirmDeleteAssistant: false,
        assistantToBeDeleted: null,
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
                label: "Date",
                isExpanded: false,
                body: {
                    component: DateFilter,
                    props: { value: format(new Date(), 'X'), operator: 'lessThan', rightValue: format(new Date(), 'X')}
                }
            },
            {
                label: "Status",
                isExpanded: false,
                body: {
                    component: Status,
                    props: { value: '' }
                }
            },
            {
                label: "Mapping",
                isExpanded: false,
                body: {
                    component: Mapping,
                    props: { value: '' }
                }
            }
        ]
    };

    componentDidMount(){
        const {loadDevices, location: {search}, loadDeviceOperators, socket, 
            onDeviceStatusChanged, authUser: {root, role}} = this.props;

        let params = queryString.parse(search);
        let newFilters = params.f ? parseFilters(params.f) : [];

        const roleScopeFilters = Devices.getScopeFilters(role);

        newFilters = _unionBy(roleScopeFilters, newFilters, 'label');
        params = root ? params : {...params, f: stringifyFilters(newFilters)};

        loadDevices(params);
        loadDeviceOperators();

        initSocketListeners(socket, {onDeviceStatusChanged});
    }

    static getDerivedStateFromProps(nextProps, prevState){
        const {location: {search: newSearch}, devices, authUser: {root, role}} = nextProps;
        const {searchQuery, colSortDirs, filters, selectedDevice: oldSelectedDevice, 
            filterRows: oldFilterRows} = prevState;
        const {q, f, s, device} = queryString.parse(newSearch);
        const newQuery = q || '';
        const newSorts = s ? parseSort(s) : {};
        let newFilters = f ? parseFilters(f) : [];
        const newSelectedDevice = _find(devices, {code: device}) || {};


        const roleScopeFilters = Devices.getScopeFilters(role);
        
        const filterRows = root ? oldFilterRows : Devices.formatRows(oldFilterRows, roleScopeFilters);
        
        newFilters = root ? newFilters : _unionBy(roleScopeFilters, newFilters, 'label');

        if(_isEqual(searchQuery, q)
            && _isEqual(colSortDirs, newSorts)
            && _isEqual(filters, newFilters) 
            && _isEqual(oldSelectedDevice, newSelectedDevice) 
            && _isEqual(oldFilterRows, filterRows))
        {
            return null;
        }

        return {
            searchQuery: newQuery,
            colSortDirs: newSorts,
            filters: newFilters,
            selectedDevice: newSelectedDevice,
            filterRows
        };
    }

    componentDidUpdate(prevProps, prevState){
        const {location: {search: oldSearch}, OPERATION_SUCCESSFUL: OLD_OPERATION_SUCCESSFUL,
            OPERATION_FAILED: OLD_OPERATION_FAILED} = prevProps;
        const {selectedDevice: oldSelectedDevice} = prevState;

        const {location: {search: newSearch}, loadDevices, OPERATION_SUCCESSFUL,
            OPERATION_FAILED} = this.props;

        const params = queryString.parse(newSearch);
        let sameSearch = _isEqual(queryString.parse(newSearch), queryString.parse(oldSearch));
        if(!sameSearch){
            loadDevices(params);
        }

        const {selectedDevice} = this.state;
        if(!_isEqual(oldSelectedDevice, selectedDevice) && selectedDevice.uuid){
            this.props.loadDeviceLogs(selectedDevice.uuid);
            this.props.loadDeviceSupervisorAssistants(selectedDevice.uuid);
        }

        if(!_isEqual(OLD_OPERATION_SUCCESSFUL, OPERATION_SUCCESSFUL)){
            const {action} = OPERATION_SUCCESSFUL;

            if(action === DELETE_DEVICE){
                Toaster.show({
                    message: `Device Deleted Successfully 😃`,
                    intent: Intent.SUCCESS,
                    icon: 'tick' });
            }

            if(action === REMOVE_DEVICE_SUPERVISOR_ASSISTANT){
                Toaster.show({
                    message: `Assistant Removed Successfully 😃`,
                    intent: Intent.SUCCESS,
                    icon: 'tick' });
            }

            if(action === REMOVE_DEVICE_SUPERVISOR_ASSISTANT || action === ADD_DEVICE_SUPERVISOR_ASSISTANT){
                this.props.loadDeviceSupervisorAssistants(selectedDevice.uuid);
                this.props.loadDeviceOperators();
            }

            if(action === DELETE_DEVICE || action === EDIT_DEVICE
                || action === MAP_DEVICE || action === ADD_DEVICE){
                loadDevices(params);
            }
        }

        if(!_isEqual(OLD_OPERATION_FAILED, OPERATION_FAILED)){
            const {action, data} = OPERATION_FAILED;

            if(action === DELETE_DEVICE){
                console.log(data);
                Toaster.show({
                    message: `Could Not Delete Device 😞`,
                    intent: Intent.DANGER,
                    icon: 'error'
                });
            }

            if(action === REMOVE_DEVICE_SUPERVISOR_ASSISTANT){
                console.log(data);
                Toaster.show({
                    message: `Could Not Add Assistant 😞`,
                    intent: Intent.DANGER,
                    icon: 'error'
                });
            }
        }
    }

    componentWillUnmount(){
        const {socket} = this.props;
        stopSocketListeners(socket);
    }

    static formatRows(rows, scopeFilters){
        return formatRowsWithScopeFilters(rows, scopeFilters);
    }

    static getScopeFilters(role){
        return roleScopeFilters(role);
    }

    _applyFilters(filters){
        const filtersString = filters.map(filter => {
            if(filter.label.startsWith('date')) return formatDateFilter(filter);
            return `${filter.label}|${filter.value}`;
        }).join();
        const {location: {search}, history} = this.props;
        const params = Object.assign({}, queryString.parse(search), {f: filtersString});
        history.push(`/devices?${queryString.stringify(params)}`);
    }

    _clearFilters(){
        const {location: {search}, history} = this.props;
        const params = _omit(queryString.parse(search), 'f');
        history.push(`/devices?${queryString.stringify(params)}`);
    }

    _onSortChange(columnKey, sortDir){
        const {location: {search}, history} = this.props;
        const params = Object.assign({}, queryString.parse(search), {s: `${columnKey}|${sortDir}`});
        history.push(`/devices?${queryString.stringify(params)}`);
    }

    _onPerPageChange(value){
        const {location: {search}, history} = this.props;
        const params = Object.assign({}, queryString.parse(search), {pp: value});
        history.push(`/devices?${queryString.stringify(params)}`);
    }

    _onSearchQueryChange({target: {value}}){
        this.setState(() => ({searchQuery: value}));
    }

    _onSearch(){
        const {location: {search}} = this.props;
        const {searchQuery} = this.state;
        const params = Object.assign({}, queryString.parse(search), {q: searchQuery.trim()});
        searchQuery.trim() &&
        this.props.history.push(`/devices?${queryString.stringify(params)}`);
    }

    _handleOnDeviceView(device){
        const {location: {search}, history} = this.props;
        let params = new URLSearchParams(search);
        params.set('device', device.code);
        history.push(`/devices?${params.toString()}`);
    }

    _onLoadDeviceLogs(params){
        const {selectedDevice: {uuid}} = this.state;
        this.props.loadDeviceLogs(uuid, params);
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

    _deleteAssistant(){
        const {removeAssistant} = this.props;
        const {assistantToBeDeleted: assistant, selectedDevice} = this.state;
        if(assistant){
            let data = new FormData();
            data.append('type', assistant.type);
            data.append('operator', assistant.uuid);
            removeAssistant(selectedDevice.uuid, data);

            this.setState({assistantToBeDeleted: null, confirmDeleteAssistant: false});
        }
    }

    _onRemoveAssistant(assistant){
        this.setState(() => {
            return {
                confirmDeleteAssistant: true,
                assistantToBeDeleted: assistant
            };
        });
    }

    _deleteDevice(){
        const {deleteDevice} = this.props;
        const {selectedDevice: {uuid}} = this.state;
        if(!uuid) return;

        this.setState({confirmDeleteDevice: false});
        deleteDevice(uuid);
    }

    render(){
        const {devices, loadingDevices, loadingLogs, loadingAssistants, deviceLogs,
            devicesPagination: {current_page: currentPageD, total: totalD, per_page: perPageD, total_pages: totalPagesD},
            logsPagination: {current_page: currentPageL, total: totalL, per_page: perPageL, total_pages: totalPagesL},
            location: {search}, assistants, deletingDevice, removingDeviceSupervisorAssistant, authUser
        } = this.props;

        const {filterRows, filters, searchQuery, confirmDeleteDevice, confirmDeleteAssistant, selectedDevice} = this.state;

        const nextPageD = currentPageD < totalPagesD;
        const prevPageD = currentPageD > 1;
        const nextPageL = currentPageL < totalPagesL;
        const prevPageL = currentPageL > 1;

        const nextPageSearch = queryString.stringify(
            Object.assign({}, queryString.parse(search), {p: currentPageD + 1}));
        const prevPageSearch = queryString.stringify(
            Object.assign({}, queryString.parse(search), {p: currentPageD - 1}));

        const addActionAllowed = authUser.root 
            ? true 
            : Can.User(authUser).perform(ADD, DEVICE, DEVICES);

        const editActionAllowed = authUser.root 
            ? true 
            : Can.User(authUser).perform(EDIT, DEVICE, DEVICES);

        const deleteActionAllowed = authUser.root 
            ? true 
            : Can.User(authUser).perform(DELETE, DEVICE, DEVICES);

        const mapActionAllowed = authUser.root 
            ? true 
            : Can.User(authUser).perform(MAP, DEVICE, DEVICES);

        const unmapActionAllowed = authUser.root 
            ? true 
            : Can.User(authUser).perform(UNMAP, DEVICE, DEVICES);

        console.log('devices', addActionAllowed, editActionAllowed, deleteActionAllowed, mapActionAllowed, unmapActionAllowed);

        const deviceMenu = <Menu>
            <Link to={`/devices/${selectedDevice.uuid}/edit${search}`}
                  className={`pt-menu-item pt-icon-standard pt-icon-edit 
                  ${!editActionAllowed ? 'pt-disabled' : ''}`}>Edit Device</Link>
            <MenuItem
                disabled={!deleteActionAllowed}
                onClick={() => this.setState({confirmDeleteDevice: true})}
                intent={Intent.DANGER}
                icon={'trash'} text={'Delete Device'}/>
        </Menu>;

        return <div className="devices__wrapper">

            <ConfirmAlert
                intent={Intent.DANGER}
                open={confirmDeleteDevice}
                onConfirm={this._deleteDevice}
                onCancel={() => this.setState({confirmDeleteDevice: false})} />

            <ConfirmAlert
                intent={Intent.DANGER}
                open={confirmDeleteAssistant}
                onConfirm={this._deleteAssistant}
                onCancel={() => this.setState({confirmDeleteAssistant: false})} />

            {addActionAllowed ? (<Route path="/devices/new" component={NewDevice}/>) : null}
            {mapActionAllowed ? (<Route path="/devices/:uuid/map" component={MapDevice}/>) : null}
            {mapActionAllowed ? (<Route path="/devices/:uuid/assistants/new" component={NewAssistant}/>) : null}
            {editActionAllowed ? (<Route path="/devices/:uuid/edit" component={EditDevice}/>) : null}

            <div className="devices__toolbar">
                <Search
                    value={searchQuery || ''}
                    onQueryChange={this._onSearchQueryChange}
                    onQueryClear={this._onClearSearch}
                    onSearch={this._onSearch}/>

                <Filters
                    rows={filterRows}
                    filters={filters}
                    onDoneClick={this._applyFilters}
                    onClearClick={this._clearFilters}/>

                <ButtonGroup disabled={!addActionAllowed} large={false}>
                    <Tooltip disabled={!addActionAllowed} content="new device">
                        <Link
                            to={`/devices/new${search}`}
                            className={`pt-button pt-icon-plus pt-intent-primary 
                            ${!addActionAllowed ? 'pt-disabled' : ''}`}/>
                    </Tooltip>
                </ButtonGroup>
            </div>

            <div className="devices__content">
                <div className="list">
                    <header>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            {
                                loadingDevices
                                    ? <Spinner className="pt-small"/> : <Icon icon="mobile-phone"/>
                            }
                            <Text className="devices__text">
                                Devices <span className="pt-text-muted">({totalD})</span>
                            </Text>
                        </div>
                        {selectedDevice.uuid && (
                            <ButtonGroup>
                                <Popover disabled={deletingDevice}  content={deviceMenu}>
                                    <Button
                                        disabled={deletingDevice}
                                        intent={Intent.PRIMARY}
                                        className="pt-small" icon="more"/>
                                </Popover>
                            </ButtonGroup>
                        )}
                    </header>
                    <section className="table__section">
                        <DevicesTable
                            onViewDevice={this._handleOnDeviceView}
                            colSortDirs={this.state.colSortDirs}
                            data={devices}
                            mapActionAllowed={mapActionAllowed}
                            onSortChange={this._onSortChange}/>
                    </section>
                    <footer>
                        <div className="per-page__wrapper">
                            <div className="pt-select pt-minimal bms-small">
                                <select value={perPageD || ''}
                                        onChange={({target: {value}}) => this._onPerPageChange(Number.parseInt(value, 10))}>
                                    <option value="30">30</option>
                                    <option value="40">40</option>
                                    <option value="50">50</option>
                                </select>
                            </div>
                            <span> per page</span>
                        </div>
                        <div className="pt-control-group pt-small">
                            <Link to={`/devices/?${prevPageSearch}`}
                                  className={`pt-button pt-icon-chevron-left ${!prevPageD && 'pt-disabled'}`}/>
                            <button className="pt-button pt-small pt-minimal pt-disabled">
                                {currentPageD}
                            </button>
                            <Link to={`/devices/?${nextPageSearch}`}
                                  className={`pt-button pt-icon-chevron-right ${!nextPageD && 'pt-disabled'}`}/>
                        </div>

                    </footer>
                </div>
                <div className="single">
                    <header>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            {
                                loadingLogs
                                    ? <Spinner className="pt-small"/> : <Icon icon="list"/>
                            }
                            <Text ellipsize>
                                <span style={{marginLeft: 10}}>{selectedDevice.name} Logs
                                    <span className="pt-text-muted">({totalL})</span></span>
                            </Text>
                        </div>
                    </header>
                    <section>
                        <div className="logs">
                            <LogsTable data={deviceLogs}/>
                        </div>
                        <footer className="logs">
                            <div className="per-page__wrapper">
                                <div className="pt-select pt-minimal bms-small">
                                    <select
                                        disabled={loadingLogs}
                                        value={perPageL || ''}
                                        onChange={({target: {value}}) => this._onLoadDeviceLogs(
                                            {pp: Number.parseInt(value, 10), p: currentPageL}
                                            )}>
                                        <option value="15">15</option>
                                        <option value="20">20</option>
                                        <option value="25">25</option>
                                    </select>
                                </div>
                                <span> per page</span>
                            </div>
                            <div className="pt-control-group pt-small">
                                <button
                                    onClick={() => this._onLoadDeviceLogs({p: currentPageL - 1, pp: perPageL})}
                                    className={`pt-button pt-icon-chevron-left ${!prevPageL && 'pt-disabled'}`}/>
                                <button className="pt-button pt-small pt-minimal pt-disabled">
                                    {currentPageL}
                                </button>
                                <button
                                    onClick={() => this._onLoadDeviceLogs({p: currentPageL + 1, pp: perPageL})}
                                    className={`pt-button pt-icon-chevron-right ${!nextPageL && 'pt-disabled'}`}/>
                            </div>
                        </footer>
                        <div className="assistants">
                            <div className="assistants-header">
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    {
                                        (loadingAssistants || removingDeviceSupervisorAssistant)
                                            ? <Spinner className="pt-small"/>
                                            : <Icon icon="people"/>
                                    }
                                    <Text>
                                        <span style={{marginLeft: 10}}>Assistants
                                            <span className="pt-text-muted">({assistants.length})</span></span>
                                    </Text>
                                </div>
                                {
                                    (selectedDevice.uuid
                                        && selectedDevice.active && this.props.deviceOperators.length > 0)
                                        ? (
                                        <ButtonGroup disabled={!mapActionAllowed} 
                                            className="pt-small">
                                            <Tooltip
                                                disabled={removingDeviceSupervisorAssistant 
                                                    || !mapActionAllowed}
                                                content="new assistant">
                                                <Link
                                                    to={`/devices/${selectedDevice.uuid}/assistants/new${search}`}
                                                    className={`pt-button pt-small pt-icon-new-person pt-intent-primary
                                                    ${(loadingAssistants || removingDeviceSupervisorAssistant 
                                                    || !mapActionAllowed)
                                                    && 'pt-disabled'}`}/>
                                            </Tooltip>
                                        </ButtonGroup>
                                    ) : null
                                }
                            </div>
                            <div className="assistants-section">
                                <AssistantsTable
                                    unmapActionAllowed={unmapActionAllowed}
                                    onRemoveAssistant={assistant => this._onRemoveAssistant(assistant)}
                                    data={assistants}/>
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

        devices: PropTypes.array.isRequired,
        deviceLogs: PropTypes.array.isRequired,
        assistants: PropTypes.array.isRequired,
        deviceOperators: PropTypes.array.isRequired,

        devicesPagination: PropTypes.object.isRequired,
        logsPagination: PropTypes.object.isRequired,
        OPERATION_FAILED: PropTypes.object.isRequired,
        OPERATION_SUCCESSFUL: PropTypes.object.isRequired,

        loadDevices: PropTypes.func.isRequired,
        loadDeviceLogs: PropTypes.func.isRequired,
        loadDeviceOperators: PropTypes.func.isRequired,
        loadDeviceSupervisorAssistants: PropTypes.func.isRequired,
        removeAssistant: PropTypes.func.isRequired,
        deleteDevice: PropTypes.func.isRequired,
        onDeviceStatusChanged: PropTypes.func.isRequired,

        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,

        loadingDevices: PropTypes.bool.isRequired,
        loadingAssistants: PropTypes.bool.isRequired,
        loadingLogs: PropTypes.bool.isRequired,
        deletingDevice: PropTypes.bool.isRequired,
        removingDeviceSupervisorAssistant: PropTypes.bool.isRequired,
    };
}

const mapStateToProps = (
    {deviceOperators, authUser, socket, devices, deletingDevice, devicesPagination, deviceLogsPagination, loadingDevices,
        loadingDeviceLogs, loadingDeviceSupervisorAssistants, deviceLogs, assistants, OPERATION_FAILED,
        OPERATION_SUCCESSFUL, removingDeviceSupervisorAssistant}) => (
    {deviceOperators, authUser, socket, loadingDevices, deletingDevice, loadingLogs: loadingDeviceLogs, removingDeviceSupervisorAssistant,
        logsPagination: deviceLogsPagination, devicesPagination, loadingAssistants: loadingDeviceSupervisorAssistants,
        devices, deviceLogs, assistants, OPERATION_FAILED, OPERATION_SUCCESSFUL});

const mapDispatchToProps = dispatch => bindActionCreators(
    {loadDeviceLogs, loadDevices, loadDeviceOperators, loadDeviceSupervisorAssistants, removeAssistant,
        deleteDevice, onDeviceStatusChanged}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Devices));