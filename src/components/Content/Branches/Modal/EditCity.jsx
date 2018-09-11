import React from 'react';
import {Button, Dialog, Intent} from '@blueprintjs/core';
import {withRouter} from 'react-router-dom';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {editCity} from "../../../../actions/branchActions";
import PropTypes from "prop-types";
import _isEqual from 'lodash/isEqual';
import _find from 'lodash/find';
import {isFormValid} from "../../Enrollment";
import Toaster from "../../../Common/Toaster";
import {EDIT_LOCATION_CITY} from "../../../../actions/types";

class EditCity extends React.Component{

    constructor(props){
        super(props);

        this._handleEditCity = this._handleEditCity.bind(this);
    }

    state = {region: {}, district: {}, name: '', city: {}};

    static getDerivedStateFromProps(nextProps, prevState){
        const {city: oldCity} = prevState;
        const {cities, match: {params: {cid}}} = nextProps;
        const city = _find(cities, {id: Number.parseInt(cid, 10)}) || {};

        if(_isEqual(city, oldCity) && !city.code)
            return null;

        const {district, district: {region}, name} = city;
        return { region, district, city, name };
    }

    componentDidUpdate(prevProps){
        const {OPERATION_SUCCESSFUL: OLD_OPERATION_SUCCESSFUL, OPERATION_FAILED: OLD_OPERATION_FAILED} = prevProps;
        const {OPERATION_SUCCESSFUL, OPERATION_FAILED, history, cities, match: {params: {cid}}} = this.props;

        const city = _find(cities, {id: Number.parseInt(cid, 10)});
        if(cities.length > 0 && !city){
            history.goBack()
        }

        if(!_isEqual(OLD_OPERATION_SUCCESSFUL, OPERATION_SUCCESSFUL)){
            if(OPERATION_SUCCESSFUL.action === EDIT_LOCATION_CITY){
                history.goBack();
                Toaster.show({
                    message: `City Updated Successfully 😃`,
                    intent: Intent.SUCCESS,
                    icon: 'tick' });
            }
        }

        if(!_isEqual(OLD_OPERATION_FAILED, OPERATION_FAILED)){
            if(OPERATION_FAILED.action === EDIT_LOCATION_CITY){
                console.log(OPERATION_FAILED.data);
                Toaster.show({
                    message: `Could Not Update City 😞`,
                    intent: Intent.DANGER,
                    icon: 'error'
                });
            }
        }
    }

    _handleEditCity(){
        const {city: {id}, name} = this.state;
        if(!isFormValid({name})) return;

        let data = new FormData();
        data.append('name', name);
        this.props.editCity(id, data);
    }

    render(){
        const {editingLocationCity, history} = this.props;
        const {name, city} = this.state;
        const disableSaveButton = !isFormValid({name}) || _isEqual(name, city.name);
        return (
            <Dialog
                backdropClassName="transparent__back"
                style={{width: '350px'}}
                lazy
                canEscapeKeyClose={false}
                canOutsideClickClose={false}
                onClose={() => history.goBack()}
                icon="edit"
                isOpen
                title="Edit City"
            >
                <div className="pt-dialog-body">
                    <label className="pt-label">
                        Region
                        <input disabled readOnly
                               value={this.state.region.name || ''}
                               className="pt-input pt-fill" type="text" dir="auto" />
                    </label>
                    <label className="pt-label">
                        District
                        <input disabled readOnly
                               value={this.state.district.name || ''}
                               className="pt-input pt-fill" type="text" dir="auto" />
                    </label>
                    <label className="pt-label">
                        Name
                        <input
                            value={this.state.name || ''}
                            onChange={({target: {value}}) => this.setState({name: value})}
                            className="pt-input pt-fill"
                            type="text" dir="auto" />
                    </label>
                    <label className="pt-label">
                        City Code
                        <input disabled readOnly
                               value={this.state.city.code || ''}
                               className="pt-input pt-fill" type="text" dir="auto" />
                    </label>
                </div>
                <div className="pt-dialog-footer">
                    <div className="pt-dialog-footer-actions">
                        <Button
                            disabled={disableSaveButton}
                            intent={Intent.PRIMARY}
                            loading={editingLocationCity}
                            onClick={this._handleEditCity}
                            icon="tick"
                            text="save"
                        />
                    </div>
                </div>
            </Dialog>
        );
    }

    static propTypes = {
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        OPERATION_FAILED: PropTypes.object.isRequired,
        OPERATION_SUCCESSFUL: PropTypes.object.isRequired,
        editCity: PropTypes.func.isRequired,
        regions: PropTypes.array.isRequired,
        districts: PropTypes.array.isRequired,
        cities: PropTypes.array.isRequired,
        editingLocationCity: PropTypes.bool.isRequired,
    };
}

const mapStateToProps = (
    {OPERATION_FAILED, OPERATION_SUCCESSFUL, locationRegions, locationDistricts, editingLocationCity,
        locationCities}) => (
    {OPERATION_FAILED, OPERATION_SUCCESSFUL, regions: locationRegions, districts: locationDistricts,
        cities: locationCities, editingLocationCity});
const mapDispatchToProps = d => bindActionCreators({editCity}, d);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditCity));