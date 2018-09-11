import React from 'react';
import {Button, Dialog, Intent} from '@blueprintjs/core';
import {withRouter} from 'react-router-dom';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {addCity} from "../../../../actions/branchActions";
import PropTypes from "prop-types";
import _find from "lodash/find";
import _isEqual from "lodash/isEqual";
import {isFormValid} from "../../Enrollment";
import Toaster from "../../../Common/Toaster";
import {ADD_LOCATION_CITY} from "../../../../actions/types";

class NewCity extends React.Component{

    constructor(props){
        super(props);
        this._handleAddCity = this._handleAddCity.bind(this);
    }

    state = {region: {}, district: {}, name: ''};

    static getDerivedStateFromProps(nextProps, prevState){
        const {district: oldDistrict} = prevState;
        const {districts, match: {params: {did}}} = nextProps;
        const district = _find(districts, {id: Number.parseInt(did, 10)}) || {};

        if(_isEqual(district, oldDistrict) && !district.code) {
            return null;
        }
        const {region, name} = district;
        return { district, region, name };
    }

    componentDidUpdate(prevProps){
        const {OPERATION_SUCCESSFUL: OLD_OPERATION_SUCCESSFUL, OPERATION_FAILED: OLD_OPERATION_FAILED} = prevProps;
        const {OPERATION_SUCCESSFUL, OPERATION_FAILED, history, districts, match: {params: {did}}} = this.props;

        const district = _find(districts, {id: Number.parseInt(did, 10)});
        if(districts.length > 0 && !district){
            history.goBack()
        }

        const city = this.state.name.toUpperCase();
        if(!_isEqual(OLD_OPERATION_SUCCESSFUL, OPERATION_SUCCESSFUL)){
            if(OPERATION_SUCCESSFUL.action === ADD_LOCATION_CITY){
                history.goBack();
                Toaster.show({
                    message: `${city} Added Successfully 😃`,
                    intent: Intent.SUCCESS,
                    icon: 'tick' });
            }
        }

        if(!_isEqual(OLD_OPERATION_FAILED, OPERATION_FAILED)){
            if(OPERATION_FAILED.action === ADD_LOCATION_CITY){
                console.log(OPERATION_FAILED.data);
                Toaster.show({
                    message: `Could Not Add ${city} 😞`,
                    intent: Intent.DANGER,
                    icon: 'error'
                });
            }
        }
    }

    _handleAddCity(){
        const {district: {id}, name} = this.state;
        if(!name.trim()) return;

        let data = new FormData();
        data.append('name', name);
        data.append('district_id', id);
        this.props.addCity(data);
    }

    render(){

        const {addingLocationCity, history} = this.props;
        const {name} = this.state;
        const disableSaveButton = !isFormValid({name});

        return (
            <Dialog
                backdropClassName="transparent__back"
                style={{width: '350px'}}
                lazy
                canEscapeKeyClose={false}
                canOutsideClickClose={false}
                onClose={() => history.goBack()}
                icon="small-plus"
                isOpen
                title="New City"
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
                </div>
                <div className="pt-dialog-footer">
                    <div className="pt-dialog-footer-actions">
                        <Button
                            disabled={disableSaveButton}
                            intent={Intent.PRIMARY}
                            loading={addingLocationCity}
                            onClick={this._handleAddCity}
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
        addCity: PropTypes.func.isRequired,
        regions: PropTypes.array.isRequired,
        districts: PropTypes.array.isRequired,
        addingLocationCity: PropTypes.bool.isRequired
    };
}

const mapStateToProps = (
    {OPERATION_FAILED, OPERATION_SUCCESSFUL, locationRegions, locationDistricts, addingLocationCity}) => (
    {OPERATION_FAILED, OPERATION_SUCCESSFUL, regions: locationRegions, districts: locationDistricts, addingLocationCity});
const mapDispatchToProps = d => bindActionCreators({addCity}, d);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewCity));