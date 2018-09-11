import PropTypes from "prop-types";
import React from "react";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {loadActions, loadEntities} from '../../../actions/roleActions';
import {ShortList} from '../Lists';
import _find from "lodash/find";
import _isEqual from 'lodash/isEqual';

class Entities extends React.Component{
    static propTypes = {
        entities: PropTypes.array.isRequired,
        onChange: PropTypes.func.isRequired,
        value: PropTypes.object.isRequired,
        loadActions: PropTypes.func.isRequired,
        loadEntities: PropTypes.func.isRequired,
        small: PropTypes.bool,
        disabled: PropTypes.bool,
    };

    constructor(props){
        super(props);
        this._handleOnChange = this._handleOnChange.bind(this);
    }

    componentDidMount(){
        const {loadActions, value} = this.props;
        loadActions({f: `e|${value.id}`});
    }

    componentDidUpdate(prevProps){
        const {value: oldValue} = prevProps;
        const {value} = this.props;

        if(!_isEqual(oldValue, value)){
            this.props.loadActions({f: `e|${value.id}`});
        }
    }

    _handleOnChange(value){
        const {loadActions, onChange, entities} = this.props;
        loadActions({f: `e|${value}`});
        onChange({label: 'entity', value: _find(entities, {id: Number.parseInt(value, 10)})});
    }

    render(){
        const {entities, value, small, disabled} = this.props;
        const entity = _find(entities, {id: value.id}) || {};
        console.log('policy -> entity', value, entities,  entity);
        return (
            <ShortList
                disabled={disabled || entities.length < 1}
                small={small}
                defaultValue={entity.id}
                onChange={this._handleOnChange}
                items={entities}/>
        );
    }
}

const mapStateToProps = ({entities}) => ({entities});
const mapDispatchToProps = dispatch => bindActionCreators({loadEntities, loadActions}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Entities);