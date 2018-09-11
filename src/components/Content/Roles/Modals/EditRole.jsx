import React from 'react';
import PropTypes from 'prop-types';
import {Button, Dialog, Intent} from '@blueprintjs/core';
import {withRouter} from 'react-router-dom';
import _find from 'lodash/find';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {editRole} from '../../../../actions/roleActions';
import Regions from "../../../Common/filterRows/Regions";
import Districts from "../../../Common/filterRows/Districts";
import _isEqual from 'lodash/isEqual';
import {isFormValid} from "../../Enrollment";
import {EDIT_GROUP} from "../../../../actions/types";
import Toaster from "../../../Common/Toaster";

class EditRole extends React.Component{

    constructor(props){
        super(props);

        this._handleInputChange = this._handleInputChange.bind(this);
        this._handleEditRole = this._handleEditRole.bind(this);
    }

    state = {
        role: {level: {type: '', id: ''}, name: '', description: '', policies: []},
        roleBuffer: {},

        name: '',
        description: '',
        levelType: 'country',
        levelId: '1',
        regionId: '',
        districtId: '',
    };

    static getDerivedStateFromProps(nextProps, prevState){
        const {role: oldRole} = prevState;
        const {groups, match: {params: {uuid}}} = nextProps;
        let group = _find(groups, {uuid}) || {level: {scope: {}}};

        if(_isEqual(oldRole, group))
            return null;

        const {level, name, description} = group;
        const districtId = level.type === 'district' ? level.id : '';
        const regionId = _isEqual(level.type, 'region')
            ? group.level.id
            : (_isEqual(level.type, 'district') ? level.scope.region_id : '');

        return {
            role: group,
            roleBuffer: {
                name,
                description,
                levelType: group.level.type,
                levelId: group.level.id,
                regionId,
                districtId
            },
            name,
            description,
            levelType: group.level.type,
            levelId: group.level.id,
            regionId,
            districtId,
        };
    }

    componentDidUpdate(prevProps){
        const {OPERATION_SUCCESSFUL: OLD_OPERATION_SUCCESSFUL, OPERATION_FAILED: OLD_OPERATION_FAILED} = prevProps;
        const {OPERATION_SUCCESSFUL, OPERATION_FAILED, history} = this.props;

        const role = this.state.role.name && this.state.role.name.toUpperCase();

        if(!_isEqual(OLD_OPERATION_SUCCESSFUL, OPERATION_SUCCESSFUL)){
            if(OPERATION_SUCCESSFUL.action === EDIT_GROUP){
                history.goBack();
                Toaster.show({
                    message: `Role Successfully Updated 😃`,
                    intent: Intent.SUCCESS,
                    icon: 'tick' });
            }
        }

        if(!_isEqual(OLD_OPERATION_FAILED, OPERATION_FAILED)){
            if(OPERATION_FAILED.action === EDIT_GROUP){
                console.log(OPERATION_FAILED.data);
                Toaster.show({
                    message: `Could Not Update ${role} 😞`,
                    intent: Intent.DANGER,
                    icon: 'error'
                });
            }
        }
    }

    _isFormValid(){
        const {role: {level: {type, id}, name}} = this.state;
        return isFormValid({type, id, name});
    }

    _handleInputChange(name, value){
        if(name === 'levelType' && value.startsWith('Select...')) return;

        this.setState(() => ({...this.state, [name]: value}));
    }

    _handleEditRole(){
        const {name, description, levelType, regionId, districtId} = this.state;
        const lId = levelType === "country" ? 1 : (levelType === "region" ? regionId : districtId);

        let data = new FormData();
        data.append('level_id', lId);
        data.append('level_type', levelType);
        data.append('name', name);
        data.append('description', description);

        this.props.editRole(this.state.role.uuid, data);
    }

    render(){

        const {roleBuffer, name, levelType, levelId, description, regionId, districtId} = this.state;
        const {history, editingGroup, authUser} = this.props;

        const disableLocationsSelection = type =>  _isEqual(type, authUser.role.level.type) && !authUser.root;

        const RegionLevel = () => (
            <label className="pt-label">
                Region
                <Regions
                    disabled={disableLocationsSelection('region') 
                        || disableLocationsSelection('district')}
                    small={false}
                    value={regionId || ''}
                    onChange={({value}) => this._handleInputChange('regionId', value)}/>
            </label>
        );

        const DistrictLevel = () => (
            <label className="pt-label">
                District
                <Districts
                    disabled={disableLocationsSelection('district')}
                    small={false}
                    value={districtId || ''}
                    onChange={({value}) => this._handleInputChange('districtId', value)}/>
            </label>
        );

        const disabledSaveButton = !this._isFormValid()
            || _isEqual({name, levelType, levelId, description, districtId, regionId}, roleBuffer);

        return (
            <Dialog
                backdropClassName="transparent__back"
                style={{width: '350px'}}
                lazy
                onClose={() => history.goBack()}
                icon="layer"
                isOpen
                canOutsideClickClose={false}
                canEscapeKeyClose={false}
                title={`Edit ${roleBuffer.name} Group`}
            >
                <div className="pt-dialog-body">
                    <label className="pt-label">
                        Name
                        <input
                            value={name || ''}
                            name={'name'}
                            onChange={({target: {name, value}}) => this._handleInputChange(name, value)}
                            className="pt-input pt-fill"
                            type="text" dir="auto" />
                    </label>
                    <label className="pt-label">
                        Level
                        <div className="pt-select">
                            <select
                                value={levelType || ''}
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
                    {levelType === 'country' || !levelType
                        ? null
                        : (
                            <label className="pt-label">
                                {levelType === "region" && <RegionLevel/>}
                                {levelType === "district" && [
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
                            value={description}
                            className="pt-input pt-fill" dir="auto"/>
                    </label>
                </div>
                <div className="pt-dialog-footer">
                    <div className="pt-dialog-footer-actions">
                        {/* <Button text="Secondary" /> */}
                        <Button
                            disabled={disabledSaveButton}
                            loading={editingGroup}
                            intent={Intent.PRIMARY}
                            onClick={this._handleEditRole}
                            icon="tick"
                            text="save"
                        />
                    </div>
                </div>
            </Dialog>
        );
    }

    static propTypes = {
        authUser: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        OPERATION_FAILED: PropTypes.object.isRequired,
        OPERATION_SUCCESSFUL: PropTypes.object.isRequired,
        groups: PropTypes.array.isRequired,
        editRole: PropTypes.func.isRequired,
        editingGroup: PropTypes.bool.isRequired,
    }
}

const mapStateTopProps = (
    {authUser, OPERATION_FAILED, OPERATION_SUCCESSFUL, userGroups, editingGroup}) => (
        {authUser, OPERATION_FAILED, OPERATION_SUCCESSFUL, groups: userGroups, editingGroup});
const mapDispatchToProps = dispatch => bindActionCreators({editRole}, dispatch);

export default withRouter(connect(mapStateTopProps, mapDispatchToProps)(EditRole));