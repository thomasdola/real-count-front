import React from 'react';
import {Button, Dialog} from '@blueprintjs/core';
import {withRouter} from 'react-router-dom';
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {createBackup} from "../../../../actions/backupActions";
import {connect} from "react-redux";
import _isEqual from "lodash/isEqual";
import {CREATE_BACKUP} from "../../../../actions/types";

class Backup extends React.Component{

    constructor(props){
        super(props);
        this._onCreateNewBackup = this._onCreateNewBackup.bind(this);
    }

    state = {name: ''};

    _onCreateNewBackup(){
        let data = new FormData();
        data.append('name', this.state.name);
        this.props.createBackup(data);
    }

    componentDidUpdate(prevProps){
        const {OPERATION_SUCCESSFUL: OLD_OPERATION_SUCCESSFUL} = prevProps;
        const {OPERATION_SUCCESSFUL, history} = this.props;

        if(!_isEqual(OLD_OPERATION_SUCCESSFUL, OPERATION_SUCCESSFUL)){
            if(OPERATION_SUCCESSFUL.action === CREATE_BACKUP){
                history.goBack();
            }
        }
    }

    render(){
        const {history, creatingBackup} = this.props;

        return (
            <Dialog
                backdropClassName="transparent__back"
                style={{width: '350px'}}
                lazy
                icon="database"
                onClose={() => history.goBack()}
                canOutsideClickClose={false}
                isOpen
                title="New Backup"
            >
                <div className="pt-dialog-body">
                    <label className="pt-label">
                        Name
                        <input
                            value={this.state.name || ''}
                            onChange={({target: {value}}) => this.setState({name: value})}
                            className="pt-input pt-fill" type="text" dir="auto" />
                    </label>
                </div>
                <div className="pt-dialog-footer">
                    <div className="pt-dialog-footer-actions">
                        <Button
                            disabled={!this.state.name.trim()}
                            loading={creatingBackup}
                            className="pt-intent-primary"
                            icon="tick"
                            onClick={this._onCreateNewBackup}
                            text="Create"
                        />
                    </div>
                </div>
            </Dialog>
        );
    }

    static propTypes = {
        history: PropTypes.object.isRequired,
        createBackup: PropTypes.func.isRequired,
        creatingBackup: PropTypes.bool.isRequired,
        OPERATION_SUCCESSFUL: PropTypes.object.isRequired,
        OPERATION_FAILED: PropTypes.object.isRequired,
    }
}

const mapStateTopProps = ({creatingBackup, OPERATION_SUCCESSFUL, OPERATION_FAILED}) => (
    {creatingBackup, OPERATION_SUCCESSFUL, OPERATION_FAILED});
const mapDispatchToProps = dispatch => bindActionCreators({createBackup}, dispatch);

export default withRouter(connect(mapStateTopProps, mapDispatchToProps)(Backup));