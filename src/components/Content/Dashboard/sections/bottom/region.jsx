import React from 'react';
import PropTypes from 'prop-types';
import {Classes} from '@blueprintjs/core';
import {connect} from "react-redux";
import Chart from './chart';
import Beneficiaries from './beneficiaries';
import Attendance from './attendance';


class Region extends React.Component{

    state = {
        level: 'region',
    };

    render(){
        // const {level} = this.state;
        const {
            // loadingDashboardSectionData: {loading, name: loadingName, level: loadingLevel},
            name} = this.props;
        // const showLoading = loading && name === loadingName && level === loadingLevel;

        return (
            <div key={name} className={`region ${Classes.ELEVATION_1}`}>
                <div className="region__title">{name}</div>
                <div className="region__stats">
                    <Beneficiaries region={name}/>
                    <Attendance region={name}/>
                </div>
                <Chart region={name}/>
            </div>
        );
    }

    static propTypes = {
        name: PropTypes.string.isRequired,
        loadingDashboardSectionData: PropTypes.object.isRequired,
    };
}


const mSP = ({loadingDashboardSectionData}) => ({loadingDashboardSectionData});

export default connect(mSP)(Region);