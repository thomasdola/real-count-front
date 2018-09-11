import React from 'react';
import PropTypes from 'prop-types';
import {Tab, Tabs} from "@blueprintjs/core";
import './index.css';
import {connect} from 'react-redux';
import * as serverEntities from '../../../helpers/server/entities';
import {
    AllowanceReport,
    CountReport,
    DetailReport,
    DetailsReport,
    EnrolmentFormReport,
    EnrolmentReport,
    MultipleAttendanceReport,
    SingleAttendanceReport
} from './forms';
import {reset} from "../../../actions/operationActions";
import {browserDownload} from "../../../actions/downloadActions";
import queryString from "query-string";
import _isEqual from 'lodash/isEqual';
import {withRouter} from "react-router-dom";
import {GENERATE_REPORT} from '../../../actions/types';
import Toaster from "../../Common/Toaster";
import {Intent} from "@blueprintjs/core/lib/esm/index";
import {Operating} from "../Backups";
import {
    initSocketListeners,
    onReportGenerated,
    onReportGenerationFailed,
    stopSocketListeners
} from '../../../actions/socket/reportActions';
import {bindActionCreators} from "redux";
import {REPORTS} from '../../../api/constants/Gates';
import {
    BENEFICIARIES_ALLOWANCE,
    BENEFICIARIES_ATTENDANCE,
    BENEFICIARIES_COUNT,
    BENEFICIARIES_ENROLMENT,
    BENEFICIARIES_INFORMATION,
    BENEFICIARY_ATTENDANCE,
    BENEFICIARY_INFORMATION,
    ENROLMENT_FORMS
} from '../../../api/constants/Entities';
import {GENERATE} from '../../../api/constants/Actions';
import Can from "../../../helpers/Can";

class Reports extends React.Component{

    constructor(props){
        super(props);

        this._handleChangeOfTab = this._handleChangeOfTab.bind(this);
    }

    state = {tabId: serverEntities.BENEFICIARIES_ALLOWANCE};

    componentDidMount(){
        const {socket, authUser, onReportGenerated, onReportGenerationFailed} = this.props;
        initSocketListeners(socket, {authUser, onReportGenerated, onReportGenerationFailed});
    }

    static getDerivedStateFromProps(nextProps, prevState){
        const {tabId: prevTabId} = prevState;
        const {location: {search: newSearch}} = nextProps;
        const {type: tabId} = queryString.parse(newSearch);

        if(_isEqual(prevTabId, tabId))
            return null;

        return { tabId };
    }

    componentDidUpdate(prevProps){
        const {OPERATION_SUCCESSFUL: OLD_OPERATION_SUCCESSFUL, OPERATION_FAILED: OLD_OPERATION_FAILED} = prevProps;
        const {OPERATION_SUCCESSFUL, OPERATION_FAILED} = this.props;

        if(!_isEqual(OLD_OPERATION_SUCCESSFUL, OPERATION_SUCCESSFUL)){
            const {action, data: {scheduled, report}} = OPERATION_SUCCESSFUL;
            if(action === GENERATE_REPORT && !scheduled){
                Toaster.show({
                    message: "Report Ready 😃",
                    timeout: 0,
                    intent: Intent.SUCCESS,
                    action: {
                        onClick: () => Reports._onDownloadReport(report),
                        icon: 'cloud-download',
                        text: 'download'
                    },
                    icon: 'tick' });
            }
        }

        if(!_isEqual(OLD_OPERATION_FAILED, OPERATION_FAILED)){
            if(OPERATION_FAILED.action === GENERATE_REPORT){
                this.props.reset();
                console.log(OPERATION_FAILED.data);
                Toaster.show({
                    message: "Report Could Not Be Generated 😞",
                    timeout: 0,
                    intent: Intent.DANGER,
                    icon: 'error' });
            }
        }
    }

    componentWillUnmount(){
        const {socket, authUser} = this.props;
        stopSocketListeners(socket, {authUser});
    }

    static _onDownloadReport({path}){
        const type = path.split(".")[1];
        browserDownload(path, type, true);
    }

    _handleChangeOfTab(nexTabId, prevTabId){
        if(nexTabId !== prevTabId){
            this.props.history.push(`?type=${nexTabId}`);
        }
    }


    render(){
        const {OPERATION_SUCCESSFUL: {data: {scheduled}}, OPERATION_FAILED, authUser} = this.props;

        const canGenerate = type => authUser.root || Can.User(authUser).perform(GENERATE, type, REPORTS);

        console.log('reports', canGenerate(ENROLMENT_FORMS), authUser.root || 
            Can.User(authUser).perform(GENERATE, ENROLMENT_FORMS, REPORTS));

        return <div className="reports__wrapper">

            <Operating
                content={"Generating Report... 😃"}
                intent={Intent.NONE}
                on={scheduled && OPERATION_FAILED.action !== GENERATE_REPORT}/>

            <Tabs
                selectedTabId={this.state.tabId}
                onChange={(nextTabId, prevTabId) => this._handleChangeOfTab(nextTabId, prevTabId)}
                large
                vertical
                renderActiveTabPanelOnly>

                {canGenerate(BENEFICIARIES_ALLOWANCE) ? (
                    <Tab id={serverEntities.BENEFICIARIES_ALLOWANCE}
                        disabled={this.props.generatingReport}
                        title="Beneficiaries Allowance" panel={<AllowanceReport />} />
                ) : null}

                {canGenerate(ENROLMENT_FORMS) ? (
                    <Tab id={serverEntities.ENROLLMENT_FORMS}
                        disabled={this.props.generatingReport}
                        title="Beneficiaries Enrollment Forms" panel={<EnrolmentFormReport />} />
                ) : null}

                {canGenerate(BENEFICIARIES_ENROLMENT) ? (
                    <Tab id={serverEntities.BENEFICIARIES_ENROLLMENT}
                        disabled={this.props.generatingReport}
                        title="Beneficiaries Enrollment" panel={<EnrolmentReport />} />
                ) : null}

                {canGenerate(BENEFICIARIES_COUNT) ? (
                    <Tab id={serverEntities.BENEFICIARIES_COUNT}
                        disabled={this.props.generatingReport}
                        title="Beneficiary Count" panel={<CountReport />} />
                ) : null}

                {canGenerate(BENEFICIARY_INFORMATION) ? (
                    <Tab id={serverEntities.BENEFICIARY_INFORMATION}
                        disabled={this.props.generatingReport}
                        title="Beneficiary Details" panel={<DetailReport />} />
                ) : null}

                {canGenerate(BENEFICIARIES_INFORMATION) ? (
                    <Tab id={serverEntities.BENEFICIARIES_INFORMATION}
                        disabled={this.props.generatingReport}
                        title="Beneficiaries Details" panel={<DetailsReport />} />
                ) : null}

                {canGenerate(BENEFICIARY_ATTENDANCE) ? (
                    <Tab id={serverEntities.BENEFICIARY_ATTENDANCE}
                        disabled={this.props.generatingReport}
                        title="Beneficiary Attendance" panel={<SingleAttendanceReport />} />
                ) : null}

                {canGenerate(BENEFICIARIES_ATTENDANCE) ? (
                    <Tab id={serverEntities.BENEFICIARIES_ATTENDANCE}
                        disabled={this.props.generatingReport}
                        title="Beneficiaries Attendance" panel={<MultipleAttendanceReport />} />
                ) : null}

                <Tabs.Expander />

            </Tabs>
        </div>
    }

    static propTypes = {
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        authUser: PropTypes.object.isRequired,
        socket: PropTypes.object.isRequired,
        OPERATION_SUCCESSFUL: PropTypes.object.isRequired,
        OPERATION_FAILED: PropTypes.object.isRequired,
        generatingReport: PropTypes.bool.isRequired,
        onReportGenerationFailed: PropTypes.func.isRequired,
        onReportGenerated: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
    };
}

const mapStateToProps = ({generatingReport, authUser, socket, OPERATION_SUCCESSFUL, OPERATION_FAILED}) => (
    {authUser, socket, generatingReport, OPERATION_SUCCESSFUL, OPERATION_FAILED});

const mapDispatchToProps = dispatch => bindActionCreators({onReportGenerated, onReportGenerationFailed, reset}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Reports));