import React from 'react';
import PropTypes from 'prop-types';
import _isEqual from 'lodash/isEqual';

import Regions from '../../../Common/filterRows/Regions';
import Districts from '../../../Common/filterRows/Districts';
import Locations from '../../../Common/filterRows/Locations';

const Levels = ({user, handleLevelIdChange, handleLevelTypeChange, region, district, location, levelId, levelType}) => {

    const disableLocationsSelection = type =>  _isEqual(type, user.role.level.type) && !user.root;
    
    const RegionLevel = () => (
        <label className="pt-label">
            Region
            <Regions
                disabled={disableLocationsSelection('region') 
                    || disableLocationsSelection('district')
                    || disableLocationsSelection('location')}
                small={false}
                value={region || ''}
                onChange={value => handleLevelIdChange('2', value)}/>
        </label>
    );

    const DistrictLevel = () => (
        <label className="pt-label">
            District
            <Districts
                disabled={disableLocationsSelection('district')
                    || disableLocationsSelection('location')}
                dependent={true}
                small={false}
                value={district || ''}
                onChange={value => handleLevelIdChange('3', value)}/>
        </label>
    );

    const LocationLevel = () => (
        <label className="pt-label">
            Location
            <Locations
                disabled={disableLocationsSelection('location')}
                dependent={true}
                small={false}
                value={location || ''}
                onChange={value => handleLevelIdChange('4', value)}/>
        </label>
    );

    return [
        <label key="levelInput" className="pt-label">
            Level
            <div className="pt-select">
                <select
                    value={levelType || ''}
                    onChange={({target: {value}}) => handleLevelTypeChange(value)}
                >

                    {(disableLocationsSelection('region') 
                    || disableLocationsSelection('district')
                    || disableLocationsSelection('location')) ? null : (
                        <option value="1">Country</option>
                    )}

                    {(disableLocationsSelection('district')
                    || disableLocationsSelection('location')) ? null : (
                        <option value="2">Region</option>
                    )}

                    {(disableLocationsSelection('location')) ? null : (
                        <option value="3">District</option>
                    )}
                    
                    <option value="4">Location</option>
                </select>
            </div>
        </label>,

        levelType === "2" && <RegionLevel key="region"/>,

        levelType === "3" && [
            <RegionLevel key={'region'}/>,
            <DistrictLevel key={'district'}/>
        ],

        levelType === "4" && [
            <RegionLevel key={'region'}/>,
            <DistrictLevel key={'district'}/>,
            <LocationLevel key={'location'}/>
        ]

    ];
};

Levels.propTypes = {
    user: PropTypes.object.isRequired,
    handleLevelIdChange: PropTypes.func.isRequired,
    handleLevelTypeChange: PropTypes.func.isRequired,
    region: PropTypes.any.isRequired,
    district: PropTypes.any.isRequired,
    location: PropTypes.any.isRequired,
    levelType: PropTypes.any.isRequired,
    levelId: PropTypes.any.isRequired,
};

export default Levels;