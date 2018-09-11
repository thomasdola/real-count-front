import React from 'react';
import {Button} from '@blueprintjs/core';
import './index.css';
import {goInFullscreen} from "../../../helpers/fullscreen";
import {Bottom, Middle, Top} from './sections';


export default class Dashboard extends React.Component{

    constructor(props){
        super(props);

        this._toggleFullScreen = this._toggleFullScreen.bind(this);
        this.el = React.createRef();
    }

    _toggleFullScreen(){
        goInFullscreen(this.dashboard);
    }

    render(){
        return [
            <div ref={dashboard => this.dashboard = dashboard}
                 key={'dashboard'} className="dashboard__wrapper">
                <Top/>

                <Middle/>

                <Bottom/>
            </div>,

            <Button
                key={'fullscreen'} onClick={this._toggleFullScreen}
                className="toggle__fullscreen pt-small pt-minimal"
                icon={'maximize'}/>
        ]
    }
}