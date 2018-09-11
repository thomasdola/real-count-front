import React from 'react';
import {Cell} from 'fixed-data-table-2';
import {Button, ButtonGroup, Colors, Icon, Intent, Position, Tag, Text, Tooltip} from '@blueprintjs/core';
import {Link} from 'react-router-dom';
import {css, StyleSheet} from 'aphrodite';
import PropTypes from "prop-types";
import queryString from "query-string";

export const SortTypes = {
    ASC: 'asc',
    DESC: 'desc',
};

export class SortHeaderCell extends React.Component {
    constructor(props) {
      super(props);
  
      this._onSortChange = this._onSortChange.bind(this);
    }
  
    render() {
      const {onSortChange, sortDir, ascIcon, descIcon, children, ...props} = this.props;
      const icon = sortDir === SortTypes.DESC ? descIcon : ascIcon;
      return (
        <Cell onClick={this._onSortChange} {...props}>
            <Text className={css(cellStyles.sortHeader)}>
                <span style={{flexGrow: '3', lineHeight: 'initial'}}>{children}</span>
                {sortDir && <Icon color={Colors.GRAY4} icon={icon}/>}
            </Text>
        </Cell>
      );
    }
  
    _onSortChange(e) {
      e.preventDefault();
      const columns = this.props.columnKey.split('.');
      const cK = columns.length > 1 ? columns[1] : columns[0];
      if (this.props.onSortChange) {
        this.props.onSortChange(
          cK,
          this.props.sortDir ?
            this._reverseSortDirection(this.props.sortDir) :
            SortTypes.DESC
        );
      }
    }

    _reverseSortDirection(sortDir) {
        return sortDir === SortTypes.DESC ? SortTypes.ASC : SortTypes.DESC;
    }
}

const cellStyles = StyleSheet.create({
    sortHeader: {
        display: 'flex'
    }
});

export class TextCell extends React.PureComponent {
    render() {
        const {data, rowIndex, columnKey, action, ...props} = this.props;
        const value = data[rowIndex][columnKey];
        let color = action && (value.includes('✗') ? Colors.RED1 : Colors.GREEN1);
        return (
            <Cell {...props}>
                <span style={{color}}>{value}</span>
            </Cell>
        );
    }
}

export class NestedTextCell extends React.PureComponent {
    render() {
        const {data, rowIndex, columnKey, ...props} = this.props;
        const row = data[rowIndex];
        const keys = columnKey.split('.');
        const column = row[keys[0]];
        const value = column[keys[1]];

        return (
            <Cell {...props}>
                {value}
            </Cell>
        );
    }
}

export class DSupervisorCell extends React.PureComponent {
    render() {
        const {data, rowIndex, columnKey, ...props} = this.props;
        const supervisor = data[rowIndex][columnKey];
        const link = supervisor ? (supervisor.type === 'beneficiary'
            ? `/beneficiaries/${supervisor.uuid}`
            : `/users/${supervisor.uuid}`) : '';
        return (
            <Cell {...props}>
                { supervisor ?<Link to={link}>
                        {supervisor.full_name}
                    </Link>
                    : "N/A"
                }
            </Cell>
        );
    }
}
// {time: "05:18 am", in: true | false}
export class TimeTagCell extends React.PureComponent {
    render() {
        const {data, rowIndex, columnKey, minimal, ...props} = this.props;
        const clock = data[rowIndex][columnKey];
        return (
            <Cell {...props}>
                {
                    clock
                    ? <Tag className={minimal && "pt-minimal"} 
                        intent={clock.in ? Intent.SUCCESS : Intent.DANGER}>
                        {clock.time}
                    </Tag>
                    : "-"
                }
            </Cell>
        );
    }
};

export class ClockOutTimeCell extends React.PureComponent {
    render() {
        const {data, rowIndex, columnKey, minimal, ...props} = this.props;
        const clock = data[rowIndex][columnKey];
        return (
            <Cell {...props}>
                {
                    clock
                    ? <Tag className={minimal && "pt-minimal"} 
                        intent={Intent.DANGER}>
                        {clock}
                    </Tag>
                    : "-"
                }
            </Cell>
        );
    }
};

export class ClockInTimeCell extends React.PureComponent {
    render() {
        const {data, rowIndex, columnKey, minimal, ...props} = this.props;
        const clock = data[rowIndex][columnKey];
        return (
            <Cell {...props}>
                {
                    clock
                    ? <Tag className={minimal && "pt-minimal"} 
                        intent={Intent.SUCCESS}>
                        {clock}
                    </Tag>
                    : "-"
                }
            </Cell>
        );
    }
};

export class TagCell extends React.PureComponent {
    render() {
        const {children, minimal, danger} = this.props;
        return (
            <Tag className={minimal && "pt-minimal"} 
                intent={danger ? Intent.DANGER : Intent.SUCCESS}>
                {children}
            </Tag>
        );
    }
};

export class ValidCell extends React.PureComponent {
    render() {
        const {data, rowIndex, columnKey, minimal, ...props} = this.props;
        const text = data[rowIndex][columnKey];
        return (
            <Cell {...props}>
                {
                    <TagCell minimal danger={text === "invalid"}>{text}</TagCell>
                }
            </Cell>
        );
    }
};

export class ActiveCell extends React.PureComponent {
    render() {
        const {data, rowIndex, columnKey, minimal, ...props} = this.props;
        const text = data[rowIndex][columnKey];
        return (
            <Cell {...props}>
                {
                    <TagCell minimal danger={text === "inactive"}>{text}</TagCell>
                }
            </Cell>
        );
    }
};

export class DStatusCell extends React.PureComponent {
    render() {
        const {data, rowIndex, columnKey, minimal, ...props} = this.props;
        const active = data[rowIndex]["active"];
        const text = data[rowIndex][columnKey];
        return (
            <Cell {...props}>
                { active ?
                    <TagCell minimal danger={text === "offline"}>{text}</TagCell>
                    : "N/A"
                }
            </Cell>
        );
    }
};

export class ABLinkCell extends React.PureComponent {
    render() {
        const {data, rowIndex, icon, minimal, onViewClick, ...props} = this.props;
        const iconName = icon || "eye-open";
        const beneficiary = data[rowIndex];
        return (
            <Cell {...props}>
                <Button
                    icon={iconName}
                    onClick={() => onViewClick(beneficiary)}
                    className={`pt-small ${minimal && 'pt-minimal'}`}/>
            </Cell>
        );
    }
}


export class RoleLinkCell extends React.Component{
    render() {
        const {data, rowIndex, icon, minimal, location: {search}, ...props} = this.props;
        const iconName = icon || "eye-open";
        const row = data[rowIndex];
        const qS = queryString.stringify({...queryString.parse(search), role: row['uuid']});
        const classNames = `pt-button pt-small ${minimal && 'pt-minimal'} pt-icon-${iconName}`;
        return (
            <Cell {...props}>
                <Link to={`/roles?${qS}`} className={classNames}/>
            </Cell>
        );
    }

    static propTypes = {
        location: PropTypes.object.isRequired,
    };
};

export class UserLinkCell extends React.PureComponent {
    render() {
        const {data, rowIndex, icon, minimal, ...props} = this.props;
        const iconName = icon || "eye-open";
        return (
            <Cell {...props}>
                <Link to={`/users/${data[rowIndex]['uuid']}/edit`} className={`pt-button pt-small ${minimal && 'pt-minimal'} pt-icon-${iconName}`}/>
            </Cell>
        );
    }
};

export class DistrictsLinkCell extends React.PureComponent {
    render() {
        const {data, rowIndex, onDeleteClick, icon, minimal, ...props} = this.props;
        // const iconName = icon || "eye-open";
        const row = data[rowIndex];
        return (
            <Cell {...props}>
                <ButtonGroup className="pt-small">
                    <Link
                        to={`/locations/?f=region|${row['id']}`}
                        className={`pt-button pt-icon-eye-open`}/>
                    {/* <Link
                    to={`/locations/regions/${row['code']}/edit`}
                    className={`pt-button pt-icon-edit`}/>
                    <Button onClick={() => onDeleteClick(row)} icon="trash"/> */}
                </ButtonGroup>
            </Cell>
        );
    }
};

export class LocationsLinkCell extends React.PureComponent {
    render() {
        const {data, rowIndex, onDeleteClick, icon, minimal, ...props} = this.props;
        // const iconName = icon || "eye-open";
        const row = data[rowIndex];
        const region = row['region'];
        return (
            <Cell {...props}>
                <ButtonGroup className="pt-small">
                    <Link
                    to={`/locations/?f=region|${region['id']},district|${row['id']}`}
                    className={`pt-button pt-icon-eye-open`}/>
                    <Link
                    to={`/locations/regions/${region['id']}/districts/${row['id']}/edit`}
                    className={`pt-button pt-icon-edit`}/>
                    <Button onClick={() => onDeleteClick(row)} icon="trash"/>
                </ButtonGroup>
            </Cell>
        );
    }
};

export class CityLinkCell extends React.PureComponent {
    render() {
        const {data, rowIndex, onDeleteClick, icon, minimal, ...props} = this.props;
        // const iconName = icon || "eye-open";
        const row = data[rowIndex];
        const district = row['district'];
        const region = district['region'];
        return (
            <Cell {...props}>
                <ButtonGroup className="pt-small">
                    <Link
                    to={`/locations/regions/${region['id']}/districts/${district['id']}/cities/${row['id']}/edit`}
                    className={`pt-button pt-icon-edit`}/>
                    <Button onClick={() => onDeleteClick(row)} icon="trash"/>
                </ButtonGroup>
            </Cell>
        );
    }
};

export class BLinkCell extends React.PureComponent {
    render() {
        const {data, rowIndex, columnKey, icon, disabled, minimal, ...props} = this.props;
        const row = data[rowIndex];
        const iconName = icon || row['valid'] === "valid" ? "eye-open" : "edit";
        return (
            <Cell {...props}>
                <Link to={`/beneficiaries/${row['uuid']}`}
                      className={`pt-button pt-small
                      ${disabled && 'pt-disabled'}
                      ${minimal && 'pt-minimal'} pt-icon-${iconName}`}/>
            </Cell>
        );
    }
}

export class DAssistantLinkCell extends React.PureComponent {
    render() {
        const {data, rowIndex, minimal, onRemoveAssistant, ...props} = this.props;
        const assistant = data[rowIndex];
        const link = assistant ? (assistant.type === 'beneficiary'
            ? `/beneficiaries/${assistant.uuid}`
            : `/users/${assistant.uuid}/edit`) : '';
        return (
            <Cell {...props}>
                <ButtonGroup>
                    <Link
                        to={link}
                        className={`pt-button pt-intent-primary pt-small ${minimal && 'pt-minimal'} pt-icon-eye-open`}/>
                    <Button
                        onClick={() => onRemoveAssistant(assistant)}
                        intent={Intent.DANGER}
                        icon={'small-cross'}
                        className={`pt-small ${minimal && 'pt-minimal'}`}/>
                </ButtonGroup>
            </Cell>
        );
    }
}

export const URemoveFromRole = ({data, onRemoveClick, rowIndex, minimal, ...props}) => (
    <Cell {...props}>
        <Tooltip position={Position.RIGHT} content="remove from group">
            <Button
            onClick={() => onRemoveClick(data[rowIndex])}
                className={`pt-small ${minimal && 'pt-minimal'}`}
                icon="follower"/>
        </Tooltip>
    </Cell>
);

export class FDownloadCell extends React.PureComponent {
    render() {
        const {data, onPresetClick, rowIndex, columnKey, minimal, ...props} = this.props;
        const row = data[rowIndex];
        const preset = <Tooltip position={Position.LEFT} content="Use As Template">
            <Button onClick={() => 
                onPresetClick(row)} 
                className={`pt-small ${minimal && 'pt-minimal'}`} 
                icon="th-derived"/>
        </Tooltip>
        const dlink = <Link to={`/forms/${row['uuid']}`} 
            className={`pt-button pt-small ${minimal && 'pt-minimal'} 
            pt-icon-import`}/>
        return (
            <Cell {...props}>
                {row['count']['pending'] === 0 ? preset : dlink}
            </Cell>
        );
    }
};

export class RoleUserActionCell extends React.PureComponent {
    render() {
        const {data, onRemoveClick, rowIndex, columnKey, disabled, minimal, ...props} = this.props;
        const row = data[rowIndex];
        const remove = <Button disabled={disabled}
            onClick={() => onRemoveClick(row)}
            className={`pt-small pt-intent-danger ${minimal && 'pt-minimal'}`}
            icon="small-cross"/>;
        const userlink = <Link
            to={`/users/${data[rowIndex]['uuid']}/edit`}
            className={`pt-button pt-small ${minimal && 'pt-minimal'} pt-icon-eye-open`}/>;
        return (
            <Cell {...props}>
                <ButtonGroup>
                    {userlink}
                    {remove}
                </ButtonGroup>
            </Cell>
        );
    }
};

export class UserCell extends React.PureComponent {
    render() {
        const {data, rowIndex, columnKey, ...props} = this.props;
        const row = data[rowIndex];
        const keys = columnKey.split(".");
        const cellIntent = keys[1] === "full_name"
            ? (
                <Link
                    to={`/users/${row['user']['uuid']}/edit`}>
                    {row['user']['full_name']}
                </Link>
                ) :
                (
                    <Link
                        to={`/roles?role=${row['user']['role']['uuid']}`}>
                        {row['user']['role']['name']}
                    </Link>
                );
        return (
            <Cell {...props}>
                {cellIntent}
            </Cell>
        );
    }
};

export class UserRoleCell extends React.PureComponent {
    render() {
        const {data, rowIndex, columnKey, ...props} = this.props;
        const row = data[rowIndex];
        let role = row['role'];
        const el = role ? (
            <Link
                to={`/roles?role=${role['uuid']}`}>
                {role['name']}
            </Link>
        ) : "N/A";
        return (
            <Cell {...props}>
                {el}
            </Cell>
        );
    }
};

export class FCountCell extends React.PureComponent {
    render() {
        const {data, rowIndex, columnKey, ...props} = this.props;
        const keys = columnKey.split(".");
        const cellIntent = keys[1] === "total"
            ? Intent.NONE
            : (keys[1] === "pending" ? Intent.WARNING : Intent.SUCCESS);
        const row = data[rowIndex];
        return (
            <Cell {...props}>
                <Tag intent={cellIntent} className="pt-small pt-minimal">
                    {row['count'][keys[1]]}
                </Tag>
            </Cell>
        );
    }
};


export class BackupHealthCell extends React.PureComponent {
    render() {
        const {data, rowIndex, columnKey, ...props} = this.props;
        const row = data[rowIndex];
        const health = row[columnKey];
        const cellIntent = health === 0
            ? Intent.DANGER
            : (health === 1 ? Intent.WARNING : Intent.SUCCESS);
        const healthString = health => {
            return health === 0
            ? "bad"
            : (health === 1 ? "acceptable" : "good");
        };
        return (
            <Cell {...props}>
                <Tag intent={cellIntent} className="pt-small pt-minimal">
                    {healthString(health)}
                </Tag>
            </Cell>
        );
    }
};

export class DLinkCell extends React.PureComponent {
    render() {
        const {data, rowIndex, onViewDevice, minimal, mapActionAllowed, ...props} = this.props;
        const row = data[rowIndex];
        return (
            <Cell {...props}>
                {
                    row['active'] || !mapActionAllowed
                        ? (<Button
                            icon={'eye-open'} className={`pt-small pt-intent-primary ${minimal && 'pt-minimal'}`}
                            onClick={() => onViewDevice(row)}/>
                        )
                        : (<Link
                            to={`/devices/${row['uuid']}/map?device=${row['code']}`}
                            className={`pt-button pt-intent-primary pt-small
                            ${minimal && 'pt-minimal'} pt-icon-send-to-map 
                            ${!mapActionAllowed ? 'pt-disabled' : ''}`}/>
                        )
                }
            </Cell>
        );
    }
}

export class BackupActionsCell extends React.PureComponent {
    render() {
        const {data, rowIndex, columnKey, minimal, deleteAllowed, restoreAllowed, downloadAllowed,
            onRestoreClick, onDeleteClick, onDownloadClick, ...props} = this.props;
        const row = data[rowIndex];
        return (
            <Cell {...props}>
                <ButtonGroup className="pt-small">
                    <Button disabled={!downloadAllowed} onClick={() => onDownloadClick(row)} icon="cloud-download"/>
                    <Button disabled={!restoreAllowed} onClick={() => onRestoreClick(row)} icon="history"/>
                    <Button disabled={!deleteAllowed} onClick={() => onDeleteClick(row)} icon="trash"/>
                </ButtonGroup>
            </Cell>
        );
    }
}