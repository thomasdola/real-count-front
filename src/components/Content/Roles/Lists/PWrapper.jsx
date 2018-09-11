import React from 'react';
import {
    Alert,
    Button,
    ButtonGroup,
    Checkbox,
    Classes,
    Collapse,
    Colors,
    Icon,
    Intent,
    Tag,
    Text
} from '@blueprintjs/core';
import {Link, withRouter} from 'react-router-dom';
import PropTypes from "prop-types";
import Fuse from 'fuse.js';
import _isEqual from 'lodash/isEqual';
import _cloneDeep from 'lodash/cloneDeep';
import _filter from 'lodash/filter';
import {connect} from "react-redux";

import {ROLES} from '../../../../api/constants/Gates';
import {ROLE, POLICY} from '../../../../api/constants/Entities';
import {DELETE, EDIT} from '../../../../api/constants/Actions';
import Can from "../../../../helpers/Can";

class PWrapper extends React.Component {

    constructor(props){
        super(props);

        this._handleRowClick = this._handleRowClick.bind(this);
        this._handleRowSelect = this._handleRowSelect.bind(this);
        this._handleDeletePolicyCancel = this._handleDeletePolicyCancel.bind(this);
        this._handleDeletePolicyConfirm = this._handleDeletePolicyConfirm.bind(this);
        this._handleOnDeleteClick = this._handleOnDeleteClick.bind(this);
        this._onSearchQueryChange = this._onSearchQueryChange.bind(this);
        this._onKeyPress = this._onKeyPress.bind(this);
        this._handleOnAdd = this._handleOnAdd.bind(this);
        this._handleClearQuery = this._handleClearQuery.bind(this);
    }

    state = {
        rows: [],
        rowsBuffer: [],
        deletePolicyAlert: false,
        filterQuery: '',
        toBeDeleted: null
    };

    static getDerivedStateFromProps(nextProps, prevState){
        const {data} = nextProps;
        const {rows: oldRows} = prevState;

        if(_isEqual(data, oldRows))
            return null;

        return { rows: data, rowsBuffer: _cloneDeep(data) };
    }

    // static _formatData(data){
    //     return data.map(item => ({...item, isExpanded: false, isSelected: false}));
    // }

    _handleRowClick(clicked){
        const rows = this.state.rows.map(row => {
            if(row.uuid === clicked.uuid){
                row.isExpanded = !row.isExpanded;
            }
            return row;
        });
        const rowsBuffer = this.state.rowsBuffer.map(row => {
            if(row.uuid === clicked.uuid){
                row.isExpanded = !row.isExpanded;
            }
            return row;
        });
        this.setState({rows, rowsBuffer});
    }

    _handleRowSelect(selected){
        const rows = this.state.rows.map(row => {
            if(row.uuid === selected.uuid){
                row.isSelected = !row.isSelected;
            }
            return row;
        });
        const rowsBuffer = this.state.rowsBuffer.map(row => {
            if(row.uuid === selected.uuid){
                row.isSelected = !row.isSelected;
            }
            return row;
        });
        this.setState({rows, rowsBuffer});
    }

    _handleOnAdd(){
        const policies = _filter(this.state.rowsBuffer, {isSelected: true});
        if(policies.length > 0 && this.props.addMorePolicyToGroup){
            this.props.addMorePolicyToGroup(policies);
        }
    }

    _handleDeletePolicyCancel(){
        this.setState({deletePolicyAlert: false, toBeDeleted: null});
    }
    _handleDeletePolicyConfirm(){
        this.props.deletePolicy(this.state.toBeDeleted);
        this.setState({deletePolicyAlert: false, toBeDeleted: null});
    }

    _handleOnDeleteClick(policy){
        this.setState({deletePolicyAlert: true, toBeDeleted: policy});
    }

    _buildRowContent(row, {editRoleActionAllowed, deletePolicyActionAllowed, editPolicyActionAllowed}){
        const {gate, entity, actions, description, uuid} = row;
        const {location: {search}} = this.props;
        return (
            <div style={{position: 'relative'}} className="bms-collapse-row-content">
                <section className="list">
                    <span className="key">
                        <Icon color={Colors.GRAY2} icon="th-derived"/></span>
                    <div className="value">{gate.name}</div>
                </section>
                <section className="list">
                    <span className="key">
                        <Icon color={Colors.GRAY2} icon="tag"/></span>
                    <div className="value">{entity.name}</div>
                </section>
                <section className="list">
                    <span className="key">
                        <Icon color={Colors.GRAY2} icon="wrench"/></span>
                    <div className="value">
                        {actions.map(({id,name}) => [
                            <Tag intent={Intent.SUCCESS} className="pt-minimal" key={id}>{name}</Tag>,
                            <Icon key={`${id}_gap`} icon={'blank'}/>
                        ])}
                    </div>
                </section>
                <section className="list">
                    <span className="key">
                        <Icon color={Colors.GRAY2} icon="more"/></span>
                    <div className="value">{description}</div>
                </section>
                <ButtonGroup style={{position: 'absolute', top: '10px', right: '5px'}} vertical className="pt-small">
                    {editPolicyActionAllowed && (
                        <Link to={`/roles/policies/${uuid}/edit${search}`}
                          className="pt-button pt-minimal pt-intent-primary pt-small pt-icon-edit"/>
                    )}
                    <Button
                        disabled={!deletePolicyActionAllowed && !editRoleActionAllowed}
                        className="pt-small pt-minimal"
                        intent={Intent.DANGER}
                        onClick={() => this._handleOnDeleteClick(row)} icon="cross"/>
                </ButtonGroup>
            </div>
        );
    }

    _onSearchQueryChange({target: {value}}){
        this.setState(() => ({filterQuery: value}));
        if(value.trim()){
            this._filterData(value);
        }else{
            this._handleClearQuery()
        }
    }

    _handleClearQuery(){
        this.setState(() => ({filterQuery: '', rows: _cloneDeep(this.state.rowsBuffer)}));
    }

    _filterData(query){
        const fuse = new Fuse(this.state.rowsBuffer, {keys: ['name']});
        const rows = _cloneDeep(fuse.search(query));
        this.setState({rows});
    }

    _onKeyPress({keyCode}){
        if(keyCode === 13 && this.state.filterQuery.trim()){
            this._filterData(this.state.filterQuery);
        }
    }

    render(){
        const {deletingPolicy, editingPolicy, user} = this.props;

        const editPolicyActionAllowed = user.root ? true : Can.User(user).perform(EDIT, POLICY, ROLES);
        const deletePolicyActionAllowed = user.root ? true : Can.User(user).perform(DELETE, POLICY, ROLES);
        const editRoleActionAllowed = user.root ? true : Can.User(user).perform(EDIT, ROLE, ROLES);

        const rows = this.state.rows.map(function(row){
            return (
                <div key={row.uuid} className="bms-collapse-row">
                    <div
                        className={`bms-collapse-row-label bms-collapse-row-label-plain
                        ${row.isSelected && Classes.INTENT_PRIMARY}`} >
                        {this.props.selectable ? (
                            <Checkbox
                                disabled={row.disabled}
                                checked={row.isSelected || ''}
                                onChange={() => this._handleRowSelect(row)}>
                                {row.name}
                            </Checkbox>
                        ) : (
                            <Text>
                                {row.name}
                            </Text>
                        )}
                        <Button
                            disabled={deletingPolicy || editingPolicy}
                            className="pt-minimal pt-small"
                            onClick={() => this._handleRowClick(row)}
                            icon={row.isExpanded ? 'caret-up' : 'caret-down'}/>
                    </div>
                    <Collapse keepChildrenMounted={true} isOpen={row.isExpanded}>
                        {this._buildRowContent(row, {editPolicyActionAllowed, editRoleActionAllowed, deletePolicyActionAllowed})}
                    </Collapse>
                </div>
            );
        }.bind(this));

        const canAdd = _filter(this.state.rowsBuffer, {isSelected: true}).length > 0;

        return (
            <div style={{height: '100%'}} className="bms-collapse">
                {this.props.filterable && (
                    <div className="bms-collapse-header">
                        <input
                            value={this.state.filterQuery || ''}
                            onKeyDown={this._onKeyPress}
                            onChange={this._onSearchQueryChange}
                            type="text" className="pt-input pt-fill bms-small" placeholder="filter..." />
                        <Button
                            loading={this.props.editingGroup}
                            onClick={this._handleOnAdd}
                            disabled={!canAdd}
                            text={'add'} className={`pt-small ${canAdd ? 'pt-intent-primary' : ''}`}/>
                    </div>
                )}

                <div style={{height: '100%', overflowY: 'auto'}}>
                    {rows}
                </div>

                <Alert
                    cancelButtonText="Cancel"
                    confirmButtonText="Delete"
                    icon="trash"
                    intent={Intent.DANGER}
                    isOpen={this.state.deletePolicyAlert}
                    onCancel={this._handleDeletePolicyCancel}
                    onConfirm={this._handleDeletePolicyConfirm}
                >
                    <p>
                        Are you sure you want to delete this policy?
                    </p>
                </Alert>
            </div>
        );
    }

    static propTypes = {
        location: PropTypes.object.isRequired,
        data: PropTypes.array.isRequired,
        deletePolicy: PropTypes.func.isRequired,
        addMorePolicyToGroup: PropTypes.func,
        deletingPolicy: PropTypes.bool.isRequired,
        editingPolicy: PropTypes.bool.isRequired,
        editingGroup: PropTypes.bool,
        selectable: PropTypes.bool,
        filterable: PropTypes.bool,
    };
}

export default withRouter(connect()(PWrapper));