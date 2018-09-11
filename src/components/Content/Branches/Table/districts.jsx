import React from 'react';
import Dimensions from 'react-dimensions';
import {Table, Column, Cell} from 'fixed-data-table-2';
import {TextCell, LocationsLinkCell} from '../../../Common/Table/Cells';
import '../../../Common/Table/table.css';
import PropTypes from "prop-types";


class TableSection extends React.Component {

    static propTypes = {
        data: PropTypes.array.isRequired,
        onDelete: PropTypes.func.isRequired,
    };
    
    render(){
        const {containerWidth, containerHeight, data, onDelete} = this.props;
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
                    header={<Cell className="table__header">Name</Cell>}
                    cell={<TextCell className="table__cell" data={data}/>}
                    width={350}
                />

                <Column
                    columnKey="code"
                    header={<Cell className="table__header">Code</Cell>}
                    cell={<TextCell className="table__cell" data={data}/>}
                    width={50}
                />

                <Column
                    header={<Cell className="table__header">...</Cell>}
                    cell={<LocationsLinkCell
                        onDeleteClick={row => onDelete(row)}
                        icon="eye-open" className="table__cell" data={data}/>}
                    fixedRight={true}
                    width={90}
                />
                
            </Table>
    );
    }
    
};

export default Dimensions()(TableSection);