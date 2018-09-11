import React from 'react';
import {BENEFICIARIES, DAILY_ATTENDANCE, DEVICES, MONTHLY_ATTENDANCE} from "./quickView";
import QuickView from './quickView';


const STATS = [
    {name: BENEFICIARIES},
    {name: DEVICES},
    {name: DAILY_ATTENDANCE},
    {name: MONTHLY_ATTENDANCE},
];

export default class Top extends React.Component{

    render(){
        const stats = STATS.map(({name}) => {
            console.log('quick view', name);
            return (
                <QuickView key={name} name={name}/>
            );
        });

        return (
            <div className="dashboard__top">
                {stats}
            </div>
        );
    }
}