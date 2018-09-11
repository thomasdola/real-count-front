import React from 'react';
import Dimensions from 'react-dimensions';
import {Table, Column, Cell} from 'fixed-data-table-2';
import {TextCell, DistrictsLinkCell} from '../../../Common/Table/Cells';
import PropTypes from 'prop-types';
import '../../../Common/Table/table.css';

class TableSection extends React.Component {

    static propTypes = {
        data: PropTypes.array.isRequired
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
                    header={<Cell className="table__header">Name</Cell>}
                    cell={<TextCell className="table__cell" data={data}/>}
                    width={200}
                />

                <Column
                    columnKey="code"
                    header={<Cell className="table__header">Code</Cell>}
                    cell={<TextCell className="table__cell" data={data}/>}
                    width={200}
                />

                <Column
                    header={<Cell className="table__header">...</Cell>}
                    cell={<DistrictsLinkCell onDeleteClick={row => console.log(row)} icon="eye-open" className="table__cell" data={data}/>}
                    fixedRight={true}
                    width={40}
                />
                
            </Table>
    );
    }
    
}

export default Dimensions()(TableSection);