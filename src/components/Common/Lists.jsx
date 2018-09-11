import React from 'react';
import PropTypes from 'prop-types';
import SingleSelect from './Selects/Single';
import OminSelect from "./Selects/Omin";
import SelectMe from "./Selects/SelectMe";
import DataList from "./Selects/DataList";
import MultiLongList from './Selects/Multiple';
import _find from 'lodash/find';



const optionList = items => {
    return items.map(function(item){
        return <option key={item.id} value={item.id}>{item.name}</option>
    });
};

export const ShortList = ({defaultValue, items, onChange, disabled, small = true, required, className}) => {
    return (
        <div className={`pt-select ${small && 'bms-small'} pt-fill ${disabled && 'pt-disabled'} ${className}`}>
            <select disabled={disabled} required={required} value={defaultValue} onChange={({target: {value}}) => {
                if(value !== "Choose...") onChange(value)
            }}>
                <option>Choose...</option>
                {optionList(items)}
            </select>
        </div>
    );
};
ShortList.propTypes = {
    defaultValue: PropTypes.any,
    items: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

export const LongList = ({defaultValue, items, onChange, disabled, small, label, initial}) => {
    const item = _find(items, {id: Number.parseInt(defaultValue, 10)});
    return (
        <SingleSelect
            initial={initial}
            label={label}
            small={small}
            disabled={disabled}
            selectedItem={item}
            items={items}
            onItemSelected={onChange}/>
    );
};
LongList.propTypes = {
    defaultValue: PropTypes.any,
    items: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    initial: PropTypes.bool,
    label: PropTypes.string.isRequired,
};

export const MultipleLongList = ({defaultValues, items, onChange, disabled, small, label, initialContent}) => {
    return (
        <MultiLongList
            initialContent={initialContent}
            label={label}
            small={small}
            disabled={disabled}
            selectedItems={defaultValues}
            items={items}
            onItemSelected={onChange}/>
    );
};

MultipleLongList.propTypes = {
    defaultValues: PropTypes.array,
    items: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    initialContent: PropTypes.bool,
    label: PropTypes.string.isRequired,
};

export const OmniList = ({defaultValue, items, onChange, disabled, small}) => {
    const item = _find(items, {id: defaultValue});
    return (
        <OminSelect
            small={small}
            disabled={disabled}
            selectedItem={item}
            items={items}
            onItemSelected={onChange}/>
    );
};
OmniList.propTypes = {
    defaultValue: PropTypes.any,
    items: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool
};

export const SelectMeList = ({defaultValue, items, onChange, disabled, small}) => {
    const item = _find(items, {id: defaultValue});
    return (
        <SelectMe
            small={small}
            disabled={disabled}
            selectedItem={item}
            items={items}
            onItemSelected={onChange}/>
    );
};
SelectMeList.propTypes = {
    defaultValue: PropTypes.any,
    items: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool
};

export const DataListSelect = ({defaultValue, items, onChange, disabled, small, dataListId}) => {
    return (
        <DataList
            listId={dataListId}
            items={items}
            onItemSelected={onChange}
            disabled={disabled}
            small={small}
            selectedItem={defaultValue}/>
    );
};
DataListSelect.propTypes = {
    defaultValue: PropTypes.any,
    items: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    dataListId: PropTypes.any.isRequired,
    disabled: PropTypes.bool
};
