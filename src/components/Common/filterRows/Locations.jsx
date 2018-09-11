import PropTypes from "prop-types";
import React from "react";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {loadLocations} from '../../../actions/locationActions';
import {DataListSelect, LongList} from '../Lists';
import _now from 'lodash/now';

const ID = `${_now()}_locations`;

class Locations extends React.Component{
    static propTypes = {
        locations: PropTypes.array.isRequired,
        onChange: PropTypes.func.isRequired,
        district: PropTypes.any,
        value: PropTypes.any.isRequired,
        loadLocations: PropTypes.func.isRequired,
        small: PropTypes.bool,
        dataList: PropTypes.bool,
        disabled: PropTypes.bool,
        dependent: PropTypes.bool,
    };

    constructor(props){
        super(props);
        this._handleOnChange = this._handleOnChange.bind(this);
    }

    componentDidMount(){
        const {loadLocations, district: {id}} = this.props;
        if(id){
            loadLocations({f: `district|${id}`}, true);
        }else{
            loadLocations({}, true);
        }
    }

    componentDidUpdate(prevProps){
        const {district: {id: oldId}} = prevProps;
        const {district: {id}} = this.props;

        if(id !== oldId){
            this.props.loadLocations({f: `district|${id}`}, true);
        }
    }

    _handleOnChange({id}){
        const {onChange} = this.props;
        onChange({label: "location", value: id});
    }

    render(){
        const {locations, value, small, dataList, disabled, district: {id}, dependent} = this.props;
        const shouldBe = disabled || (dependent && !id);
        return dataList ? (
            <DataListSelect
                disabled={shouldBe}
                small={small}
                defaultValue={value}
                onChange={this._handleOnChange}
                items={locations} dataListId={ID}/>
        ) : (
            <LongList
                label={'location'}
                disabled={shouldBe}
                small={small}
                defaultValue={value}
                onChange={this._handleOnChange}
                items={locations}/>
        ) ;
    }
}

const mapStateToProps = ({filterDistrict, filterLocations}) => (
    {district: filterDistrict, locations: filterLocations});
const mapDispatchToProps = dispatch => bindActionCreators({loadLocations}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Locations);