import React, { Component } from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
// import logo from './logo.svg';
import "./global.css";

// Components
import Header from "./components/Header";
import Courses from "./components/Courses";
import CourseDetail from "./components/CourseDetail";
import CreateCourse from "./components/CreateCourse";
import UpdateCourse from "./components/UpdateCourse";
import UserSignIn from "./components/UserSignIn";
import UserSignOut from "./components/UserSignOut";
import UserSignUp from "./components/UserSignUp";
import { NotFound } from "./components/NotFound";
import { Forbidden } from "./components/Forbidden";
import { UnhandledError } from "./components/UnhandledError";

// Provides Header access to location
const HeaderwithRouter = withRouter(Header);

class App extends Component {
  render() {
    return (
      <div className="App">
        <HeaderwithRouter />
        {/* Routes */}
        <Switch>
          {/* Passing in 'props' is necessary so it has access to history. It has to be in the format of:  render={(props) => <SomeComponent {...props} />}. This will not work: <SomeComponent history={props.history} />}. Any component that handles redirecting needs access to history. This includes those that make an API call and use 'handleError.js'. The error handler gets history from the callers props.  */}

          <Redirect exact path="/" to="/courses" />

          <Route
            exact
            path="/courses"
            render={props => <Courses {...props} />}
          />

          <Route
            exact
            path="/courses/create"
            render={props => <CreateCourse {...props} />}
          />

          <Route
            exact
            path="/courses/:id/update"
            render={props => <UpdateCourse {...props} />}
          />

          <Route
            path="/courses/:id"
            render={props => <CourseDetail {...props} />}
          />

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
