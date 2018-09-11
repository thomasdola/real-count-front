import React from 'react';
import PropTypes from 'prop-types';
import {Colors, Icon} from '@blueprintjs/core';
import Fuse from 'fuse.js';
import SelectM from 'react-select-me';
import 'react-select-me/lib/ReactSelectMe.css';
import './index.css';
import _find from 'lodash/find';
import _isEqual from 'lodash/isEqual';
import {css, StyleSheet} from 'aphrodite';

const Styles = StyleSheet.create({
    ddOption: {
        height: '25px',
        padding: '5px',
        ':last-child':{
            borderBottom: 'none'
        },
        ':hover':{
            backgroundColor: Colors.BLUE5,
            color: 'white'
        }
    }
});

const OptionItem = ({id, name, active}) => (
    <div key={id} className={css(Styles.ddOption)}>
        {name}
    </div>
);

const renderMenuItem = ({id, name}, selectedItems) => {
    const active = !!_find(selectedItems, {name, id});
    return <OptionItem id={id} name={name} active={active}/>;
};

const selectFilter = (query, items) => {
    const fuse = new Fuse(items, {keys: ['name']});
    return fuse.search(query);
};


function iconRenderer(isOpened) {
    return <Icon icon={isOpened ? 'caret-down' : 'double-caret-vertical'}/>
}

export default class SelectMe extends React.Component{

    constructor(props){
        super(props);

        this._onItemSelected = this._onItemSelected.bind(this);
        this._onSearch = this._onSearch.bind(this);
    }

    state = {value: {}, options: []};

    static getDerivedStateFromProps(nextProps, prevState){
        const {items} = nextProps;
        const {options: oldOptions} = prevState;

        if(_isEqual(items, oldOptions))
            return null;

        return {options: items};
    }

    _onItemSelected(item){
        this.setState({value: item});
        this.props.onItemSelected(item);
    }

    _onSearch(searchString) {
        // let items = this.props.items.map(item => Object.assign({}, item, {label: item.name}));
        this.setState({
            options: selectFilter(searchString,
                this.props.items)
        });
    }

    render(){
        const {multiple} = this.props;
        return (
            <SelectM
                searchable
                valueKey={'id'}
                multiple={multiple}
                placeholder='Choose...'
                iconRenderer={iconRenderer}
                optionRenderer={renderMenuItem}
                onSearch={this._onSearch}
                options={this.state.options}
                value={this.state.value || 'Choose...'}
                onChange={this._onItemSelected} />
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
        multiple: PropTypes.bool,
        small: PropTypes.bool
    };
}