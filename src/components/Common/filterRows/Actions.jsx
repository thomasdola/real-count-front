import PropTypes from "prop-types";
import React from "react";
import {connect} from 'react-redux';
import {MultipleLongList} from '../Lists';
import _find from "lodash/find";
import _filter from 'lodash/filter';

class Actions extends React.Component{
    static propTypes = {
        actions: PropTypes.array.isRequired,
        onChange: PropTypes.func.isRequired,
        values: PropTypes.array.isRequired,
        small: PropTypes.bool,
        disabled: PropTypes.bool,
    };

    constructor(props){
        super(props);
        this._handleOnChange = this._handleOnChange.bind(this);
    }

    _handleOnChange(actions){
        const {onChange} = this.props;
        onChange({label: "actions", value: actions});
    }

    render(){
        const {actions, values, small, disabled} = this.props;

        const items = actions.map(({id, name}) => ({id, name}));
        const selecteds = _filter(values, ({name, id}) => {
            return _find(actions, {name, id})
        });

        return (
            <MultipleLongList
                disabled={disabled || actions.length < 1}
                label={'action'}
                small={small}
                defaultValues={selecteds}
                onChange={this._handleOnChange}
                items={items}/>
        ) ;
    }
}

const mapStateToProps = ({actions}) => ({actions});

export default connect(mapStateToProps)(Actions);