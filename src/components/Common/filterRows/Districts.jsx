import PropTypes from "prop-types";
import React from "react";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {loadDistricts, selectDistrict} from '../../../actions/districtActions';
import {DataListSelect, LongList} from '../Lists';
import _now from 'lodash/now';
import _find from "lodash/find";
import _isEqual from 'lodash/isEqual';

const ID = _now();

class Districts extends React.Component{
    static propTypes = {
        districts: PropTypes.array.isRequired,
        district: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
        region: PropTypes.object,
        value: PropTypes.any.isRequired,
        selectDistrict: PropTypes.func.isRequired,
        loadDistricts: PropTypes.func.isRequired,
        small: PropTypes.bool,
        disabled: PropTypes.bool,
        dataList: PropTypes.bool,
        dependent: PropTypes.bool,
    };

    constructor(props){
        super(props);
        this._handleOnChange = this._handleOnChange.bind(this);
    }

    componentDidMount(){
        const {region: {id}, loadDistricts, value} = this.props;
        if(id){
            loadDistricts({f: `region|${id}`}, true);
        }else{
            loadDistricts({}, true);
        }

        if(value){
            const d = _find(this.props.districts, {id: Number.parseInt(value, 10)});
            d && this.props.selectDistrict(d);
        }
    }

    componentDidUpdate(prevProps){
        const {region: {id: oldId}} = prevProps;
        const {value, region: {id}, district, districts} = this.props;

        if(!_isEqual(oldId, id)){
            this.props.loadDistricts({f: `region|${id}`}, true);
        }

        if(district.id === undefined && districts.length > 0 && value){
            const d = _find(districts, {id: Number.parseInt(value, 10)});
            d && this.props.selectDistrict(d);
        }
    }

    _handleOnChange({id}){
        const {selectDistrict, districts, onChange} = this.props;
        selectDistrict(_find(districts, {id: Number.parseInt(id, 10)}) || {});
        onChange({label: "district", value: id});
    }

    render(){
        const {districts, value, small, disabled, dataList, dependent, region:{id}} = this.props;
        const shouldBe = disabled || (dependent && !id);
        return dataList ? (
            <DataListSelect
                disabled={shouldBe}
                small={small}
                defaultValue={value}
                onChange={this._handleOnChange}
                items={districts} dataListId={ID}/>
        ) : (
            <LongList
                label={'district'}
                disabled={shouldBe}
                small={small}
                defaultValue={value}
                onChange={this._handleOnChange}
                items={districts}/>
        ) ;
    }
}

const mapStateToProps = ({filterDistricts, filterRegion, filterDistrict}) => (
    {districts: filterDistricts, region: filterRegion, district: filterDistrict});
const mapDispatchToProps = dispatch => bindActionCreators({selectDistrict, loadDistricts}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Districts);