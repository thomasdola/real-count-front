import React from 'react';
import Region from './region';


const REGIONS = [
    {
        name: 'WESTERN'
    },
    {
        name: 'CENTRAL'
    },
    {
        name: 'GREATER ACCRA'
    },
    {
        name: 'VOLTA'
    },
    {
        name: 'EASTERN'
    },
    {
        name: 'ASHANTI'
    },
    {
        name: 'BRONG AHAFO'
    },
    {
        name: 'NORTHERN'
    },
    {
        name: 'UPPER EAST'
    },
    {
        name: 'UPPER WEST'
    }
];

export default class Bottom extends React.Component{

    render(){

        const regions = REGIONS.map(({name}) => (
            <Region key={name} name={name}/>
        ));

        return (
            <div className="dashboard__bottom">
                <div className="row">
                    {regions.slice(0, 5)}
                </div>
                <div className="row">
                    {regions.slice(5)}
                </div>
            </div>
        );
    }
}