import React from 'react';
import {format} from "date-fns";

export default class DateTime extends React.Component{

    constructor(props){
        super(props);

        this._startTime = this._startTime.bind(this);
    }

    state = {
        time: '',
        date: '',
        timeout: null
    };

    componentDidMount(){
        this.setState({timeout: this._startTime()});
    }

    componentWillUnmount(){
        const {timeout} = this.state;
        if(timeout){
            clearTimeout(timeout);
        }
    }

    _startTime() {
        const today = new Date();
        let h = today.getHours();
        let m = today.getMinutes();
        let s = today.getSeconds();
        let session = "AM";
        if(h === 0){
            h = 12;
        }

        if(h > 12){
            h = h - 12;
            session = "PM";
        }

        h = `${(h < 10) ? "0" + h : h}`;
        m = `${(m < 10) ? "0" + m : m}`;
        s = `${(s < 10) ? "0" + s : s}`;

        const time = `${h}:${m}:${s} ${session}`;
        const date = format(today, 'dddd Do Of MMMM GGGG');

        this.setState({time, date});
        return setTimeout(this._startTime, 1000);
    }

    render(){
        const {date, time} = this.state;

        return (
            <div className="dashboard__middle">
                <div>
                    <span>{date}</span>
                </div>
                <div>
                    <span>{time}</span>
                </div>
            </div>
        );
    }
}