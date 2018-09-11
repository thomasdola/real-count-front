import PropTypes from "prop-types";
import React from "react";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {loadGates, loadEntities} from '../../../actions/roleActions';
import {ShortList} from '../Lists';
import _find from "lodash/find";
import _isEqual from 'lodash/isEqual';

class Gates extends React.Component{
    static propTypes = {
        gates: PropTypes.array.isRequired,
        onChange: PropTypes.func.isRequired,
        value: PropTypes.object.isRequired,
        loadGates: PropTypes.func.isRequired,
        loadEntities: PropTypes.func.isRequired,
        small: PropTypes.bool,
    };

    constructor(props){
        super(props);
        this._handleOnChange = this._handleOnChange.bind(this);
    }

    componentDidMount(){
        const {loadGates, value} = this.props;
        loadGates();
        this.props.loadEntities({f: `g|${value.id}`});
    }

    componentDidUpdate(prevProps){
        const {value: oldValue} = prevProps;
        const {value} = this.props;

        if(!_isEqual(oldValue, value)){
            this.props.loadEntities({f: `g|${value.id}`});
        }
    }

    _handleOnChange(value){
        const {loadEntities, onChange, gates} = this.props;
        loadEntities({f: `g|${value}`});
        onChange({label: "gate", value: _find(gates, {id: Number.parseInt(value, 10)})});
    }

    render(){
        const {gates, value, small} = this.props;
        return (
            <ShortList
                small={small}
                defaultValue={value.id}
                onChange={this._handleOnChange}
                items={gates}/>
        );
    }
}

const mapStateToProps = ({gates}) => ({gates});
const mapDispatchToProps = dispatch => bindActionCreators({loadGates, loadEntities}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Gates);