import React from 'react';
import Dimensions from 'react-dimensions';
import {Table, Column, Cell} from 'fixed-data-table-2';
import {TextCell, RoleUserActionCell} from '../../../Common/Table/Cells';
import {Alert, Intent} from '@blueprintjs/core';
import '../../../Common/Table/table.css';
import PropTypes from "prop-types";


class TableSection extends React.Component {

    constructor(props){
        super(props);

        this._handleRemoveCancel = this._handleRemoveCancel.bind(this);
        this._handleRemoveConfirm = this._handleRemoveConfirm.bind(this);
        this._handleOnRemoveClick = this._handleOnRemoveClick.bind(this);

        this.state = {
            removeUserFromGroupAlert: false,
            selectedUser: null
        }
    }

    _handleRemoveCancel(){
        this.setState({removeUserFromGroupAlert: false});
    }
    _handleRemoveConfirm(){
        this.setState({removeUserFromGroupAlert: false});
        this.props.onDelete(this.state.selectedUser);
    }

    _handleOnRemoveClick(user){
        this.setState({removeUserFromGroupAlert: true, selectedUser: user});
    }
    
    render(){
        const {containerWidth, containerHeight, data, deleteAllowed} = this.props;
        return [
            <Table
                key={'table'}
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
                    columnKey="username"
                    header={<Cell className="table__header">Username</Cell>}
                    cell={<TextCell className="table__cell" data={data}/>}
                    width={200}
                />

                <Column
                    header={<Cell className="table__header">...</Cell>}
                    cell={<RoleUserActionCell disabled={!deleteAllowed} minimal onRemoveClick={this._handleOnRemoveClick} icon="eye-open" className="table__cell" data={data}/>}
                    fixedRight={true}
                    width={70}
                />
            </Table>,
            <Alert
                key="alert"
                cancelButtonText="Cancel"
                confirmButtonText="Delete"
                icon="trash"
                intent={Intent.DANGER}
                isOpen={this.state.removeUserFromGroupAlert}
                onCancel={this._handleRemoveCancel}
                onConfirm={this._handleRemoveConfirm}
            >
                <p>
                    Are you sure you want to remove this user from the group?
                </p>
            </Alert>
        ];
    }
    static propTypes = {
        data: PropTypes.array.isRequired,
        onDelete: PropTypes.func.isRequired,
        deleteAllowed: PropTypes.bool.isRequired,
    };
}

export default Dimensions()(TableSection);