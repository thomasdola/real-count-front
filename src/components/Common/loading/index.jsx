import React from 'react';
import {Spinner} from '@blueprintjs/core';
import './index.css';

export default () => {
    return (
        <div className="loading">
            <Spinner/>
        </div>
    );
};