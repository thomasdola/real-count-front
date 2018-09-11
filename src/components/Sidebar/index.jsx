import React from 'react';

import {Link} from "react-router-dom";
import './index.css';
import {connect} from "react-redux";
import * as gates from '../../api/constants/Gates';
import Can from "../../helpers/Can";

class Sidebar extends React.Component{
        render(){
            const {authUser: {root}, authUser} = this.props;
            const allowed = page => root || Can.User(authUser).access(page);

            return [
                <nav key="topNav">
                    <ul className="bms-sidebar-menu">
                        {allowed(gates.DASHBOARD)
                        && (
                            <li className="bms-sidebar-menu-item">
                                <Link
                                    to={'/'}
                                    className="pt-button pt-large pt-fill pt-minimal pt-icon-standard pt-icon-dashboard">
                                    Dashboard
                                </Link>
                            </li>
                        )}

                        {allowed(gates.BENEFICIARIES)
                        && (
                            <li className="bms-sidebar-menu-item">
                                <Link
                                    to={'/beneficiaries'}
                                    className="pt-button pt-large pt-fill pt-minimal pt-icon-standard pt-icon-walk">
                                    Beneficiaries
                                </Link>
                            </li>
                        )}

                        {allowed(gates.ENROLLMENT)
                        && (
                            <li className="bms-sidebar-menu-item">
                                <Link
                                    to={'/enroll'}
                                    className="pt-button pt-large pt-fill pt-minimal pt-icon-standard pt-icon-manual">
                                    Enroll
                                </Link>
                            </li>
                        )}

                        {allowed(gates.FORMS)
                        && (
                            <li className="bms-sidebar-menu-item">
                                <Link
                                    to={'/forms'}
                                    className="pt-button pt-large pt-fill pt-minimal pt-icon-standard pt-icon-form">
                                    Forms
                                </Link>
                            </li>
                        )}

                        {allowed(gates.ATTENDANCE)
                        && (
                            <li className="bms-sidebar-menu-item">
                                <Link
                                    to={'/attendance'}
                                    className="pt-button pt-large pt-fill pt-minimal pt-icon-standard pt-icon-calendar">
                                    Attendance
                                </Link>
                            </li>
                        )}

                        {allowed(gates.LOCATIONS)
                        && (
                            <li className="bms-sidebar-menu-item">
                                <Link
                                    to={'/locations'}
                                    className="pt-button pt-large pt-fill pt-minimal pt-icon-standard pt-icon-globe">
                                    Locations
                                </Link>
                            </li>
                        )}

                        {allowed(gates.DEVICES)
                        && (
                            <li className="bms-sidebar-menu-item">
                                <Link
                                    to={'/devices'}
                                    className="pt-button pt-large pt-fill pt-minimal pt-icon-standard pt-icon-mobile-phone">
                                    Devices
                                </Link>
                            </li>
                        )}

                        {allowed(gates.REPORTS)
                        && (
                            <li className="bms-sidebar-menu-item">
                                <Link
                                    to={'/reports'}
                                    className="pt-button pt-large pt-fill pt-minimal pt-icon-standard pt-icon-timeline-area-chart">
                                    Reports
                                </Link>
                            </li>
                        )}

                        {allowed(gates.ROLES)
                        && (
                            <li className="bms-sidebar-menu-item">
                                <Link
                                    to={'/roles'}
                                    className="pt-button pt-large pt-fill pt-minimal pt-icon-standard pt-icon-key">
                                    User Groups
                                </Link>
                            </li>
                        )}

                        {allowed(gates.USERS)
                        && (
                            <li className="bms-sidebar-menu-item">
                                <Link
                                    to={'/users'}
                                    className="pt-button pt-large pt-fill pt-minimal pt-icon-standard pt-icon-people">
                                    Users
                                </Link>
                            </li>
                        )}

                    </ul>
                </nav>,

                <nav key="bottomNav">
                    <ul className="bms-sidebar-menu">

                        {allowed(gates.LOGS)
                        && (
                            <li className="bms-sidebar-menu-item">
                                <Link
                                    to={'/audit-trail'}
                                    className="pt-button pt-large pt-fill pt-minimal pt-icon-standard pt-icon-console">
                                    Audit Trail
                                </Link>
                            </li>
                        )}

                        {allowed(gates.BACKUPS)
                        && (
                            <li className="bms-sidebar-menu-item">
                                <Link
                                    to={'/backups'}
                                    className="pt-button pt-large pt-fill pt-minimal pt-icon-standard pt-icon-database">
                                    Backups
                                </Link>
                            </li>
                        )}

                    </ul>
                </nav>
            ];
        }
}

export default connect(({authUser}) => ({authUser}))(Sidebar);