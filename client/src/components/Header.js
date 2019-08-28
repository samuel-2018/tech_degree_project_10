import React, { Component } from "react";
import { Link } from "react-router-dom";

// For wrapping on export, provides context
import { withContext } from "../helpers/context";

// TO DO change to FUNCTION (project specs page 4)
class Header extends Component {
  render() {
    // Sets page title
    document.title = "Courses";

    const { location, context } = this.props;

    function loginJSX() {
      if (!!context.authenticatedUser && !!context.user) {
        return (
          <nav>
            <span>
              Welcome, {context.user.firstName + " " + context.user.lastName}!
            </span>

            <Link
              to={{
                pathname: `/signout`,
                state: { from: location }
              }}
              className="signout"
            >
              Sign Out
            </Link>
          </nav>
        );
      } else {
        return (
          <nav>
            <Link
              to={{
                pathname: `/signup`,
                state: { from: location }
              }}
              className="signup"
            >
              Sign Up
            </Link>

            <Link
              to={{
                pathname: `/signin`,
                state: { from: location }
              }}
              className="signin"
            >
              Sign In
            </Link>
          </nav>
        );
      }
    }

    return (
      <div className="header">
        <div className="bounds">
          <h1 className="header--logo">
            <Link to={{ pathname: `/courses` }}>Courses</Link>
          </h1>
          {loginJSX()}
        </div>
      </div>
    );
  }
}

// Wrapper provides context
export default withContext(Header);
