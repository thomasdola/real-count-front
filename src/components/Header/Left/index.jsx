import React from 'react';
import {Button, ButtonGroup, Navbar, NavbarDivider, NavbarGroup, NavbarHeading} from "@blueprintjs/core";
import Loadable from 'react-loadable';
import './index.css';
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {logout} from "../../../actions/authActions";
import {ConfirmAlert} from '../../Content/Beneficiary';
import {withRouter} from "react-router-dom";

const UserProfile = Loadable({
    loader: () => import('../../Content/Profile'),
    loading: () => null,
});

class Header extends React.Component{
    state = {
        profile: false,
        confirmLogout: false
    };

    constructor(props){
        super(props);

        this._toggleProfile = this._toggleProfile.bind(this);
        this._logout = this._logout.bind(this);
    }

    _toggleProfile(){
        this.setState({profile: !this.state.profile})
    }

    _logout(){
        this.setState({confirmLogout: false});
        this.props.logout();
        this.props.history.replace(`/auth/login`);
        window.location.reload();
    }

    render(){
        const {confirmLogout} = this.state;
        return [
            <ConfirmAlert
                key={'alert'}
                open={confirmLogout}
                onConfirm={this._logout}
                onCancel={() => this.setState({confirmLogout: false})} />,

            <Navbar key="nav" className="pt-dark">
                <NavbarGroup>
                    <NavbarHeading>
                        BMS
                    </NavbarHeading>
                </NavbarGroup>
                <NavbarGroup align="right">
                    <NavbarDivider/>
                    <ButtonGroup minimal={true} large={false}>
                        <Button
                            onClick={() => this.setState({confirmLogout: true})}
                            icon="power"/>
                        <Button onClick={this._toggleProfile} active={this.state.profile} icon="user"/>
                    </ButtonGroup>
                </NavbarGroup>
            </Navbar>,

            <UserProfile
                onCloseProfile={this._toggleProfile}
                open={this.state.profile} key="profile"/>
        ];
    }

    static propTypes = {
        history: PropTypes.object.isRequired,
        logout: PropTypes.func.isRequired,
    };
}

const mapDispatchToProps = dispatch => bindActionCreators({logout}, dispatch);
export default withRouter(connect(null, mapDispatchToProps)(Header));