import React from 'react';
import {Icon, Position, Button, ButtonGroup, Popover, Tooltip, Intent} from '@blueprintjs/core';
import {Date, Health} from './rows';
import FilterList from '../../../Common/ExpandableFilterList';

import './index.css';


class Filters extends React.Component{
    constructor(props){
        super(props);

        this._onApplyFilters = this._onApplyFilters.bind(this);
        this._onClearFilters = this._onClearFilters.bind(this);
        this._handleFilterChoosen = this._handleFilterChoosen.bind(this);

        this.state = {
            filters: [
                {
                    label: "Date",
                    isExpanded: false,
                    content: <Date/>
                },
                {
                    label: "Health",
                    isExpanded: false,
                    content: <Health/>
                }
            ]
        };
    }

    _onApplyFilters(){}
    
    _onClearFilters(){}

    _handleFilterChoosen(label, value){
        console.log(label, value);
    }


    render(){

        return (
            <ButtonGroup large={false}>
                <Popover canEscapeKeyClose={false} popoverClassName="bms-popover" lazy position={Position.BOTTOM}>
                    <Tooltip content="filter" position={Position.BOTTOM} intent={Intent.NONE}>
                        <Button iconName="filter" className="" intent={Intent.PRIMARY}> 
                            <Icon iconName="slash"/>
                            1
                        </Button>
                    </Tooltip>
                    <FilterList 
                        rows={this.state.filters} 
                        onDone={this._onApplyFilters} 
                        onClear={this._onClearFilters} />
                </Popover>
            </ButtonGroup>
        );
    }
}

export default Filters;
