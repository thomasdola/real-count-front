import React from 'react';
import Dimensions from 'react-dimensions';
import {Table, Column, Cell} from 'fixed-data-table-2';
import {TextCell, BackupHealthCell, BackupActionsCell, SortHeaderCell} from '../../../Common/Table/Cells';
import PropTypes from 'prop-types';
import '../../../Common/Table/table.css';


class TableSection extends React.Component {

    constructor(props){
        super(props);

        this._handleOnDownloadBackup = this._handleOnDownloadBackup.bind(this);
        this._handleOnRestoreBackup = this._handleOnRestoreBackup.bind(this);
        this._handOnDeleteBackup = this._handOnDeleteBackup.bind(this);
    }
    
    render(){
        const {containerWidth, containerHeight, onSortChange, colSortDirs, data, downloadAllowed, 
            deleteAllowed, restoreAllowed} = this.props;
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
                    columnKey="name"
                    header={<Cell className="table__header">Name</Cell>}
                    cell={<TextCell className="table__cell" data={data}/>}
                    width={500}
                />

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
                    columnKey="health"
                    header={<Cell className="table__header">Health</Cell>}
                    cell={<BackupHealthCell className="table__cell" data={data}/>}
                    fixedRight={true}
                    width={100}
                />

                <Column
                    header={<Cell className="table__header">...</Cell>}
                    cell={<BackupActionsCell 
                        deleteAllowed={deleteAllowed}
                        restoreAllowed={restoreAllowed}
                        downloadAllowed={downloadAllowed}
                        onRestoreClick={this._handleOnRestoreBackup} 
                        onDeleteClick={this._handOnDeleteBackup}
                        onDownloadClick={this._handleOnDownloadBackup}
                        className="table__cell" data={data}/>}
                    fixedRight={true}
                    width={100}
                />
                
            </Table>
    );
    }

    _handleOnRestoreBackup(row){

        this.props.onRestoreBackup(row);
    }
    _handOnDeleteBackup(row){

        this.props.onDeleteBackup(row);
    }
    _handleOnDownloadBackup(row){

        this.props.onDownloadBackup(row);
    }

    static propTypes = {
        onRestoreBackup: PropTypes.func.isRequired,
        onDeleteBackup: PropTypes.func.isRequired,
        onDownloadBackup: PropTypes.func.isRequired,
        onSortChange: PropTypes.func.isRequired,
        data: PropTypes.array.isRequired,
        colSortDirs: PropTypes.object.isRequired,
        restoreAllowed: PropTypes.bool.isRequired,
        downloadAllowed: PropTypes.bool.isRequired,
        deleteAllowed: PropTypes.bool.isRequired,
    };
    
}

export default Dimensions()(TableSection);