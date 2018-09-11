import React from 'react';
import PropTypes from 'prop-types';
import Dimensions from 'react-dimensions';
import {Table, Column, Cell} from 'fixed-data-table-2';
import {TextCell, DLinkCell, DSupervisorCell, DStatusCell, SortHeaderCell} from '../../../Common/Table/Cells';
import '../../../Common/Table/table.css';

class TableSection extends React.Component {

    render(){
        const {containerWidth, containerHeight, onSortChange, colSortDirs, data, onViewDevice, mapActionAllowed} = this.props;
        return (
            <Table
                className="table__wrapper"
                rowsCount={data.length}
                rowHeight={45}
                headerHeight={35}
                onRowDoubleClick={(event, rowIndex) => {
                    onViewDevice(data[rowIndex]);
                }}
                width={containerWidth}
                height={containerHeight}>

                <Column
                    columnKey="name"
                    header={<Cell className="table__header">Name</Cell>}
                    cell={<TextCell className="table__cell" data={data}/>}
                    fixed={true}
                    width={300}
                />

                <Column
                    columnKey="code"
                    header={<Cell className="table__header">ID</Cell>}
                    cell={<TextCell className="table__cell" data={data}/>}
                    width={150}
                />

                <Column
                    columnKey="supervisor"
                    header={<Cell className="table__header">Supervisor</Cell>}
                    cell={<DSupervisorCell className="table__cell" data={data}/>}
                    width={200}
                />

                <Column
                    columnKey="date"
                    header={<SortHeaderCell
                        descIcon={'sort-desc'}
                        ascIcon={'sort-asc'}
                        className="table__header table__sort__header"
                        onSortChange={onSortChange}
                        sortDir={colSortDirs.date}>
                        Date
                    </SortHeaderCell>}
                    cell={<TextCell className="table__cell" data={data}/>}
                    width={200}
                />

                <Column
                    columnKey="assistants"
                    header={<Cell className="table__header">Assistant(s)</Cell>}
                    cell={<TextCell className="table__cell" data={data}/>}
                    width={80}
                />

                <Column
                    columnKey="district"
                    header={<Cell className="table__header">District</Cell>}
                    cell={<TextCell className="table__cell" data={data}/>}
                    width={80}
                />

                <Column
                    columnKey="status"
                    header={<Cell className="table__header">Status</Cell>}
                    cell={<DStatusCell className="table__cell" data={data}/>}
                    fixedRight={true}
                    width={80}
                />

                <Column
                    header={<Cell className="table__header">...</Cell>}
                    cell={<DLinkCell minimal 
                        mapActionAllowed={mapActionAllowed} 
                        onViewDevice={onViewDevice} 
                        className="table__cell" data={data}/>}
                    fixedRight={true}
                    width={50}
                />

            </Table>
        );
    }

    static propTypes = {
        data: PropTypes.array.isRequired,
        onSortChange: PropTypes.func.isRequired,
        onViewDevice: PropTypes.func.isRequired,
        colSortDirs: PropTypes.object.isRequired,
        mapActionAllowed: PropTypes.bool.isRequired
    };
}

export default Dimensions()(TableSection);