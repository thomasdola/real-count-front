import React from 'react';
import PropTypes from 'prop-types';
import {Colors} from '@blueprintjs/core';
import {Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    ReferenceLine, Area, ComposedChart
} from 'recharts';
import {timeStringToDecimal, decimalToTimeString, timeTo12, timeTo24, isFloat} from '../../../../helpers';


const CustomizedAxisTick = ({x, y, stroke, payload}) => {
    return (
        <g transform={`translate(${x},${y})`}>
            <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">{payload.value}</text>
        </g>
    );
};

const CustomizedLabel = ({x, y, stroke, value}) => {
    return(
        <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">
            {timeTo12(decimalToTimeString(value))}
        </text>
    );
};

class Chart extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            clockIn: true,
            clockOut: true,
            duration: true,
            inReference: {
                visible: false,
                label: "Clock In",
                color: Colors.BLUE2,
                time: 5
            },
            outReference: {
                visible: false,
                label: "Clock Out",
                color: Colors.BLUE2,
                time: 13
            },
            data: []
        };

        this._fullLabelName = this._fullLabelName.bind(this);
        this._tooltipFormatter = this._tooltipFormatter.bind(this);
    }

    static propTypes = {
        data: PropTypes.array.isRequired
    };

    componentWillMount(){
        const data = this._formatData(this.props.data);
        this.setState(() => ({data}));
    }

    componentWillReceiveProps(nextProps){
        const data = this._formatData(nextProps.data);
        this.setState(() => ({data}));
    }

    _formatData(data){
        return data.map(d => {
            // console.log(d);
            const inDecimalTime = this._from12ToDecimal(d.in);
            const outDecimalTime = this._from12ToDecimal(d.out);
            console.log(inDecimalTime, outDecimalTime);
            return Object.assign({}, d, {in: inDecimalTime, out: outDecimalTime});
        });
    }

    _from12ToDecimal(time){
        return timeStringToDecimal(timeTo24(time));
    }

    _fullLabelName(label){
        if(label === 'Mon') return 'Monday';
        if(label === 'Tue') return 'Tuesday';
        if(label === 'Wed') return 'Wednesday';
        if(label === 'Thu') return 'Thursday';
        if(label === 'Fri') return 'Friday';
        if(label === 'Sat') return 'Saturday';
        if(label === 'Sun') return 'Sunday';
        return label;
    }

    _tooltipFormatter(number){
        if(isFloat(number)){
            return timeTo12(decimalToTimeString(number))
        }else{
            return number;
        }
    }


    render(){
        const { clockIn, clockOut, duration, inReference, outReference, data } = this.state;
        return (
            <ResponsiveContainer minHeight={200}>
                <ComposedChart data={data}>
                    <XAxis dataKey="day" padding={{left: 20, right: 20}} height={60} tick={<CustomizedAxisTick/>}/>
                    <YAxis hide/>
                    <CartesianGrid strokeDasharray="3 3"/>

                     <Tooltip
                         formatter={this._tooltipFormatter}
                         labelFormatter={label => this._fullLabelName(label)}/>

                    <Legend />
                    {
                        inReference.visible &&
                        <ReferenceLine
                            y={inReference.time}
                            stroke={inReference.color}
                            label={inReference.label}/>
                    }

                    {
                        outReference.visible &&
                        <ReferenceLine
                            y={outReference.time}
                            stroke={outReference.color}
                            label={outReference.label}/>
                    }

                    {
                        duration && 
                        <Area 
                            type='monotone' 
                            dataKey='duration' 
                            fill={Colors.INDIGO3} 
                            stroke={Colors.INDIGO3}/>
                    }
                    { clockIn &&
                    <Line 
                        type="monotone" 
                        dataKey="in" 
                        dot={{ strokeWidth: 2 }}
                        stroke={Colors.GREEN4} 
                        label={<CustomizedLabel/>}  
                        activeDot={{r: 8}}/>
                    }
                    { clockOut &&
                    <Line 
                        type="monotone" 
                        dataKey="out" 
                        dot={{ strokeWidth: 2 }}
                        stroke={Colors.RED4} 
                        label={<CustomizedLabel/>}  
                        activeDot={{r: 8}}/>
                    }
                </ComposedChart>
            </ResponsiveContainer>
        );
    }
}

export default Chart;