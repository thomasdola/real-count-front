import React from 'react';
import Dimensions from 'react-dimensions';
import {Table, Column, Cell} from 'fixed-data-table-2';
import {TextCell, DAssistantLinkCell} from '../../../Common/Table/Cells';
import '../../../Common/Table/table.css';
import PropTypes from "prop-types";


class TableSection extends React.Component {
    
    render(){
        const {containerWidth, containerHeight, data, onRemoveAssistant} = this.props;
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
                    width={300}
                />

                <Column
                    header={<Cell className="table__header">...</Cell>}
                    cell={<DAssistantLinkCell
                        onRemoveAssistant={onRemoveAssistant}
                        minimal={true}
                        icon="eye-open"
                        className="table__cell" data={data}/>}
                    fixedRight={true}
                    width={70}
                />
                
            </Table>
    );
    }

    static propTypes = {
        data: PropTypes.array.isRequired,
        onRemoveAssistant: PropTypes.func.isRequired,
    };
    
}

export default Dimensions()(TableSection);