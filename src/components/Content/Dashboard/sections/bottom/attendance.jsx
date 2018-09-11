import React from 'react';
import PropTypes from 'prop-types';
import {loadData} from '../../../../../actions/dashboardActions';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import _isEqual from 'lodash/isEqual';
import {
    ATTENDANCE_UPDATED,
    initSectionSocketListeners,
    onAttendanceUpdate,
    stopSectionSocketListeners
} from "../../../../../actions/socket/dashboardActions";


class Attendance extends React.Component{

    state = {
        level: 'region',
        name: 'attendance',
        total: 0,
        channel: null
    };

    componentDidMount(){
        const {loadData, region} = this.props;
        const {level, name} = this.state;
        const params = {f: `${level}|${region}:${name}`};
        loadData(params, {level, entity: name, name: region});
    }

    static getDerivedStateFromProps(nextProps, prevState){
        const {data: {level, entity, data, name: regionName}, region} = nextProps;
        const {total: oldData, name, channel: oldChannel} = prevState;
        // region_GREATER_ACCRA_attendance_channel
        const channel = `${level}_${region.split(' ').join('_')}_${name}_channel`;

        if(!_isEqual(level, 'region') || !_isEqual(entity, name) || !_isEqual(region, regionName))
            return null;

        if(_isEqual(data, oldData) && _isEqual(channel, oldChannel))
            return null;

        return {
            total: data,
            channel
        };
    }

    componentDidUpdate(prevProps, prevState){
        const {channel: oldChannel} = prevState;
        const {channel} = this.state;
        const {socket, onAttendanceUpdate} = this.props;

        if(!_isEqual(oldChannel, channel)){
            initSectionSocketListeners(socket, {channel,
                hooks: [
                    {event: ATTENDANCE_UPDATED, listener: onAttendanceUpdate}
                ]
            })
        }
    }

    componentWillUnmount(){
        const {socket} = this.props;
        const {channel} = this.state;
        stopSectionSocketListeners(socket, {channel, events: [ATTENDANCE_UPDATED]})
    }

    render(){
        const {total} = this.state;
        return (
            <div className="region__stats__row">
                <span>attendance</span>
                <span>{parseInt(total, 10) ? total : 0}</span>
            </div>
        );
    }

    static propTypes = {
        region: PropTypes.string.isRequired,

        data: PropTypes.object.isRequired,
        socket: PropTypes.object.isRequired,

        loadData: PropTypes.func.isRequired,
        onAttendanceUpdate: PropTypes.func.isRequired,
    };
}


const mSP = ({liveStats, socket}) => ({data: liveStats, socket});
const mDP = dispatch => bindActionCreators({loadData, onAttendanceUpdate}, dispatch);

export default connect(mSP, mDP)(Attendance);