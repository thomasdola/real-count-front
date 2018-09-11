import React from 'react';
import PropTypes from 'prop-types';
import Dimensions from 'react-dimensions';
import {Table, Column, Cell} from 'fixed-data-table-2';
import {TextCell, TimeTagCell} from '../../../Common/Table/Cells';
import {Icon} from '@blueprintjs/core';
import '../../../Common/Table/table.css';

class CalendarTable extends React.Component{

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
                    columnKey="time"
                    header={<Cell className="table__header">
                        <Icon icon="time"/>
                    </Cell>}
                    cell={<TextCell className="table__cell" data={data}/>}
                    fixed={true}
                    width={60}
                />

                <Column
                    columnKey="monday"
                    header={<Cell className="table__header">monday</Cell>}
                    cell={<TimeTagCell className="table__cell" data={data}/>}
                    width={80}
                />

                <Column
                    columnKey="tuesday"
                    header={<Cell className="table__header">tueday</Cell>}
                    cell={<TimeTagCell className="table__cell" data={data}/>}
                    width={80}
                />

                <Column
                    columnKey="wednesday"
                    header={<Cell className="table__header">wednes...</Cell>}
                    cell={<TimeTagCell className="table__cell" data={data}/>}
                    width={80}
                />

                <Column
                    columnKey="thursday"
                    header={<Cell className="table__header">thursday</Cell>}
                    cell={<TimeTagCell className="table__cell" data={data}/>}
                    width={80}
                />

                <Column
                    columnKey="friday"
                    header={<Cell className="table__header">friday</Cell>}
                    cell={<TimeTagCell className="table__cell" data={data}/>}
                    width={80}
                />

                <Column
                    columnKey="saturday"
                    header={<Cell className="table__header">saturday</Cell>}
                    cell={<TimeTagCell className="table__cell" data={data}/>}
                    width={80}
                />

                <Column
                    columnKey="sunday"
                    header={<Cell className="table__header">sunday</Cell>}
                    cell={<TimeTagCell className="table__cell" data={data}/>}
                    width={80}
                />

            </Table>
        );
    }
}

export default Dimensions()(CalendarTable);