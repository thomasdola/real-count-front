import React from 'react';
import PropTypes from 'prop-types';
import Dimensions from 'react-dimensions';
import {Table, Column, Cell} from 'fixed-data-table-2';
import {SortHeaderCell, TextCell, ClockInTimeCell, ClockOutTimeCell, ABLinkCell} from '../../../Common/Table/Cells';

import '../../../Common/Table/table.css';

const sortDescIcon = "sort-desc",
    sortAscIcon = "sort-asc";

class Beneficiaries extends React.Component {

    static propTypes = {
        data: PropTypes.array.isRequired,
        onSortChange: PropTypes.func.isRequired,
        colSortDirs: PropTypes.object.isRequired
    };

    render(){
        const {containerWidth, containerHeight, onViewWeeklyAttendance, data, colSortDirs, onSortChange} = this.props;
        return (
            <Table
                className="table__wrapper"
                rowsCount={data.length}
                rowHeight={45}
                headerHeight={35}
                width={containerWidth}
                height={containerHeight}>

                <Column
                    columnKey="bid"
                    header={<Cell className="table__header">BID</Cell>}
                    cell={<TextCell className="table__cell" data={data}/>}
                    fixed={true}
                    width={100}
                />

                <Column
                    columnKey="full_name"
                    header={<Cell className="table__header">Full Name</Cell>}
                    cell={<TextCell className="table__cell" data={data}/>}
                    width={200}
                />

                <Column
                    columnKey="location"
                    header={<Cell className="table__header">Location</Cell>}
                    cell={<TextCell className="table__cell" data={data}/>}
                    width={200}
                />

                <Column
                    columnKey="in"
                    header={<SortHeaderCell
                        descIcon={sortDescIcon}
                        ascIcon={sortAscIcon}
                        className="table__header table__sort__header"
                        onSortChange={onSortChange}
                        sortDir={colSortDirs.in}>
                        In
                    </SortHeaderCell>}
                    cell={<ClockInTimeCell className="table__cell" minimal data={data}/>}
                    fixedRight={true}
                    width={80}
                />

                <Column
                    columnKey="out"
                    header={<SortHeaderCell
                        descIcon={sortDescIcon}
                        ascIcon={sortAscIcon}
                        className="table__header table__sort__header"
                        onSortChange={onSortChange}
                        sortDir={colSortDirs.out}>
                        Out
                    </SortHeaderCell>}
                    cell={<ClockOutTimeCell className="table__cell" minimal data={data}/>}
                    fixedRight={true}
                    width={80}
                />

                <Column
                    columnKey="uuid"
                    header={<Cell className="table__header">...</Cell>}
                    cell={<ABLinkCell onViewClick={onViewWeeklyAttendance} className="table__cell" minimal data={data}/>}
                    fixedRight={true}
                    width={50}
                />

            </Table>
        );
    }

}

export default Dimensions()(Beneficiaries)