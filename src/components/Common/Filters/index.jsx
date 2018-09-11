import React from 'react';
import PropTypes from 'prop-types';
import {Button, ButtonGroup, Icon, Popover, PopoverInteractionKind, Position, Tooltip} from '@blueprintjs/core';
import _find from 'lodash/find';
import _filter from 'lodash/filter';
import _camelCase from 'lodash/camelCase';
import _isEqual from 'lodash/isEqual';
import FilterList from '../ExpandableFilterList';
import {parseDateFilter} from "../filterRows/Date";
import {parseTimeFilter} from "../filterRows/Time";

import './index.css';

export function parseFilters(filters){
    return filters.split(',').map(f => {
        const [label, value] = f.split('|');
        if(label === 'in' || label === 'out') return parseTimeFilter(f);
        if(label === 'date') return parseDateFilter(f);
        return {label, value};
    });
}

class Filters extends React.Component{
    constructor(props){
        super(props);

        this._onApplyFilters = this._onApplyFilters.bind(this);
        this._onClearFilters = this._onClearFilters.bind(this);
        this._onSelectFilter = this._onSelectFilter.bind(this);
        this._handleFilterChosen = this._handleFilterChosen.bind(this);
    }

    state = {
        rows: []
    };

    static getDerivedStateFromProps(nextProps, prevState){
        const {rows, filters} = nextProps;
        const {rows: oldRows} = prevState;

        const newRows = Filters.formatRows(rows, filters);

        const sameAsOld = _isEqual(oldRows, newRows);
        console.log('filter same', sameAsOld);
        if(sameAsOld)
            return null;

        return {rows: newRows};
    }

    static formatRows(rows, filters) {
        return rows.map(row => {

            const filter = _find(filters, {label: row.label.toLocaleLowerCase()});

            if (filter) {
                if (filter.label.startsWith("clock") || filter.label.startsWith("date")) {
                    row.body.props.operator = filter.operator;
                }

                if (filter.rightValue) {
                    row.body.props.rightValue = filter.rightValue;
                }

                row.body.props.value = filter.value;

                return Object.assign({}, row, {isExpanded: true});

            }
            else {
                return row;
            }
        });
    }

    _handleFilterChosen({label, value, operator}){
        let {rows} = this.state;

        rows.map(row => {

            if(row.label.toLocaleLowerCase() === label || _camelCase(row.label) === label){
                if(operator === 'betweenRight'){
                    row.body.props.rightValue = value;
                }else{
                    row.body.props.value = value;
                }

                row.body.props.operator =
                    operator === 'betweenLeft' || operator === 'betweenRight'
                        ? 'between'
                        : operator;

                return row;
            }else{
                return row;
            }
        });

        this.setState(() => ({rows}));
    }

    _onApplyFilters(){
        let {onDoneClick} = this.props;
        let {rows} = this.state;
        const filters = _filter(rows, row => {
            return row.isExpanded
                && row.body.props.value
        }).map(({label, body: {props: {value, operator, rightValue}}}) => {
            let filter = {label: label.toLocaleLowerCase(), value};
            if(label.startsWith('Clock') || label.startsWith('Date')){
                filter = Object.assign({}, filter, {operator});
                if(operator.startsWith('between')){
                    filter = Object.assign({}, filter, {rightValue});
                }
            }
            return filter;
        });

        if(filters.length > 0){
            onDoneClick(filters);
        }
    }
    
    _onClearFilters(){
        let {rows} = this.state;
        let {onClearClick} = this.props;
        rows = rows.map(row => {
            return Object.assign({}, row, {isExpanded: false})
        });

        onClearClick();
        this.setState(() => ({rows}));
    }

    _onSelectFilter(selected){
        let {rows} = this.state;

        rows = rows.map(row => {
            if(row.label === selected.label){
                return Object.assign({}, selected, {isExpanded: !selected.isExpanded});
            }else{
                return row;
            }
        });

        this.setState(() => ({rows}));
    }

    render(){
        const {filters} = this.props;
        const filtersCount = filters.length;

        return (
            <ButtonGroup large={false}>
                <Popover
                    hasBackdrop
                    interactionKind={PopoverInteractionKind.CLICK}
                    canEscapeKeyClose={false} popoverClassName="bms-popover" lazy position={Position.BOTTOM}>
                    <Tooltip content="filter" position={Position.BOTTOM}>
                        <Button icon="filter" className={filtersCount > 0 && 'pt-intent-primary'}>
                            {
                                filtersCount > 0 &&
                                [
                                    <Icon key={'icon'} icon="blank"/>,
                                    <span key={'count'}>{filtersCount}</span>
                                ]
                            }
                        </Button>
                    </Tooltip>
                    <FilterList 
                        filters={this.state.rows}
                        onFilterChosen={this._handleFilterChosen}
                        onApplyFilters={this._onApplyFilters}
                        onFilterSelect={this._onSelectFilter}
                        onClearFilters={this._onClearFilters} />
                </Popover>
            </ButtonGroup>
        );
    }

    static propTypes = {
        rows: PropTypes.array.isRequired,
        filters: PropTypes.array.isRequired,
        onDoneClick: PropTypes.func.isRequired,
        onClearClick: PropTypes.func.isRequired,
    };
}

export default Filters;
