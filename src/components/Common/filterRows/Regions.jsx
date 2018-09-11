import PropTypes from "prop-types";
import React from "react";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {loadRegions, selectRegion} from '../../../actions/regionActions';
import {ShortList} from '../Lists';
import _find from 'lodash/find';
import _isEqual from 'lodash/isEqual';

class Regions extends React.Component{
    static propTypes = {
        regions: PropTypes.array.isRequired,
        onChange: PropTypes.func.isRequired,
        region: PropTypes.object,
        value: PropTypes.any.isRequired,
        loadRegions: PropTypes.func.isRequired,
        selectRegion: PropTypes.func.isRequired,
        small: PropTypes.bool,
        required: PropTypes.bool,
        disabled: PropTypes.bool,
    };

    constructor(props){
        super(props);
        this._handleOnChange = this._handleOnChange.bind(this);
    }

    componentDidMount(){
        const {loadRegions} = this.props;
        loadRegions({f: `country|1`}, true);
        // const region = _find(regions, {id: parseInt(value, 10)});
        // console.log('region select', regions, value, region);
        // if(region) selectRegion(region);
    }

    componentDidUpdate(prevProps){
        const {value: oldValue, region: oldRegion} = prevProps;
        const {value, regions} = this.props;

        const r = _find(regions, {id: Number.parseInt(value, 10)});
        console.log('region select', regions, value, r, oldValue, oldRegion);
        if(oldValue !== value || !_isEqual(r, oldRegion)){
            r && this.props.selectRegion(r);
        }
    }

    _handleOnChange(value){
        const {selectRegion, regions, onChange} = this.props;
        let region = _find(regions, {id: Number.parseInt(value, 10)});
        selectRegion(region || {});
        onChange({label: "region", value});
    }

    render(){
        const {regions, value, small, required, disabled} = this.props;
        return (
            <ShortList
                disabled={disabled}
                required={required}
                small={small}
                defaultValue={value}
                onChange={this._handleOnChange}
                items={regions}/>
        );
    }
}

const mapStateToProps = ({filterRegions, filterRegion}) => (
    {region: filterRegion, regions: filterRegions});
const mapDispatchToProps = dispatch => bindActionCreators({selectRegion, loadRegions}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Regions);