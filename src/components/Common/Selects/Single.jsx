import React from 'react';
import PropTypes from 'prop-types';
import {MenuItem, Button, Intent, Position} from '@blueprintjs/core';
import {Select} from '@blueprintjs/select';
import Fuse from 'fuse.js';
import fuzzySearch from 'fuzzysearch';
import './index.css';

const pluralize = require('pluralize');


export const renderMenuItem = (item, {handleClick, modifiers: {active, matchesPredicate}}) => {
    if (!matchesPredicate) {
        return null;
    }
    return <MenuItem
        intent={active ? Intent.PRIMARY : Intent.NONE}
        key={item.id}
        onClick={handleClick}
        text={item.name}
    />;
};

export const selectFilter = (query, items) => {
    const fuse = new Fuse(items, {keys: ['name']});
    return fuse.search(query);
};

export const filterItem = (query, item) => {
    return fuzzySearch(query.toLowerCase(), item.name.toLowerCase());
};

export const initialContentRender = (items, label) => {
    const itemsTotal = items.length;
    return (
        <MenuItem disabled={true} text={`${itemsTotal} ${pluralize(label, itemsTotal)}.`} />
    );
};

export default class SingleSelect extends React.Component{

    constructor(props){
        super(props);

        this._onItemSelected = this._onItemSelected.bind(this);
    }

    state = {popOpen: false};

    _onItemSelected(item){
        this.setState(() => ({popOpen: false}));
        this.props.onItemSelected(item);
    }

    render(){
        const {items, selectedItem, small, disabled, label, initial} = this.props;

        return (
            <Select
                initialContent={initial && initialContentRender(items, label)}
                itemPredicate={filterItem}
                disabled={disabled}
                items={items}
                itemRenderer={renderMenuItem}
                noResults={<MenuItem disabled={true} text="No results." />}
                popoverProps={{ usePortal: false, lazy: false, position: Position.TOP, minimal: true, className: 'bms__select__popover' }}
                onItemSelect={(item) => this._onItemSelected(item)}>
                <Button
                    onClick={() => this.setState({popOpen: !this.state.popOpen})}
                    disabled={disabled}
                    className={`pt-fill bms-multi-select ${small && 'pt-small bms-multi-select-small'}`}
                    rightIcon="double-caret-vertical"
                    text={selectedItem ? selectedItem.name : "Choose..."} />
            </Select>
        );
    }

    static propTypes = {
        items: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
                name: PropTypes.string
            })
        ).isRequired,
        selectedItem: PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            name: PropTypes.string
        }),
        onItemSelected: PropTypes.func.isRequired,
        disabled: PropTypes.bool,
        label: PropTypes.string.isRequired,
        small: PropTypes.bool,
        initial: PropTypes.bool,
    };
}