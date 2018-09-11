import React from 'react';
import {Button, Dialog, Intent} from '@blueprintjs/core';
import {withRouter} from 'react-router-dom';
import {editDistrict} from '../../../../actions/branchActions';
import PropTypes from 'prop-types';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import _find from "lodash/find";
import _isEqual from 'lodash/isEqual';
import Toaster from "../../../Common/Toaster";
import {EDIT_LOCATION_DISTRICT} from "../../../../actions/types";
import {isFormValid} from "../../Enrollment";


class EditDistrict extends React.Component{

    constructor(props){
        super(props);

        this._handleEditDistrict = this._handleEditDistrict.bind(this);
    }

    state = {
        region: {},
        district: {},
        name: ''
    };

    static getDerivedStateFromProps(nextProps, prevState){
        const {district: oldDistrict} = prevState;
        const {districts, match: {params: {did}}} = nextProps;
        const district = _find(districts, {id: Number.parseInt(did, 10)}) || {};

        if(_isEqual(district, oldDistrict) && !district.code)
            return null;

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

        if(!_isEqual(OLD_OPERATION_SUCCESSFUL, OPERATION_SUCCESSFUL)){
            if(OPERATION_SUCCESSFUL.action === EDIT_LOCATION_DISTRICT){
                history.goBack();
                Toaster.show({
                    message: `District Updated Successfully 😃`,
                    intent: Intent.SUCCESS,
                    icon: 'tick' });
            }
        }

        if(!_isEqual(OLD_OPERATION_FAILED, OPERATION_FAILED)){
            if(OPERATION_FAILED.action === EDIT_LOCATION_DISTRICT){
                console.log(OPERATION_FAILED.data);
                Toaster.show({
                    message: `Could Not Update District 😞`,
                    intent: Intent.DANGER,
                    icon: 'error'
                });
            }
        }
    }

    _handleEditDistrict(){
        const {district: {id}, name} = this.state;
        if(!name.trim()) return;

        let data = new FormData();
        data.append('name', name);
        this.props.editDistrict(id, data);
    }

    render(){
        const {history, editingLocationDistrict} = this.props;
        const {name, district} = this.state;
        const disableSaveButton = !isFormValid({name}) || _isEqual(name, district.name);
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
                title="Edit District"
            >
                <div className="pt-dialog-body">
                    <label className="pt-label">
                        Region
                        <input disabled readOnly
                               value={this.state.region.name || ''}
                               className="pt-input pt-fill" type="text" dir="auto" />
                    </label>
                    <label className="pt-label">
                        Name
                        <input
                            value={this.state.name || ''}
                            onChange={({target: {value}}) => this.setState({name: value})}
                            className="pt-input pt-fill" type="text" dir="auto" />
                    </label>
                    <label className="pt-label">
                        District Code
                        <input disabled readOnly
                               value={`${this.state.district.code || ''}`}
                               className="pt-input pt-fill" type="text" dir="auto" />
                    </label>
                </div>
                <div className="pt-dialog-footer">
                    <div className="pt-dialog-footer-actions">
                        <Button
                            disabled={disableSaveButton}
                            intent={Intent.PRIMARY}
                            loading={editingLocationDistrict}
                            onClick={this._handleEditDistrict}
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
        editDistrict: PropTypes.func.isRequired,
        regions: PropTypes.array.isRequired,
        districts: PropTypes.array.isRequired,
        editingLocationDistrict: PropTypes.bool.isRequired,
    };
}

const mapStateToProps = (
    {OPERATION_FAILED, OPERATION_SUCCESSFUL, locationRegions, locationDistricts, editingLocationDistrict}) => (
    {OPERATION_FAILED, OPERATION_SUCCESSFUL, regions: locationRegions, districts: locationDistricts,
        editingLocationDistrict});
const mapDispatchToProps = d => bindActionCreators({editDistrict}, d);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditDistrict));