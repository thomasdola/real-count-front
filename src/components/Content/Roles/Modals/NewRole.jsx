import React from 'react';
import {Button, Dialog, Intent} from '@blueprintjs/core';
import Policies from "../../../Common/filterRows/Policies";
import Regions from "../../../Common/filterRows/Regions";
import Districts from "../../../Common/filterRows/Districts";
import PropTypes from "prop-types";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {addRole} from '../../../../actions/roleActions';
import {isFormValid} from "../../Enrollment";
import Toaster from "../../../Common/Toaster";
import _isEqual from "lodash/isEqual";
import {ADD_GROUP} from "../../../../actions/types";

class NewRole extends React.Component{

    constructor(props){
        super(props);

        this._handleInputChange = this._handleInputChange.bind(this);
        this._handleAddRole = this._handleAddRole.bind(this);
    }

    state = {
        name: '',
        description: '',

        levelType: 'country',
        levelId: '1',
        regionId: '',
        districtId: '',

        policies: []
    };

    static getDerivedStateFromProps(nextProps, prevState){
        const {authUser: {root, role: {level, scope}}} = nextProps;
        const {levelType, levelId, regionId, districtId} = prevState;

        const newRegionId = !root ? scope.region_id : regionId;
        const newDistrictId = !root ? scope.district_id : districtId;
        const newLevelId = root 
            ? levelId
            : (_isEqual(level.type, 'country') 
                ? 1 
                : (_isEqual(level.type, 'region') 
                    ? scope.region_id 
                    : (_isEqual(level.type, 'district') 
                        ? scope.district_id 
                        : 1)
                    )
                );
        const newLevelType = root ? levelType : level.type;

        if(_isEqual(regionId, newRegionId) && _isEqual(districtId, newDistrictId) 
            && _isEqual(levelId, newLevelId) && _isEqual(levelType, newLevelType))
            return null;

        return {
            regionId: newRegionId, districtId: newDistrictId, levelId: newLevelId, levelType: newLevelType
        };
    }

    componentDidUpdate(prevProps){
        const {OPERATION_SUCCESSFUL: OLD_OPERATION_SUCCESSFUL, OPERATION_FAILED: OLD_OPERATION_FAILED} = prevProps;
        const {OPERATION_SUCCESSFUL, OPERATION_FAILED, history} = this.props;

        const role = this.state.name.toUpperCase();

        if(!_isEqual(OLD_OPERATION_SUCCESSFUL, OPERATION_SUCCESSFUL)){
            if(OPERATION_SUCCESSFUL.action === ADD_GROUP){
                history.goBack();
                Toaster.show({
                    message: `${role} Successfully Added 😃`,
                    intent: Intent.SUCCESS,
                    icon: 'tick' });
            }
        }

        if(!_isEqual(OLD_OPERATION_FAILED, OPERATION_FAILED)){
            if(OPERATION_FAILED.action === ADD_GROUP){
                console.log(OPERATION_FAILED.data);
                Toaster.show({
                    message: `Could Not Add ${role} 😞`,
                    intent: Intent.DANGER,
                    icon: 'error'
                });
            }
        }
    }

    _handleInputChange(name, value){
        if(name === 'levelType' && value.startsWith('Select...')) return;

        this.setState(() => ({...this.state, [name]: value}));
    }

    _handleAddRole(){
        const {name, description, levelType, policies, regionId, districtId} = this.state;

        const lId = levelType === "country" ? 1 : (levelType === "region" ? regionId : districtId);

        let gatesId = policies.map(({gate: {id}}) => id);
        const policiesId = policies.map(({id}) => id);

        let data = new FormData();

        for(let i = 0; i < gatesId.length; i++){
            data.append('gates[]', gatesId[i]);
        }
        for(let i = 0; i < policiesId.length; i++){
            data.append('policies[]', policiesId[i]);
        }
        data.append('name', name);
        data.append('description', description);
        data.append('level_type', levelType);
        data.append('level_id', lId);

        this.props.addRole(data);
    }

    _isFormValid(){
        const {name, levelId, levelType, policies, regionId, districtId} = this.state;

        let required = {name, levelType, levelId, policies: policies.map(({id}) => id)};

        if(levelType === "region")
            required = {...required, regionId};

        if(levelType === "district")
            required = {...required, districtId};

        return isFormValid(required);
    }

    render(){
        const {addingGroup, history, authUser} = this.props;

        const disableLocationsSelection = type =>  _isEqual(type, authUser.role.level.type) && !authUser.root;

        const RegionLevel = () => (
            <label className="pt-label">
                Region
                <Regions
                    small={false}
                    disabled={disableLocationsSelection('region') 
                        || disableLocationsSelection('district')}
                    value={this.state.regionId || ''}
                    onChange={({value}) => this._handleInputChange('regionId', value)}/>
            </label>
        );

        const DistrictLevel = () => (
            <label className="pt-label">
                District
                <Districts
                    dependent={true}
                    disabled={disableLocationsSelection('district')}
                    small={false}
                    value={this.state.districtId || ''}
                    onChange={({value}) => this._handleInputChange('districtId', value)}/>
            </label>
        );

        const disableSaveButton = !this._isFormValid();

        return (
            <Dialog
                backdropClassName="transparent__back"
                style={{width: '350px'}}
                onClose={() => history.goBack()}
                lazy
                icon="key"
                isOpen
                canOutsideClickClose={false}
                canEscapeKeyClose={false}
                title="New User Group"
            >
                <div className="pt-dialog-body">
                    <label className="pt-label">
                        Name
                        <input
                            value={this.state.name || ''}
                            name={'name'}
                            onChange={({target: {name, value}}) => this._handleInputChange(name, value)}
                            className="pt-input pt-fill"
                            type="text" dir="auto" />
                    </label>
                    <label className="pt-label">
                        Policies
                        <Policies
                            onChange={({value}) => this._handleInputChange('policies', value)}
                            values={this.state.policies}/>
                    </label>
                    <label className="pt-label">
                        Level
                        <div className="pt-select">
                            <select
                                value={this.state.levelType || ''}
                                name={'levelType'}
                                onChange={({target: {name, value}}) => this._handleInputChange(name, value)}>

                                {(disableLocationsSelection('region') 
                                    || disableLocationsSelection('district')) ? null : (
                                        <option value="country">Country</option>
                                    )}

                                {(disableLocationsSelection('district')) ? null : (
                                        <option value="region">Region</option>
                                    )}
                                
                                <option value="district">District</option>
                            </select>
                        </div>
                    </label>
                    {this.state.levelType === 'country' || !this.state.levelType
                        ? null
                        : (
                            <label className="pt-label">
                                {this.state.levelType === "region" && <RegionLevel/>}
                                {this.state.levelType === "district" && [
                                    <RegionLevel key={'region'}/>,
                                    <DistrictLevel key={'district'}/>
                                ]}
                            </label>
                        )
                    }
                    <label className="pt-label">
                        Description
                        <textarea
                            name={'description'}
                            onChange={({target: {name, value}}) => this._handleInputChange(name, value)}
                            value={this.state.description}
                            className="pt-input pt-fill" dir="auto"/>
                    </label>
                </div>
                <div className="pt-dialog-footer">
                    <div className="pt-dialog-footer-actions">
                        <Button
                            disabled={disableSaveButton}
                            loading={addingGroup}
                            intent={Intent.PRIMARY}
                            onClick={this._handleAddRole}
                            icon="tick"
                            text="save"
                        />
                    </div>
                </div>
            </Dialog>
        );
    }

    static propTypes = {
        history: PropTypes.object.isRequired,
        authUser: PropTypes.object.isRequired,
        OPERATION_SUCCESSFUL: PropTypes.object.isRequired,
        OPERATION_FAILED: PropTypes.object.isRequired,
        addRole: PropTypes.func.isRequired,
        addingGroup: PropTypes.bool.isRequired
    };
}

const mapStateToProps = (
    {authUser, OPERATION_FAILED, OPERATION_SUCCESSFUL, addingGroup}) => (
        {authUser, OPERATION_FAILED, OPERATION_SUCCESSFUL, addingGroup});
const mapDispatchToProps = dispatch => bindActionCreators({addRole}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(NewRole);