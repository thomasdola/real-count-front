import React from 'react';
import {Button, Dialog} from '@blueprintjs/core';
import {withRouter} from 'react-router-dom';

class AddPolicies extends React.Component{
    render(){

        return (
            <Dialog
                backdropClassName="transparent__back"
                style={{width: '350px'}}
                lazy
                icon="layers"
                canOutsideClickClose={false}
                isOpen
                title="Add Policy(ies) to Group Name"
            >
                <div className="pt-dialog-body">
                    <label className="pt-label">
                        Policies
                        <div className="pt-select">
                            <select>
                                <option>Select ...</option>
                                <option value="1">Jane Doe</option>
                            </select>
                        </div>
                    </label>
                </div>
                <div className="pt-dialog-footer">
                    <div className="pt-dialog-footer-actions">
                        {/* <Button text="Secondary" /> */}
                        <Button
                            icon="tick"
                            text="save"
                        />
                    </div>
                </div>
            </Dialog>
        );
    }
}

export default withRouter(AddPolicies);