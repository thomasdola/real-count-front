// @flow
import React from 'react';
import PropTypes from 'prop-types';
import _find from 'lodash/find';


export default class DataList extends React.Component{

    constructor(props){
        super(props);

        this._onItemSelected = this._onItemSelected.bind(this);
        this._onQueryChange = this._onQueryChange.bind(this);
    }

    state = {value: ''};

    static getDerivedStateFromProps(nextProps, prevState){
        const {selectedItem, items} = nextProps;
        const {value: oldValue} = prevState;
        const item = _find(items, {id: Number.parseInt(selectedItem, 10)}) || {};

        if(oldValue === item.name)
            return null;

        return {
            value: item.name
        };
    }

    _onItemSelected(item){
        this.props.onItemSelected(item);
    }

    _onQueryChange(value){
        this.setState({value});
        const item = _find(this.props.items, {name: value});
        item && this.props.onItemSelected(item);
    }

    render(){
        const {items, small, disabled, listId} = this.props;
        return [
            <input
                disabled={disabled}
                key={'input'}
                value={this.state.value || ''}
                onChange={({target: {value}}) => this._onQueryChange(value)}
                className={`pt-input pt-fill ${small && 'pt-small bms-small'}`}
                placeholder={'Choose...'}
                list={listId}
                type="text" dir="auto"/>,
            <datalist key={`${listId}`} id={listId}>
                {
                    items.map(function(item){
                        return <option key={`${item.id}`}>{item.name}</option>
                    })
                }
            </datalist>
        ];
    }

    static propTypes = {
        items: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
                name: PropTypes.string
            })
        ).isRequired,
        onItemSelected: PropTypes.func.isRequired,
        listId: PropTypes.any.isRequired,
        selectedItem: PropTypes.any,
        disabled: PropTypes.bool,
        small: PropTypes.bool
    };
}