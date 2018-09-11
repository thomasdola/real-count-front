import React from 'react';
import './index.scss';
import {Button, Navbar, NavbarDivider, NavbarGroup, Popover, Position} from "@blueprintjs/core";
import Notifications from './Notifications';

export default class Header extends React.Component{
    render(){
        return (
            <Navbar style={{width: '100%'}}>
                <NavbarGroup align="right">
                    <Popover position={Position.BOTTOM_RIGHT}>
                        <Button className="pt-minimal" iconName="notifications"/>
                        <Notifications />
                    </Popover>
                    <NavbarDivider />
                    <Button className="pt-minimal" iconName="user"/>
                </NavbarGroup>
            </Navbar>
        );
    }
}