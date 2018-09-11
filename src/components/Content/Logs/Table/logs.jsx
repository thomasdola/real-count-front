import React from 'react';
import Dimensions from 'react-dimensions';
import {Table, Column, Cell} from 'fixed-data-table-2';
import {TextCell, UserCell, SortHeaderCell} from '../../../Common/Table/Cells';
import '../../../Common/Table/table.css';
import PropTypes from 'prop-types';


class TableSection extends React.Component {

    render(){
        const {containerWidth, containerHeight, onSortChange, colSortDirs, data} = this.props;
        const sortAscIcon = "sort-alphabetical";
        const sortDescIcon = "sort-alphabetical-desc";

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
                    header={
                        <SortHeaderCell
                            descIcon={sortDescIcon}
                            ascIcon={sortAscIcon}
                            className="table__header table__sort__header"
                            onSortChange={onSortChange}
                            sortDir={colSortDirs.date}>
                            Date
                        </SortHeaderCell>
                    }
                    cell={<TextCell className="table__cell" data={data}/>}
                    fixed={true}
                    width={100}
                />
                <Column
                    columnKey="time"
                    header={
                        <SortHeaderCell
                            descIcon={sortDescIcon}
                            ascIcon={sortAscIcon}
                            className="table__header table__sort__header"
                            onSortChange={onSortChange}
                            sortDir={colSortDirs.time}>
                            Time
                        </SortHeaderCell>
                    }
                    cell={<TextCell className="table__cell" data={data}/>}
                    fixed={true}
                    width={100}
                />
                <Column
                    columnKey="uuser.full_name"
                    header={<Cell className="table__header">User</Cell>}
                    cell={<UserCell className="table__cell" data={data}/>}
                    width={400}
                />
                <Column
                    columnKey="user.role"
                    header={<Cell className="table__header">Role</Cell>}
                    cell={<UserCell className="table__cell" data={data}/>}
                    width={300}
                />
                <Column
                    columnKey="entity"
                    header={<Cell className="table__header">Entity</Cell>}
                    cell={<TextCell className="table__cell" data={data}/>}
                    width={300}
                    fixedRight
                />
                <Column
                    columnKey="action"
                    header={<Cell className="table__header">Action</Cell>}
                    cell={<TextCell action className="table__cell" data={data}/>}
                    fixedRight
                    width={100}
                />
            </Table>
        );
    }

    static propTypes = {
        data: PropTypes.array.isRequired,
        onSortChange: PropTypes.func.isRequired,
        colSortDirs: PropTypes.object.isRequired
    };
}


export default Dimensions()(TableSection);