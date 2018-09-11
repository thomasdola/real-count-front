import React from 'react';
import {Button, ButtonGroup, Icon, Tag} from '@blueprintjs/core';
import {Link} from 'react-router-dom';
import PropTypes from "prop-types";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {deletePolicy, editPolicy} from '../../../../actions/policyActions';
import {Motion, spring} from "react-motion";
import Dimensions from 'react-dimensions';


class Policies extends React.Component {
    
    constructor(props){
        super(props);

        this._handleRowClick = this._handleRowClick.bind(this);
        this._handleRowSelect = this._handleRowSelect.bind(this);
        this._handleDeletePolicyCancel = this._handleDeletePolicyCancel.bind(this);
        this._handleDeletePolicyConfirm = this._handleDeletePolicyConfirm.bind(this);
        this._handleOnDeleteClick = this._handleOnDeleteClick.bind(this);
        this._onSearchQueryChange = this._onSearchQueryChange.bind(this);
        this._onKeyPress = this._onKeyPress.bind(this);

        this.state = {
            open: true
        };
    }

    static propTypes = {
        data: PropTypes.array.isRequired,
        deletePolicy: PropTypes.func.isRequired,
        editPolicy: PropTypes.func.isRequired,
        deletingPolicy: PropTypes.bool.isRequired,
        editingPolicy: PropTypes.bool.isRequired,
        containerWidth: PropTypes.number.isRequired,
        containerHeight: PropTypes.number.isRequired,
        open: PropTypes.bool.isRequired,
    };

    componentWillReceiveProps(nextProps){
        const rows = nextProps.data.map(item => ({...item, isExpanded: false, isSelected: false}));
        this.setState({rows});
    }

    _handleRowClick(clicked){
        const rows = this.state.rows.map(row => {
            if(row.uuid === clicked.uuid){
                row.isExpanded = !row.isExpanded;
            }
            return row;
        });
        this.setState({rows});
    }

    _handleRowSelect(selected){
        const rows = this.state.rows.map(row => {
            if(row.uuid === selected.uuid){
                row.isSelected = !row.isSelected;
            }
            return row;
        });
        this.setState({rows});
    }

    _handleDeletePolicyCancel(){
        this.setState({deletePolicyAlert: false});
    }
    _handleDeletePolicyConfirm(){
        this.setState({deletePolicyAlert: false});
    }

    _handleOnDeleteClick(policy){
        console.log('deleting policy', policy);
        this.setState({deletePolicyAlert: true});
    }

    _buildRowContent(row){
        const {gate, entity, actions, description, uuid} = row;
        return (
            <div style={{position: 'relative'}} className="bms-collapse-row-content">
                <section className="list">
                    <span className="key">
                        <Icon icon="th-derived"/>Page:</span>
                    <div className="value">{gate.name}</div>
                </section>
                <section className="list">
                    <span className="key">
                        <Icon icon="tag"/>Entity:</span>
                    <div className="value">{entity.name}</div>
                </section>
                <section className="list">
                    <span className="key">
                        <Icon icon="wrench"/>Actions:</span>
                    <div className="value">
                        {actions.map(({id,name}) => [
                            <Tag className="pt-minimal" key={id}>{name}</Tag>,
                            <Icon key={`${id}_gap`} icon={'blank'}/>
                        ])}
                    </div>
                </section>
                <section className="list">
                    <span className="key">
                        <Icon icon="more"/></span>
                    <div className="value">{description}</div>
                </section>
                <ButtonGroup style={{position: 'absolute', top: '10px', right: '5px'}} vertical className="pt-small">
                    <Link to={`/roles/policies/${uuid}/edit`} className="pt-button pt-small pt-icon-edit"/>
                    <Button className="pt-small" onClick={() => this._handleOnDeleteClick(row)} icon="trash"/>
                </ButtonGroup>
            </div>
        );
    }

    _onSearchQueryChange({target: {value}}){
        this.setState(() => ({filterQuery: value}));
    }

    _onKeyPress({keyCode}){
        if(keyCode === 13){
            // this._onFilter();
            console.log('filter');
        }
    }

    render(){
        const {data, editingPolicy, deletingPolicy, containerWidth, containerHeight, open} = this.props;
        console.log(containerWidth, containerHeight);
        return (
            <Motion style={{x: spring(open ? containerWidth : 0)}}>
                {({x}) => {
                    let styles = {
                        WebkitTransform: `translate3d(${x}px, 0, 0)`,
                        transform: `translate3d(${x}px, 0, 0)`,
                    };

                    return (
                        <div>
                            <div className="demo0-block" style={{
                                WebkitTransform: `translate3d(${x}px, 0, 0)`,
                                transform: `translate3d(${x}px, 0, 0)`,
                            }} />
                        </div>
                    )
                }}
            </Motion>
        );
    }
}

const mapStateToProps = ({editingPolicy, deletingPolicy}) => ({editingPolicy, deletingPolicy});
const mapDispatchToProps = dispatch => bindActionCreators({editPolicy, deletePolicy}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Dimensions()(Policies))