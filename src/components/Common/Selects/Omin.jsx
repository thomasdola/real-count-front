// @flow
import React from 'react';
import PropTypes from 'prop-types';
import {MenuItem, Classes, Button} from '@blueprintjs/core';
import {Omnibar} from '@blueprintjs/select';
import fuzzySearch from 'fuzzysearch';

const renderMenuItem = (item, {handleClick, modifiers: {active, matchesPredicate}}) => {
    if (!matchesPredicate) {
        return null;
    }
    return <MenuItem
        className={active ? Classes.ACTIVE : ""}
        key={item.id}
        onClick={handleClick}
        text={item.name}
    />;
};


const filterItem = (query, item) => {
    return fuzzySearch(query.toLowerCase(), item.name.toLowerCase());
};

export default class OminSelect extends React.Component{
    constructor(props){
        super(props);

        this._onItemSelected = this._onItemSelected.bind(this);
    }

    state = {popOpen: false};

    _onItemSelected(item){
        this.setState({popOpen: false});
        this.props.onItemSelected(item);
    }

    render(){
        const {items, selectedItem, small, disabled} = this.props;

        return [
            <Omnibar
                key={'s'}
                itemPredicate={filterItem}
                isOpen={this.state.popOpen}
                items={items}
                itemRenderer={renderMenuItem}
                noResults={<MenuItem disabled={true} text="No results." />}
                onItemSelect={(item) => this._onItemSelected(item)}/>,
            <Button
                key={'b'}
                onClick={() => this.setState({popOpen: !this.state.popOpen})}
                disabled={disabled}
                className={`pt-fill bms-multi-select bms-button ${small && 'pt-small bms-multi-select-small'}`}
                rightIcon="double-caret-vertical"
                text={selectedItem ? selectedItem.name : "Choose..."} />
        ];
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
        small: PropTypes.bool
    };
}