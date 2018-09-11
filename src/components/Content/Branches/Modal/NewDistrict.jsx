import React from 'react';
import {Button, Dialog, Intent} from '@blueprintjs/core';
import {withRouter} from 'react-router-dom';
import {addDistrict} from '../../../../actions/branchActions';
import PropTypes from 'prop-types';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import _isEqual from 'lodash/isEqual';
import _find from 'lodash/find';
import Toaster from "../../../Common/Toaster";
import {ADD_LOCATION_DISTRICT} from "../../../../actions/types";
import {isFormValid} from "../../Enrollment";


class NewDistrict extends React.Component{

    constructor(props){
        super(props);

        this._handleAddDistrict = this._handleAddDistrict.bind(this);
    }

    state = {region: {}, name: ''};

    static getDerivedStateFromProps(nextProps, prevState){
        const {region: oldRegion} = prevState;
        const {regions, match: {params: {rid}}} = nextProps;
        const region = _find(regions, {id: Number.parseInt(rid, 10)}) || {};

        if(_isEqual(region, oldRegion) && !region.code)
            return null;

        const {name} = region;
        return { region, name };
    }

    componentDidUpdate(prevProps){
        const {OPERATION_SUCCESSFUL: OLD_OPERATION_SUCCESSFUL, OPERATION_FAILED: OLD_OPERATION_FAILED} = prevProps;
        const {OPERATION_SUCCESSFUL, OPERATION_FAILED, history, regions, match: {params: {rid}}} = this.props;

        const region = _find(regions, {id: Number.parseInt(rid, 10)});
        if(regions.length > 0 && !region){
            history.goBack()
        }

        const district = this.state.name.toUpperCase();
        if(!_isEqual(OLD_OPERATION_SUCCESSFUL, OPERATION_SUCCESSFUL)){
            if(OPERATION_SUCCESSFUL.action === ADD_LOCATION_DISTRICT){
                history.goBack();
                Toaster.show({
                    message: `${district} Added Successfully 😃`,
                    intent: Intent.SUCCESS,
                    icon: 'tick' });
            }
        }

        if(!_isEqual(OLD_OPERATION_FAILED, OPERATION_FAILED)){
            if(OPERATION_FAILED.action === ADD_LOCATION_DISTRICT){
                console.log(OPERATION_FAILED.data);
                Toaster.show({
                    message: `Could Not Add ${district} 😞`,
                    intent: Intent.DANGER,
                    icon: 'error'
                });
            }
        }
    }

    _handleAddDistrict(){
        const {name, region: {id}} = this.state;
        if(!name.trim())
            return;

        let data = new FormData();
        data.append('name', name);
        data.append('region_id', id);
        this.props.addDistrict(data);
    }

    render(){
        const {history, addingLocationDistrict} = this.props;
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
                title="New District"
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
                </div>
                <div className="pt-dialog-footer">
                    <div className="pt-dialog-footer-actions">
                        <Button
                            disabled={disableSaveButton}
                            intent={Intent.PRIMARY}
                            loading={addingLocationDistrict}
                            onClick={this._handleAddDistrict}
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
        OPERATION_SUCCESSFUL: PropTypes.object.isRequired,
        OPERATION_FAILED: PropTypes.object.isRequired,
        addDistrict: PropTypes.func.isRequired,
        regions: PropTypes.array.isRequired,
        addingLocationDistrict: PropTypes.bool.isRequired,
    };
}

const mapStateToProps = (
    {OPERATION_FAILED, OPERATION_SUCCESSFUL, locationRegions, addingLocationDistrict}) => (
        {OPERATION_FAILED, OPERATION_SUCCESSFUL, regions: locationRegions, addingLocationDistrict});
const mapDispatchToProps = dispatch => bindActionCreators({addDistrict}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewDistrict));