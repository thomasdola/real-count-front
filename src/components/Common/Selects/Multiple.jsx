import React from 'react';
import PropTypes from 'prop-types';
import {Classes, Icon, MenuItem, Spinner} from '@blueprintjs/core';
import {MultiSelect} from '@blueprintjs/select';
import {filterItem, initialContentRender} from "./Single";
import classNames from 'classnames';
import './index.css';
import _find from "lodash/find";
import _isEqual from 'lodash/isEqual';
import _indexOf from 'lodash/indexOf';
import _reject from 'lodash/reject';

class MultipleSelect extends React.Component{

    constructor(props){
        super(props);

        this._handleTagRemove = this._handleTagRemove.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._handleItemSelect = this._handleItemSelect.bind(this);
    }

    state = {selected: []};

    static getDerivedStateFromProps(nextProps, prevState){
        const {selectedItems} = nextProps;
        const {selected: oldSelected} = prevState;

        if(_isEqual(oldSelected, selectedItems))
            return null;

        return {
            selected: selectedItems
        };
    }

    componentDidUpdate(prevProps){
        const {items: prevItems} = prevProps;
        const {items} = this.props;

        if(!_isEqual(prevItems, items)){
            this.setState({selected: items});
        }
    }

    _handleTagRemove(tag) {
        const item = _find(this.state.selected, {name: tag});
        this._deselectItem(item);
    };

    _selectItem(item) {
        const selected = [...this.state.selected, item];
        this.setState({ selected });
        this.props.onItemSelected(selected);
    }

    _deselectItem(item) {
        const selected = _reject(this.state.selected, {id: item.id, name: item.name});
        this.setState({ selected });
        this.props.onItemSelected(selected);
    }

    _getSelectedItemIndex(item) {
        return _indexOf(this.state.selected, item);
    }

    _isItemSelected(item) {
        return !!_find(this.state.selected, {id: item.id, name: item.name});
    }

    _handleItemSelect(item) {
        if (this._isItemSelected(item)) {
            this._deselectItem(item);
        } else {
            this._selectItem(item);
        }
    };

    static _renderTag(item){
        return item.name;
    }

    _renderItem (item, { modifiers, handleClick }){
        if (!modifiers.matchesPredicate) {
            return null;
        }
        const classes = classNames({
            [Classes.ACTIVE]: modifiers.active,
            [Classes.INTENT_PRIMARY]: modifiers.active,
        });
        return (
            <MenuItem
                className={classes}
                icon={this._isItemSelected(item) ? "tick" : "blank"}
                key={item.id}
                onClick={handleClick}
                text={item.name}
                shouldDismissPopover={false}
            />
        );
    };

    static _renderTagInputRightElement(loading){
        return loading
            ? <Spinner className="pt-small"/>
            : <Icon icon={'double-caret-vertical'}/>;
    }

    render(){
        const {items, label, disabled, initialContent, loading} = this.props;
        const {selected} = this.state;

        return (
            <MultiSelect
                initialContent={initialContent && initialContentRender(items, label)}
                itemPredicate={filterItem}
                tagInputProps={
                    {disabled: disabled,
                        tagProps: {className: Classes.MINIMAL},
                        rightElement: MultipleSelect._renderTagInputRightElement(loading),
                        placeholder: 'Choose...'}
                }
                items={items}
                itemRenderer={this._renderItem}
                noResults={<MenuItem disabled={true} text="No results." />}
                popoverProps={{ usePortal: false, lazy: false, minimal: true, className: 'bms__select__popover' }}
                selectedItems={selected}
                tagRenderer={MultipleSelect._renderTag}
                onItemSelect={this._handleItemSelect}/>
        );
    }

    static propTypes = {
        items: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
                name: PropTypes.string
            })
        ).isRequired,
        selectedItems: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
                name: PropTypes.string
            })
        ),
        onItemSelected: PropTypes.func.isRequired,
        label: PropTypes.string.isRequired,
        disabled: PropTypes.bool,
        initialContent: PropTypes.bool,
        loading: PropTypes.bool,
    };
}

export default MultipleSelect;