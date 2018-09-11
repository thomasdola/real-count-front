import React from 'react';
import PropTypes from 'prop-types';
import {Checkbox} from '@blueprintjs/core';
import _isEqual from 'lodash/isEqual';
import {loadSchedules, updateSchedule} from "../../../../actions/backupActions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {UPDATE_BACKUP_SCHEDULE} from "../../../../actions/types";
import {Intent} from "@blueprintjs/core/lib/esm/index";
import Toaster from "../../../Common/Toaster";

import {BACKUPS} from '../../../../api/constants/Gates';
import {BACKUP_SCHEDULE} from '../../../../api/constants/Entities';
import {EDIT} from '../../../../api/constants/Actions';
import Can from "../../../../helpers/Can";

class Schedules extends React.Component {
    
    constructor(props){
        super(props);

        this._handleRowClick = this._handleRowClick.bind(this);
        this._updateSchedule = this._updateSchedule.bind(this);
    }

    state = {
        rows: []
    };

    componentDidMount(){
        this.props.loadSchedules();
    }

    static getDerivedStateFromProps(nextProps, prevState){
        const {schedules} = nextProps;
        if(_isEqual(schedules, prevState.rows))
            return null;

        return {
            rows: [...schedules]
        };
    }

    componentDidUpdate(prevProps){
        const {OPERATION_SUCCESSFUL: OLD_OPERATION_SUCCESSFUL, OPERATION_FAILED: OLD_OPERATION_FAILED} = prevProps;
        const {OPERATION_SUCCESSFUL, OPERATION_FAILED} = this.props;

        if(!_isEqual(OLD_OPERATION_SUCCESSFUL, OPERATION_SUCCESSFUL)){
            const {action} = OPERATION_SUCCESSFUL;
            if(action === UPDATE_BACKUP_SCHEDULE){
                this.props.loadSchedules();
                Toaster.show({
                    message: "Backup Schedules Updated 😃",
                    intent: Intent.SUCCESS,
                    icon: 'tick'
                });
            }
        }

        if(!_isEqual(OLD_OPERATION_FAILED, OPERATION_FAILED)){
            if(OPERATION_FAILED.action === UPDATE_BACKUP_SCHEDULE){
                Toaster.show({
                    message: "Could Not Update Schedule 😞",
                    intent: Intent.DANGER,
                    icon: 'error'
                });
            }
        }
    }

    _updateSchedule(scheduleId){
        const {rows} = this.state;
        scheduleId = parseInt(scheduleId, 10);
        const newRows = rows.map(row => {
            if(row.id === scheduleId){
                return {...row, active: !row.active};
            }else{
                return row;
            }
        });
        console.log('schedules', rows, newRows);
        this.setState({
            rows: newRows
        });
    }

    _handleRowClick({id, active}){
        let data = new FormData();
        data.append('active', active ? "0" : "1");
        this.props.updateSchedule(id, data);
    }

    render(){

        const {authUser} = this.props;

        const editAcionAllowed = authUser.root ? true : Can.User(authUser).perform(EDIT, BACKUP_SCHEDULE, BACKUPS);
        
        const rows = this.state.rows.map(function(row){
            return (
                <div key={row.id} className="bms-collapse-row">
                    <div className="bms-collapse-row-label" >
                        <Checkbox
                            disabled={this.props.updatingBackupSchedule || !editAcionAllowed}
                            checked={row.active} 
                            onChange={() => this._handleRowClick(row)}>
                            <span className={row.active ? 'pt-text-muted' : ''}>{row.frequency}</span>
                        </Checkbox>
                    </div>
                </div>
            );
        }.bind(this));

        return (
            <div className="bms-collapse">
                {rows}
            </div>
        );
    }

    static propTypes = {
        authUser: PropTypes.object.isRequired,

        OPERATION_SUCCESSFUL: PropTypes.object.isRequired,
        OPERATION_FAILED: PropTypes.object.isRequired,

        loadSchedules: PropTypes.func.isRequired,
        updateSchedule: PropTypes.func.isRequired,
        updatingBackupSchedule: PropTypes.bool.isRequired,

        schedules: PropTypes.array.isRequired,
    };
}

const mapStateToProps = (
    {authUser, OPERATION_SUCCESSFUL, OPERATION_FAILED, updatingBackupSchedule, schedules}) => (
        {authUser, OPERATION_SUCCESSFUL, OPERATION_FAILED, updatingBackupSchedule, schedules});

const mapDispatchToProps = dispatch => bindActionCreators({loadSchedules, updateSchedule}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Schedules);