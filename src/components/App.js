import React, { Component } from 'react';
import Sidebar from './Sidebar';
import HeaderLeft from './Header/Left';
import Content from './Content';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import './App.css';
const classNames = require('classnames');

class App extends Component {
  render() {

    return <div className={classNames('container', 'ScrollWrapper')}>
        <div key="left" id="left" className="column">
            <div className="top-left">
                <HeaderLeft/>
            </div>
            <div className="bottom bottom__Dark">
                <Sidebar/>
            </div>
        </div>
        <div key="right" id="right" style={{width: '100%'}} className="column">
            {/* <div className="top-right">
                <HeaderRight/>
            </div> */}
            <div className="bottom">
                <Content/>
            </div>
        </div>
    </div>;
  }
}

export default App;
