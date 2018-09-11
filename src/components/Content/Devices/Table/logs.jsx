import React from 'react';
import PropTypes from 'prop-types';
import Dimensions from 'react-dimensions';
import {Table, Column, Cell} from 'fixed-data-table-2';
import {TextCell, ClockInTimeCell, ClockOutTimeCell} from '../../../Common/Table/Cells';
import '../../../Common/Table/table.css';

class TableSection extends React.Component {
    
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
                    columnKey="date"
                    header={<Cell className="table__header">Date</Cell>}
                    cell={<TextCell className="table__cell" data={data}/>}
                    width={100}
                />

                <Column
                    columnKey="in"
                    header={<Cell className="table__header">Log In</Cell>}
                    cell={<ClockInTimeCell className="table__cell" data={data}/>}
                    width={80}
                />

                <Column
                    columnKey="out"
                    header={<Cell className="table__header">Log Out</Cell>}
                    cell={<ClockOutTimeCell className="table__cell" data={data}/>}
                    width={80}
                />                
            </Table>
    );
    }

    static propTypes = {
        data: PropTypes.array.isRequired
    };
}

export default Dimensions()(TableSection);