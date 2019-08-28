import React, { Component } from "react";
// import logo from './logo.svg';
import "./global.css";

// Components
import CourseDetail from "./components/CourseDetail";
import Courses from "./components/Courses";
import CreateCourse from "./components/CreateCourse";
import Header from "./components/Header";
import UpdateCourse from "./components/UpdateCourse";
import UserSignIn from "./components/UserSignIn";
import UserSignOut from "./components/UserSignOut";
import UserSignUp from "./components/UserSignUp";
import { NotFound } from "./components/NotFound";
import { UnhandledError } from "./components/UnhandledError";
import { Forbidden } from "./components/Forbidden";

// Router
import { Route, Switch, Redirect, withRouter } from "react-router-dom";

// Provides Header access to location
const HeaderwithRouter = withRouter(Header);

class App extends Component {
  render() {
    return (
      <div className="App">
        <HeaderwithRouter />

        <Switch>
          {/* TO DO would this also work: <Redirect exact path='/' to='/courses' /> */}
          <Route exact path="/" render={() => <Redirect to="/courses" />} />

          <Route exact path="/courses" render={() => <Courses />} />

          <Route
            exact
            path="/courses/create"
            render={props => <CreateCourse {...props} />}
          />

          <Route
            exact
            path="/courses/:id/update"
            render={props => (
              <UpdateCourse id={props.match.params.id} {...props} />
            )}
          />

          <Route
            path="/courses/:id"
            render={props => (
              <CourseDetail id={props.match.params.id} {...props} />
            )}
          />

          {/* Passing in 'props' is necessary so it has access to history. It has to be in the format of:  render={(props) => <SomeComponent {...props} />}. This will not work: <SomeComponent history={props.history} />}   */}

          <Route
            exact
            path="/signin"
            render={props => <UserSignIn {...props} />}
          />

          <Route
            exact
            path="/signup"
            render={props => <UserSignUp {...props} />}
          />
          <Route exact path="/signout" render={() => <UserSignOut />} />

          {/* Error routes */}

          <Route exact path="/forbidden" render={() => <Forbidden />} />

          <Route exact path="/error" render={() => <UnhandledError />} />

          <Route exact path="/notfound" render={() => <NotFound />} />

          <Route path="/" render={() => <NotFound />} />
        </Switch>
      </div>
    );
  }
}

export default App;
