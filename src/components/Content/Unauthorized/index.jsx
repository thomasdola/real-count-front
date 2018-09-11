import React from 'react';
import './index.css';
import image from './images/not-allowed-symbol.svg';

export default class Unauthorized extends React.Component{

    render(){
        return (
            <div className="unauthorized__wrapper">
                <div className="image">
                    <img src={image} alt=""/>
                </div>
                <div className="message">
                    <div>
                        You Are Not Authorized To Access This Page.
                    </div>
                    <div>
                        Kindly Contact Your IT Department For Assistance. Thank You...
                    </div>
                </div>
            </div>

        );
    }
}