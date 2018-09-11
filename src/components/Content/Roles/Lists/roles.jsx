import React from 'react';
import Dimensions from 'react-dimensions';
import {Cell, Column, Table} from 'fixed-data-table-2';
import {RoleLinkCell, TextCell} from '../../../Common/Table/Cells';
import '../../../Common/Table/table.css';
import PropTypes from "prop-types";
import {withRouter} from 'react-router-dom';

class TableSection extends React.Component {
    
    render(){
        const {containerWidth, containerHeight, data, location} = this.props;
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
                    columnKey="users"
                    header={<Cell className="table__header">User(s)</Cell>}
                    cell={<TextCell className="table__cell" data={data}/>}
                    width={60}
                />

                <Column
                    columnKey="policies"
                    header={<Cell className="table__header">Policy(ies)</Cell>}
                    cell={<TextCell className="table__cell" data={data}/>}
                    fixedRight={true}
                    width={80}
                />

                <Column
                    header={<Cell className="table__header">...</Cell>}
                    cell={<RoleLinkCell minimal location={location} icon="eye-open" className="table__cell" data={data}/>}
                    fixedRight={true}
                    width={50}
                />
                
            </Table>
    );
    }

    static propTypes = {
        data: PropTypes.array.isRequired,
        onSortChange: PropTypes.func.isRequired,
        colSortDirs: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    };
}

export default withRouter(Dimensions()(TableSection));