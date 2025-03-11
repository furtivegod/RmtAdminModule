import React, { Component } from "react";
import { connect } from "react-redux";
import { Router, Switch, Route, Redirect } from "react-router-dom";

import PrivateRoute from "./components/PrivateRoute"

import "bootstrap/dist/css/bootstrap.min.css";
import "./stylesheet/index.scss"

import Login from "./components/login.component";
import Home from "./components/home.component";
// import PageNotFound from './components/PageNotFound'

import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";

import { history } from './helpers/history';

// import AuthVerify from "./common/auth-verify";
import EventBus from "./common/EventBus";
import AppLogout from "./components/AppLogout";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    };

    history.listen((location) => {
      props.dispatch(clearMessage()); // clear message when changing location
    });
  }

  componentDidMount() {
    const user = this.props.user;

    if (user) {
      this.setState({
        currentUser: user,
        showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
    }
    EventBus.on("logout", () => {
      this.logOut();
    });
  }

  componentWillUnmount() {
    EventBus.remove("logout");
  }

  logOut() {
    this.props.dispatch(logout());
    this.setState({
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    });
  }

  render() {
    // const { currentUser, showModeratorBoard, showAdminBoard } = this.state;

    return (
      <Router history={history}>
        <div>
          {/* <Navbar currentUser={currentUser} showModeratorBoard={showModeratorBoard} showAdminBoard={showAdminBoard} /> */}
          <div className="container mt-3">
            <Switch>
              <Route exact path="/login" component={Login} />
              <AppLogout>
                <Switch>
                  <PrivateRoute exact path={["/", "/home"]} component={Home} />
                  <Redirect to="/" />
                </Switch>
              </AppLogout>
            </Switch>
          </div>
          {/* <AuthVerify logOut={this.logOut}/> */}
        </div>
      </Router>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state.auth;
  return {
    user,
  };
}

export default connect(mapStateToProps)(App);
