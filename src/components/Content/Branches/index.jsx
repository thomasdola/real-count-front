import React from 'react';
import PropTypes from 'prop-types';
import {Button, ButtonGroup, Icon, Position, Spinner, Text, Tooltip} from '@blueprintjs/core';
import {Link, Route, withRouter} from 'react-router-dom';
import {deleteCity, deleteDistrict, loadCities, loadDistricts, loadRegions} from '../../../actions/branchActions';
import {CitiesTable, DistrictsTable, RegionsTable} from './Table';
import {EditCity, EditDistrict, NewCity, NewDistrict} from './Modal';
import queryString from 'query-string';
import {parseFilters} from '../../Common/Filters';
import _find from 'lodash/find';
import _isEqual from 'lodash/isEqual';

import './index.css';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Intent} from "@blueprintjs/core/lib/esm/index";
import Toaster from "../../Common/Toaster";
import {
    ADD_LOCATION_CITY,
    ADD_LOCATION_DISTRICT,
    DELETE_LOCATION_CITY,
    DELETE_LOCATION_DISTRICT,
    EDIT_LOCATION_CITY,
    EDIT_LOCATION_DISTRICT
} from "../../../actions/types";
import {ConfirmAlert} from "../Beneficiary";

class Branches extends React.Component{

    constructor(props){
        super(props);

        this._updateCitiesPagination = this._updateCitiesPagination.bind(this);
        this._updateDistrictsPagination = this._updateDistrictsPagination.bind(this);
        this._deleteDistrict = this._deleteDistrict.bind(this);
        this._deleteCity = this._deleteCity.bind(this);
    }

    state = {
        region: undefined,
        district: undefined,
        selectedRegion: {},
        selectedDistrict: {},
        districtToBeDeleted: {},
        cityToBeDeleted: {},
        confirmDeleteCity: false,
        confirmDeleteDistrict: false
    };

    componentDidMount(){
        const {loadRegions, loadDistricts, loadCities, location: {search}} = this.props;
        const params = queryString.parse(search);
        loadRegions();
        loadDistricts(params);
        loadCities(params);
    }

    static getDerivedStateFromProps(nextProps, prevState){
        const {location: {search: newSearch}, locationRegions, locationDistricts} = nextProps;
        const {selectedRegion: oldSelectedRegion, selectedDistrict: oldSelectedDistrict,
            region: oldRegion, district: oldDistrict} = prevState;

        let filters = {};
        const {f} = queryString.parse(newSearch);
        if(newSearch)
            filters = parseFilters(f);

        let newRegion = _find(filters, {label: 'region'});
        newRegion = newRegion ? newRegion.value : undefined;
        const selectedRegion = _find(locationRegions, {id: Number.parseInt(newRegion, 10)}) || {};

        let newDistrict = _find(filters, {label: 'district'});
        newDistrict = newDistrict ? newDistrict.value : undefined;
        const selectedDistrict = _find(locationDistricts, {id: Number.parseInt(newDistrict, 10)}) || {};

        if(_isEqual(oldSelectedRegion, selectedRegion)
            && _isEqual(oldSelectedDistrict, selectedDistrict)
            && _isEqual(oldRegion, newRegion)
            && _isEqual(oldDistrict, newDistrict))
        {
            return null;
        }

        return { selectedRegion, selectedDistrict, region: newRegion, district: newDistrict };
    }

    componentDidUpdate(prevProps, prevState){
        const {loadDistricts, loadCities, location: {search: oldSearch}, OPERATION_SUCCESSFUL: OLD_OPERATION_SUCCESSFUL,
            OPERATION_FAILED: OLD_OPERATION_FAILED} = prevProps;

        const {location: {search: newSearch}, OPERATION_SUCCESSFUL,
            OPERATION_FAILED} = this.props;
        const {region: oldRegion, district: oldDistrict} = prevState;

        let newParams = queryString.parse(newSearch);
        let oldParams = queryString.parse(oldSearch);

        if(newSearch && !_isEqual(newParams, oldParams)){
            let filters = {};
            const {f} = newParams;
            if(newSearch) filters = parseFilters(f);

            let newRegion = _find(filters, {label: 'region'});
            newRegion = newRegion ? newRegion.value : undefined;

            let newDistrict = _find(filters, {label: 'district'});
            newDistrict = newDistrict ? newDistrict.value : undefined;

            if(oldRegion !== newRegion){
                loadDistricts(newParams);
            }

            if(oldDistrict !== newDistrict){
                loadCities(newParams);
            }
        }

        if(!_isEqual(OLD_OPERATION_SUCCESSFUL, OPERATION_SUCCESSFUL)){
            const {action} = OPERATION_SUCCESSFUL;
            if(action === ADD_LOCATION_DISTRICT || action === EDIT_LOCATION_DISTRICT
                || action === DELETE_LOCATION_DISTRICT){
                loadDistricts(newParams);
            }

            if(action === ADD_LOCATION_CITY || action === EDIT_LOCATION_CITY
                || action === DELETE_LOCATION_CITY){
                loadCities(newParams);
            }

            const districtOrCity = action === DELETE_LOCATION_DISTRICT
                ? "District"
                : "City";

            if(action === DELETE_LOCATION_CITY || action === DELETE_LOCATION_DISTRICT){
                Toaster.show({
                    message: `${districtOrCity} Deleted Successfully 😞`,
                    intent: Intent.SUCCESS,
                    icon: 'error'
                });
            }
        }

        if(!_isEqual(OLD_OPERATION_FAILED, OPERATION_FAILED)){
            const {action, data} = OPERATION_FAILED;

            const districtOrCity = action === DELETE_LOCATION_DISTRICT
                ? "District"
                : "City";

            if(action === DELETE_LOCATION_CITY || action === DELETE_LOCATION_DISTRICT){
                console.log(data);
                Toaster.show({
                    message: `Could Not Delete ${districtOrCity} 😞`,
                    intent: Intent.DANGER,
                    icon: 'error'
                });
            }
        }
    }

    _updateDistrictsPagination(params){
        const {location: {search}} = this.props;
        const {loadDistricts, locationDistrictsPagination: {current_page: currentPage, per_page: perPage}} = this.props;
        params = Object.assign({}, queryString.parse(search), {p: currentPage, pp: perPage}, params);
        loadDistricts(params);
    }

    _updateCitiesPagination(params){
        const {location: {search}} = this.props;
        const {loadCities, locationCitiesPagination: {current_page: currentPage, per_page: perPage}} = this.props;
        params = Object.assign({}, queryString.parse(search), {p: currentPage, pp: perPage}, params);
        loadCities(params);
    }

    _deleteDistrict(){
        const {districtToBeDeleted: {id}} = this.state;
        if(id){
            this.props.deleteDistrict(id);
            this.setState({confirmDeleteDistrict: false, districtToBeDeleted: null});
        }
    }

    _deleteCity(){
        const {cityToBeDeleted: {id}} = this.state;
        if(id){
            this.props.deleteCity(id);
            this.setState({confirmDeleteCity: false, cityToBeDeleted: null});
        }
    }

    render(){

        const {locationRegions, locationDistricts, locationCities, deletingLocationCity, deletingLocationDistrict,
            locationDistrictsPagination: {current_page: currentPageD, total: totalD, per_page: perPageD, total_pages: totalPagesD},
            locationCitiesPagination: {current_page: currentPageL, total: totalL, per_page: perPageL, total_pages: totalPagesL}, 
            loadingLocationCities, loadingLocationDistricts,
            loadingLocationRegions, locationRegionsPagination} = this.props;

        const {selectedRegion, selectedDistrict, confirmDeleteCity, confirmDeleteDistrict} = this.state;

        const DNextPage = currentPageD < totalPagesD;
        const DPrevPage = currentPageD > 1;
        const LNextPage = currentPageL < totalPagesL;
        const LPrevPage = currentPageL > 1;

        return <div className="locations__wrapper">

            <Route path="/locations/regions/:rid/districts/new" component={NewDistrict}/>
            <Route path="/locations/regions/:rid/districts/:did/edit" component={EditDistrict}/>
            <Route path="/locations/regions/:rid/districts/:did/cities/new" component={NewCity}/>
            <Route path="/locations/regions/:rid/districts/:did/cities/:cid/edit" component={EditCity}/>

            <ConfirmAlert
                intent={Intent.DANGER}
                open={confirmDeleteDistrict}
                onConfirm={this._deleteDistrict}
                onCancel={() => this.setState({confirmDeleteDistrict: false})} />

            <ConfirmAlert
                intent={Intent.DANGER}
                open={confirmDeleteCity}
                onConfirm={this._deleteCity}
                onCancel={() => this.setState({confirmDeleteCity: false})} />

            <div className="list">
                <header>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        {loadingLocationRegions ? <Spinner className="pt-small"/> : <Icon icon="list"/>}
                        <span>
                                <Text className="location__text">
                                    Regions <small className="pt-text-muted">({locationRegionsPagination.total})</small>
                                </Text>
                            </span>
                    </div>
                </header>
                <section>
                    <div className="locations">
                        <RegionsTable
                            data={locationRegions}/>
                    </div>
                </section>
            </div>

            <div className="list">
                <header>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        {loadingLocationDistricts ? <Spinner className="pt-small"/> : <Icon icon="list"/>}
                        <span>
                                <Text className="location__text">
                                    {selectedRegion && selectedRegion.name} 
                                    <span style={{marginLeft: 5, marginRight: 5}}>Districts</span>
                                    <small className="pt-text-muted">({totalD})</small>
                                </Text>
                            </span>
                    </div>
                    {parseInt(this.state.region, 10) >= 1 ? (
                        <Link
                            to={`/locations/regions/${this.state.region}/districts/new`}
                            className={`${(deletingLocationCity || deletingLocationDistrict) && 'pt-disabled'} pt-button pt-small
                            pt-icon-small-plus pt-intent-primary`}/>
                    ) : null}

                </header>
                <section>
                    <div className="locations">
                        <DistrictsTable
                            onDelete={district => {
                                this.setState({districtToBeDeleted: district, confirmDeleteDistrict: true})
                            }}
                            data={locationDistricts}/>
                    </div>
                    <footer className="locations">
                        <div className="per-page__wrapper">
                            <div className="pt-select pt-minimal bms-small">
                                <select
                                    onChange={
                                        ({target: {value}}) => this._updateDistrictsPagination({pp: Number.parseInt(value, 10)})
                                    }
                                    value={perPageD}>
                                    <option value="20">20</option>
                                    <option value="30">30</option>
                                    <option value="40">40</option>
                                </select>
                            </div>
                            <span> per page</span>
                        </div>

                        <ButtonGroup className="pt-small" large={false}>
                            <Tooltip disabled={!DPrevPage} position={Position.TOP} content="previous page">
                                <Button
                                    onClick={
                                        () => this._updateDistrictsPagination({p: currentPageD - 1})
                                    }
                                    disabled={!DPrevPage}
                                    icon="chevron-left"/>
                            </Tooltip>
                            <Button disabled text={currentPageD}/>
                            <Tooltip disabled={!DNextPage} position={Position.TOP} content="next page">
                                <Button
                                    disabled={!DNextPage}
                                    onClick={
                                        () => this._updateDistrictsPagination({p: currentPageD + 1})
                                    }
                                    icon="chevron-right"/>
                            </Tooltip>
                        </ButtonGroup>
                    </footer>
                </section>
            </div>

            <div className="list">
                <header>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        {loadingLocationCities ? <Spinner className="pt-small"/> : <Icon icon="list"/>}
                        <span>
                                <Text className="location__text">
                                    {selectedDistrict && selectedDistrict.name} 
                                    <span style={{marginLeft: 5, marginRight: 5}}>Locations</span>
                                    <small className="pt-text-muted">({totalL})</small>
                                </Text>
                            </span>
                    </div>
                    {parseInt(this.state.region, 10) >= 1 && parseInt(this.state.district, 10) >= 1 ? (
                        <Link
                            to={`/locations/regions/${this.state.region}/districts/${this.state.district}/cities/new`}
                            className={`${(deletingLocationCity || deletingLocationDistrict) && 'pt-disabled'} pt-button pt-small
                            pt-icon-small-plus pt-intent-primary`}/>
                    ): null}
                </header>
                <section>
                    <div className="locations">
                        <CitiesTable
                            onDelete={city => {
                                this.setState({cityToBeDeleted: city, confirmDeleteCity: true})
                            }}
                            data={locationCities}/>
                    </div>
                    <footer className="locations">
                        <div className="per-page__wrapper">
                            <div className="pt-select pt-minimal bms-small">
                                <select
                                    onChange={
                                        ({target: {value}}) => this._updateCitiesPagination({pp: Number.parseInt(value, 10)})
                                    }
                                    value={perPageL}>
                                    <option value="20">20</option>
                                    <option value="30">30</option>
                                    <option value="40">40</option>
                                </select>
                            </div>
                            <span> per page</span>
                        </div>
                        <ButtonGroup className="pt-small" large={false}>
                            <Tooltip disabled={!LPrevPage} position={Position.TOP} content="previous page">
                                <Button
                                    disabled={!LPrevPage}
                                    onClick={
                                        () => this._updateCitiesPagination({p: currentPageL - 1})
                                    }
                                    icon="chevron-left"/>
                            </Tooltip>
                            <Button disabled text={currentPageL}/>
                            <Tooltip disabled={!LNextPage} position={Position.TOP} content="next page">
                                <Button
                                    disabled={!LNextPage}
                                    onClick={
                                        () => this._updateCitiesPagination({p: currentPageL + 1})
                                    }
                                    icon="chevron-right"/>
                            </Tooltip>
                        </ButtonGroup>
                    </footer>
                </section>
            </div>
        </div>
    }

    static propTypes = {
        authUser: PropTypes.object.isRequired,

        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        OPERATION_SUCCESSFUL: PropTypes.object.isRequired,
        OPERATION_FAILED: PropTypes.object.isRequired,

        locationRegionsPagination: PropTypes.object.isRequired,
        locationDistrictsPagination: PropTypes.object.isRequired,
        locationCitiesPagination: PropTypes.object.isRequired,

        loadRegions: PropTypes.func.isRequired,
        loadDistricts: PropTypes.func.isRequired,
        loadCities: PropTypes.func.isRequired,
        deleteDistrict: PropTypes.func.isRequired,
        deleteCity: PropTypes.func.isRequired,

        loadingLocationRegions: PropTypes.bool.isRequired,
        loadingLocationDistricts: PropTypes.bool.isRequired,
        loadingLocationCities: PropTypes.bool.isRequired,
        deletingLocationDistrict: PropTypes.bool.isRequired,
        deletingLocationCity: PropTypes.bool.isRequired,

        locationRegions: PropTypes.array.isRequired,
        locationCities: PropTypes.array.isRequired,
        locationDistricts: PropTypes.array.isRequired,
    };
}

const mapStateToProps = (
    {
        authUser, locationRegionsPagination, locationDistrictsPagination, locationCitiesPagination,
        loadingLocationRegions, loadingLocationDistricts, loadingLocationCities, deletingLocationDistrict,
        deletingLocationCity, locationRegions, locationCities, locationDistricts, OPERATION_SUCCESSFUL,
        OPERATION_FAILED
    }) => (
    {
        authUser, locationRegionsPagination, locationDistrictsPagination, locationCitiesPagination,
        loadingLocationRegions, loadingLocationDistricts, loadingLocationCities, deletingLocationDistrict,
        deletingLocationCity, locationRegions, locationCities, locationDistricts, OPERATION_SUCCESSFUL,
        OPERATION_FAILED
    });
const mapDispatchToProps = dispatch => bindActionCreators({
    loadRegions, loadDistricts, loadCities, deleteDistrict, deleteCity
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Branches));