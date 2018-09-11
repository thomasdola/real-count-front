import React from 'react';
import PropTypes from 'prop-types';
import {Classes, Text} from '@blueprintjs/core';
import {loadData} from '../../../../../actions/dashboardActions';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {
    ATTENDANCE_UPDATED,
    BENEFICIARIES_UPDATED,
    DEVICES_UPDATED,
    initSectionSocketListeners,
    onAttendanceUpdate,
    onBeneficiariesUpdate,
    onDevicesUpdate,
    stopSectionSocketListeners
} from "../../../../../actions/socket/dashboardActions";
import _isEqual from 'lodash/isEqual';

export const BENEFICIARIES = "beneficiaries";
export const DEVICES = "devices";
export const DAILY_ATTENDANCE = "daily attendance";
export const MONTHLY_ATTENDANCE = "monthly attendance";

class QuickView extends React.Component{

    state = {
        level: 'country',
        name: '',
        data: {},
        channel: null
    };

    componentDidMount(){
        const {loadData, name} = this.props;
        const {level} = this.state;
        const entity = name.endsWith('attendance') ? 'attendance' : name;
        loadData({f: `${level}|${entity}`}, {level, entity});
    }

    static getDerivedStateFromProps(nextProps, prevState){
        const {name, data: {level, entity, data}} = nextProps;
        const {data: oldData, level: oldLevel, channel: oldChannel} = prevState;
        // country_beneficiaries_channel
        // country_devices_channel
        // country_daily_attendance_channel
        // country_monthly_attendance_channel
        const channel = `${oldLevel}_${name}_channel`;
        const currentEntity = name.endsWith('attendance') ? 'attendance' : name;

        if(!_isEqual(level, 'country') || !_isEqual(entity, currentEntity))
            return null;

        const currentData = _isEqual(currentEntity, 'attendance') ? (
            name.startsWith('daily') ? data.daily : data.monthly
        ) : {...oldData, ...data};

        if(_isEqual(oldData, currentData) && _isEqual(channel, oldChannel))
            return null;

        return {
            name, data: currentData, channel
        };
    }

    componentDidUpdate(prevProps, prevState){
        const {channel: oldChannel} = prevState;
        const {channel, name} = this.state;
        const {socket, onBeneficiariesUpdate, onAttendanceUpdate, onDevicesUpdate} = this.props;
        let hooks = [];

        if(_isEqual(name, BENEFICIARIES))
            hooks = [{event: BENEFICIARIES_UPDATED, listener: onBeneficiariesUpdate}];

        if(_isEqual(name, DEVICES))
            hooks = [{event: DEVICES_UPDATED, listener: onDevicesUpdate}];

        if(_isEqual(name, DAILY_ATTENDANCE) || _isEqual(name, MONTHLY_ATTENDANCE))
            hooks = [{event: ATTENDANCE_UPDATED, listener: onAttendanceUpdate}];

        if(!_isEqual(oldChannel, channel))
            initSectionSocketListeners(socket, {channel, hooks});
    }

    componentWillUnmount(){
        const {socket} = this.props;
        const {channel, name} = this.state;
        let events = [];

        if(_isEqual(name, BENEFICIARIES))
            events = [BENEFICIARIES_UPDATED];

        if(_isEqual(name, DEVICES))
            events = [DEVICES_UPDATED];

        if(_isEqual(name, DAILY_ATTENDANCE) || _isEqual(name, MONTHLY_ATTENDANCE))
            events = [ATTENDANCE_UPDATED];

        stopSectionSocketListeners(socket, {channel, events})
    }

    render(){
        const {data} = this.state;
        // const {loadingDashboardSectionData: {loading, name: loadingName, level: loadingLevel}} = this.props;
        // const showLoading = loading && loadingLevel === level && name === loadingName;

        const stats = (name, data) => {
            switch(name){
                case BENEFICIARIES:
                    return (
                        <div className="top">
                            <span className="success">
                                {data.valid}
                            </span> /
                                    <span>
                                {data.total}
                            </span>
                        </div>
                    );
                case DEVICES:
                    return (
                        <div className="top">
                            <span className="success">
                                {data.online}
                            </span> /
                            <span>
                                {data.total}
                            </span>
                        </div>
                    );
                case DAILY_ATTENDANCE:
                    return (
                        <div className="top">
                            <span>{parseInt(data, 10) ? data : 0}</span>
                        </div>
                    );
                case MONTHLY_ATTENDANCE:
                    return (
                        <div className="top">
                            <span>{parseInt(data, 10) ? data : 0}</span>
                        </div>
                    );
                default:
                    return null;
            }
        };

        return (
            <div className={`box ${Classes.ELEVATION_1}`}>
                {stats(this.props.name, data)}
                <div className="down">
                    <Text ellipsize>
                        {this.props.name}
                    </Text>
                </div>
            </div>
        );
    }

    static propTypes = {
        name: PropTypes.string.isRequired,

        data: PropTypes.object.isRequired,
        socket: PropTypes.object.isRequired,

        loadingDashboardSectionData: PropTypes.object.isRequired,

        loadData: PropTypes.func.isRequired,
        onBeneficiariesUpdate: PropTypes.func.isRequired,
        onAttendanceUpdate: PropTypes.func.isRequired,
        onDevicesUpdate: PropTypes.func.isRequired,
    };
}


const mSP = ({liveStats, socket, loadingDashboardSectionData}) => (
    {data: liveStats, socket, loadingDashboardSectionData});
const mDP = dispatch => bindActionCreators({loadData, onBeneficiariesUpdate, onAttendanceUpdate, onDevicesUpdate}, dispatch);

export default connect(mSP, mDP)(QuickView);