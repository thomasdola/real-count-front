import React from 'react';
import './index.scss';
import {MenuItem, MenuDivider, Menu} from "@blueprintjs/core";

export default class Notifications extends React.Component{
    render(){
        return (
            <Menu>
                <MenuItem
                    iconName="new-text-box"
                    text="New text box"
                />
                <MenuDivider />
                <MenuItem
                    iconName="new-object"
                    text="New object"
                />
                <MenuDivider />
                <MenuItem
                    iconName="new-link"
                    text="New link"
                />
                <MenuDivider />
                <MenuItem text="Settings..." iconName="cog" />
            </Menu>
        );
    }
}