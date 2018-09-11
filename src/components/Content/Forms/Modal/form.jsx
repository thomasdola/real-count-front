import React from 'react';
import PropTypes from 'prop-types';
import {Button, Dialog, Intent} from '@blueprintjs/core';
import {withRouter} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import {generatePending, useAsPreset} from '../../../../actions/formGroupActions';
import {connect} from 'react-redux';
import _find from 'lodash/find';
import _isEqual from 'lodash/isEqual';
import {GENERATE_FORMS} from "../../../../actions/types";

class Form extends React.Component{

    constructor(props){
        super(props);

        this._onGenerateForm = this._onGenerateForm.bind(this);
        this._onUseFormAsPreset = this._onUseFormAsPreset.bind(this);
    }

    state = {
        form: {
            region: {},
            district: {},
            location: {},
            module: {},
            rank: {},
            count: {}
        }
    };

    componentDidMount(){
        const {forms, match: {params: {uuid}}} = this.props;
        const form = _find(forms, {uuid});
        if(form){
            this.setState({form})
        }
    }

    static getDerivedStateFromProps(nextProps){
        const {forms, match: {params: {uuid}}} = nextProps;
        const form = _find(forms, {uuid});

        if(!form) return null;

        return {form};
    }

    componentDidUpdate(prevProps){
        const {OPERATION_SUCCESSFUL: OLD_OPERATION_SUCCESSFUL} = prevProps;
        const {OPERATION_SUCCESSFUL, history} = this.props;

        if(!_isEqual(OLD_OPERATION_SUCCESSFUL, OPERATION_SUCCESSFUL)){
            if(OPERATION_SUCCESSFUL.action === GENERATE_FORMS){
                history.goBack();
            }
        }
    }

    _onGenerateForm(){
        const {generatePending, match: {params: {uuid}}} = this.props;
        generatePending(uuid);
    }

    _onUseFormAsPreset(){
        const {useAsPreset, forms, match: {params: {uuid}}, history} = this.props;
        useAsPreset(_find(forms, {uuid}));
        history.goBack();
    }

    render(){
        const {history, generatingPendingForms} = this.props;
        const {form} = this.state;

        return (
            <Dialog
                backdropClassName="transparent__back"
                style={{width: '350px'}}
                onClose={() => history.goBack()}
                lazy
                icon="form"
                isOpen
                title={form.name}
            >
                <div className="pt-dialog-body">
                    <label className="pt-label">
                        Region
                        <input readOnly value={form.region.name || ''} className="pt-input pt-fill"
                               type="text" dir="auto" />
                    </label>
                    <label className="pt-label">
                        District
                        <input readOnly value={form.district.name || ''} className="pt-input pt-fill"
                               type="text" dir="auto" />
                    </label>
                    <label className="pt-label">
                        Location
                        <input readOnly value={form.location.name || ''} className="pt-input pt-fill"
                               type="text" dir="auto" />
                    </label>
                    <label className="pt-label">
                        Module
                        <input readOnly value={form.module.name || ''} className="pt-input pt-fill"
                               type="text" dir="auto" />
                    </label>
                    <label className="pt-label">
                        Rank
                        <input readOnly value={form.rank.name || ''} className="pt-input pt-fill"
                               type="text" dir="auto" />
                    </label>
                    <label className="pt-label">
                        Number To Generate
                        <input readOnly value={form.count.pending || ''} className="pt-input pt-fill"
                               type="text" dir="auto" />
                    </label>
                </div>
                <div className="pt-dialog-footer">
                    <div className="pt-dialog-footer-actions">
                        <Button
                            disabled={generatingPendingForms}
                            intent={Intent.WARNING}
                            onClick={this._onUseFormAsPreset}
                            icon="th-derived"
                            text="Use As Template" />
                        <Button
                            intent={Intent.PRIMARY}
                            loading={generatingPendingForms}
                            onClick={this._onGenerateForm}
                            icon="tick"
                            text="Generate"
                        />
                    </div>
                </div>
            </Dialog>
        );
    }

    static propTypes = {
        history: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        OPERATION_SUCCESSFUL: PropTypes.object.isRequired,
        generatePending: PropTypes.func.isRequired,
        useAsPreset: PropTypes.func.isRequired,
        forms: PropTypes.array.isRequired,
        generatingPendingForms: PropTypes.bool.isRequired,
        generatedForm: PropTypes.object.isRequired,
    };
}

const mapStateToProps = (
    {OPERATION_SUCCESSFUL, forms, generatingPendingForms, generatedForm}) => (
        {OPERATION_SUCCESSFUL, forms, generatingPendingForms, generatedForm});
const mapDispatchToProps = dispatch => bindActionCreators({useAsPreset, generatePending}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Form));