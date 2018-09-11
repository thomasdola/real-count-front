import React from 'react';
import PropTypes from 'prop-types';
import Dimensions from 'react-dimensions';
import {Table, Column, Cell} from 'fixed-data-table-2';
import {TextCell, BLinkCell, ActiveCell, ValidCell, SortHeaderCell} from '../../../Common/Table/Cells';
import '../../../Common/Table/table.css';

class TableSection extends React.Component {

    static propTypes = {
        data: PropTypes.array.isRequired,
        onSortChange: PropTypes.func.isRequired,
        colSortDirs: PropTypes.object.isRequired,
    };

    render(){
        const {data, containerWidth, containerHeight, onSortChange, colSortDirs} = this.props;
        const sortAscIcon = "sort-alphabetical";
        const sortDescIcon = "sort-alphabetical-desc";

        return (
            <Table
                className="table__wrapper"
                rowsCount={data.length}
                rowHeight={45}
                headerHeight={35}
                onRowDoubleClick={(event, rowIndex) => { console.log('md', data[rowIndex]); }}
                width={containerWidth}
                height={containerHeight}>

                <Column
                    columnKey="bid"
                    header={
                        <SortHeaderCell
                            descIcon={sortDescIcon}
                            ascIcon={sortAscIcon}
                            className="table__header table__sort__header"
                            onSortChange={onSortChange}
                            sortDir={colSortDirs.bid}>
                            BID
                        </SortHeaderCell>
                    }
                    cell={<TextCell className="table__cell" data={data}/>}
                    fixed={true}
                    width={100}
                />
                <Column
                    columnKey="full_name"
                    header={
                        <SortHeaderCell
                            descIcon={sortDescIcon}
                            ascIcon={sortAscIcon}
                            className="table__header table__sort__header"
                            onSortChange={onSortChange}
                            sortDir={colSortDirs.full_name}>
                            Full Name
                        </SortHeaderCell>
                    }
                    cell={<TextCell className="table__cell" data={data}/>}
                    width={400}
                />
                <Column
                    columnKey="module"
                    header={
                        <SortHeaderCell
                            descIcon={sortDescIcon}
                            ascIcon={sortAscIcon}
                            className="table__header table__sort__header"
                            onSortChange={onSortChange}
                            sortDir={colSortDirs.module}>
                            Module
                        </SortHeaderCell>
                    }
                    cell={<TextCell className="table__cell" data={data}/>}
                    width={300}
                />
                <Column
                    columnKey="rank"
                    header={
                        <SortHeaderCell
                            descIcon={sortDescIcon}
                            ascIcon={sortAscIcon}
                            className="table__header table__sort__header"
                            onSortChange={onSortChange}
                            sortDir={colSortDirs.rank}>
                            Rank
                        </SortHeaderCell>
                    }
                    cell={<TextCell className="table__cell" data={data}/>}
                    width={300}
                />
                <Column
                    columnKey="region"
                    header={
                        <SortHeaderCell
                            descIcon={sortDescIcon}
                            ascIcon={sortAscIcon}
                            className="table__header table__sort__header"
                            onSortChange={onSortChange}
                            sortDir={colSortDirs.region}>
                            Region
                        </SortHeaderCell>
                    }
                    cell={<TextCell className="table__cell" data={data}/>}
                    width={300}
                />
                <Column
                    columnKey="district"
                    header={
                        <SortHeaderCell
                            descIcon={sortDescIcon}
                            ascIcon={sortAscIcon}
                            className="table__header table__sort__header"
                            onSortChange={onSortChange}
                            sortDir={colSortDirs.district}>
                            District
                        </SortHeaderCell>
                    }
                    cell={<TextCell className="table__cell" data={data}/>}
                    width={300}
                />
                <Column
                    columnKey="location"
                    header={
                        <SortHeaderCell
                            descIcon={sortDescIcon}
                            ascIcon={sortAscIcon}
                            className="table__header table__sort__header"
                            onSortChange={onSortChange}
                            sortDir={colSortDirs.location}>
                            Location
                        </SortHeaderCell>
                    }
                    cell={<TextCell className="table__cell" data={data}/>}
                    width={300}
                />
                <Column
                    columnKey="status"
                    header={
                        <SortHeaderCell
                            descIcon={sortDescIcon}
                            ascIcon={sortAscIcon}
                            className="table__header table__sort__header"
                            onSortChange={onSortChange}
                            sortDir={colSortDirs.status}>
                            Status
                        </SortHeaderCell>
                    }
                    cell={<ActiveCell className="table__cell" data={data}/>}
                    fixedRight={true}
                    width={70}
                />
                <Column
                    columnKey="valid"
                    header={
                        <SortHeaderCell
                            descIcon={sortDescIcon}
                            ascIcon={sortAscIcon}
                            className="table__header table__sort__header"
                            onSortChange={onSortChange}
                            sortDir={colSortDirs.status}>
                            Valid
                        </SortHeaderCell>
                    }
                    cell={<ValidCell className="table__cell" data={data}/>}
                    fixedRight={true}
                    width={70}
                />
                <Column
                    header={<Cell className="table__header table__sort__header">...</Cell>}
                    cell={<BLinkCell data={data}/>}
                    fixedRight={true}
                    width={50}
                />

            </Table>
        );
    }
}

export default Dimensions()(TableSection);