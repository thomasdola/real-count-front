import React from 'react';
import PropTypes from 'prop-types';
import Dimensions from 'react-dimensions';
import {Cell, Column, Table} from 'fixed-data-table-2';
import {FCountCell, FDownloadCell, NestedTextCell, TextCell} from '../../../Common/Table/Cells';
import '../../../Common/Table/table.css';
import {bindActionCreators} from 'redux';
import {useAsPreset} from '../../../../actions/formGroupActions';
import {connect} from 'react-redux';

class TableSection extends React.Component {

    constructor(props){
        super(props);

        this._handleUseAsPreset = this._handleUseAsPreset.bind(this);
    }

    static propTypes = {
        data: PropTypes.array.isRequired,
        useAsPreset: PropTypes.func.isRequired,
        onSortChange: PropTypes.func.isRequired,
        colSortDirs: PropTypes.object.isRequired
    };
    
    render(){
        const {containerWidth, containerHeight, data} = this.props;
        return (
            <Table
                className="table__wrapper"
                rowsCount={data.length}
                rowHeight={45}
                headerHeight={35}
                width={containerWidth}
                height={containerHeight}>

                <Column
                    columnKey="name"
                    header={<Cell className="table__header">title</Cell>}
                    cell={<TextCell className="table__cell" data={data}/>}
                    width={250}
                />

                <Column
                    columnKey="region.name"
                    header={<Cell className="table__header">region</Cell>}
                    cell={<NestedTextCell className="table__cell" data={data}/>}
                    width={200}
                />

                <Column
                    columnKey="district.name"
                    header={<Cell className="table__header">district</Cell>}
                    cell={<NestedTextCell className="table__cell" data={data}/>}
                    width={300}
                />

                <Column
                    columnKey="location.name"
                    header={<Cell className="table__header">location</Cell>}
                    cell={<NestedTextCell className="table__cell" data={data}/>}
                    width={200}
                />

                <Column
                    columnKey="module.name"
                    header={<Cell className="table__header">module</Cell>}
                    cell={<NestedTextCell className="table__cell" data={data}/>}
                    width={200}
                />

                <Column
                    columnKey="rank.name"
                    header={<Cell className="table__header">rank</Cell>}
                    cell={<NestedTextCell className="table__cell" data={data}/>}
                    width={200}
                />

                <Column
                    columnKey="count.total"
                    header={<Cell className="table__header">total</Cell>}
                    cell={<FCountCell className="table__cell" data={data}/>}
                    fixedRight={true}
                    width={70}
                />

                <Column
                    columnKey="count.enrolled"
                    header={<Cell className="table__header">enrolled</Cell>}
                    cell={<FCountCell className="table__cell" data={data}/>}
                    fixedRight={true}
                    width={70}
                />

                <Column
                    columnKey="count.pending"
                    header={<Cell className="table__header">pending</Cell>}
                    cell={<FCountCell className="table__cell" data={data}/>}
                    fixedRight={true}
                    width={70}
                />

                <Column
                    header={<Cell className="table__header">...</Cell>}
                    cell={<FDownloadCell 
                        minimal 
                        onPresetClick={this._handleUseAsPreset} 
                        className="table__cell" data={data}/>}
                    fixedRight={true}
                    width={50}
                />
                
            </Table>
    );
    }

    _handleUseAsPreset(row){
        this.props.useAsPreset(row);
    }
    
}

const mapDispatchToProps = dispatch => bindActionCreators({useAsPreset}, dispatch);

export default connect(null, mapDispatchToProps)(Dimensions()(TableSection));