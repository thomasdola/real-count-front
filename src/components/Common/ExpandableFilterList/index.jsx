import React from 'react';
import PropTypes from 'prop-types';
import {
    Button, 
    Collapse,
    Checkbox
} from '@blueprintjs/core';
import "./index.css";


export default class Filter extends React.Component {
    
    constructor(props){
        super(props);

        this._handleRowClick = this._handleRowClick.bind(this);
        this._handleClearFilters = this._handleClearFilters.bind(this);
        this._handleApplyFilters = this._handleApplyFilters.bind(this);

        this.state = {
            rows: this.props.filters,
            selected: {}
        };
    }

    static propTypes = {
        filters: PropTypes.array.isRequired,
        onClearFilters: PropTypes.func.isRequired,
        onApplyFilters: PropTypes.func.isRequired,
        onFilterSelect: PropTypes.func.isRequired,
        onFilterChosen: PropTypes.func.isRequired
    };

    _handleRowClick(row){
        this.props.onFilterSelect(row);
    }

    _handleClearFilters(){
        this.props.onClearFilters();
    }

    _handleApplyFilters(){
        this.props.onApplyFilters();
    }

    render(){
        const {onFilterChosen} = this.props;
        const rows = this.props.filters.map(function(row){
            return (
                <div key={row.label} className="bms-collapse-row">
                    <div className="bms-collapse-row-label" >
                        <Checkbox
                            disabled={row.disabled}
                            checked={row.isExpanded} 
                            onChange={() => this._handleRowClick(row)}>
                            {row.label}
                        </Checkbox>
                    </div>
                    <Collapse keepChildrenMounted={true} isOpen={row.isExpanded}>
                        <div className="bms-collapse-row-content">
                            <row.body.component {...row.body.props} onChange={onFilterChosen}/>
                        </div>
                    </Collapse>
                </div>
            );
        }.bind(this));

        return (
            <div>
                <div className="header">
                    <Button
                        className="pt-small"
                        onClick={this._handleClearFilters}>clear</Button>
                    <Button
                        className="pt-small"
                        onClick={this._handleApplyFilters}>done</Button>
                </div>
                <div className="bms-collapse">
                    {rows}
                </div>
            </div>
        );
    }
};