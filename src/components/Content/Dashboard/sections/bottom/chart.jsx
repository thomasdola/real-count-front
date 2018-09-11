import React from 'react';
import PropTypes from 'prop-types';
import {loadData} from '../../../../../actions/dashboardActions';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import _isEqual from 'lodash/isEqual';
import {Colors} from "@blueprintjs/core/lib/esm/index";
import {Bar, BarChart, ResponsiveContainer} from "recharts";
import {
    ATTENDANCE_UPDATED,
    BENEFICIARIES_UPDATED,
    initSectionSocketListeners,
    onAttendanceUpdate,
    onBeneficiariesUpdate,
    stopSectionSocketListeners
} from "../../../../../actions/socket/dashboardActions";

const TinyBarChart = ({data}) => {
    return (
        <ResponsiveContainer minHeight={100}>
            <BarChart width={600} height={300} data={data}
                      margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                <Bar dataKey="attendance" fill={Colors.BLUE5} />
                <Bar dataKey="beneficiaries" fill={Colors.TURQUOISE5} />
            </BarChart>
        </ResponsiveContainer>
    );
};

class Chart extends React.Component{

    state = {
        level: 'region',
        name: 'chart',
        data: [],
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
        // region_GREATER_ACCRA_chart_channel
        const channel = `${level}_${region.split(' ').join('_')}_${name}_channel`;

        if(!_isEqual(level, 'region') || !_isEqual(entity, name) || !_isEqual(region, regionName))
            return null;

        if(_isEqual(data, oldData) && _isEqual(channel, oldChannel))
            return null;

        return {
            data, channel
        };
    }

    componentDidUpdate(prevProps, prevState){
        const {channel: oldChannel} = prevState;
        const {channel} = this.state;
        const {socket, onAttendanceUpdate, onBeneficiariesUpdate} = this.props;

        if(!_isEqual(oldChannel, channel)){
            initSectionSocketListeners(socket, {channel,
                hooks: [
                    {event: BENEFICIARIES_UPDATED, listener: onBeneficiariesUpdate},
                    {event: ATTENDANCE_UPDATED, listener: onAttendanceUpdate}
                ]
            })
        }
    }

    componentWillUnmount(){
        const {socket} = this.props;
        const {channel} = this.state;
        stopSectionSocketListeners(socket, {channel, events: [BENEFICIARIES_UPDATED, ATTENDANCE_UPDATED]})
    }

    render(){
        const {data: chart} = this.state;

        return (
            <div className="region__chart">
                <TinyBarChart data={chart}/>
            </div>
        );
    }

    static propTypes = {
        region: PropTypes.string.isRequired,

        data: PropTypes.object.isRequired,
        socket: PropTypes.object.isRequired,

        loadData: PropTypes.func.isRequired,
        onBeneficiariesUpdate: PropTypes.func.isRequired,
        onAttendanceUpdate: PropTypes.func.isRequired,
    };
}


const mSP = ({liveStats, socket}) => ({data: liveStats, socket});
const mDP = dispatch => bindActionCreators({loadData, onBeneficiariesUpdate, onAttendanceUpdate}, dispatch);

export default connect(mSP, mDP)(Chart);