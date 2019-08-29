import React from "react";
import { Link } from "react-router-dom";

// For wrapping on export, provides context
import { withContext } from "../helpers/context";

const Header = props => {
  // Sets page title
  document.title = "Courses";

  const { location, context } = props;

  return (
    <div className="header">
      <div className="bounds">
        <h1 className="header--logo">
          <Link to={{ pathname: `/courses` }}>Courses</Link>
        </h1>

        {!!context.authenticatedUser && !!context.user ? (
          <nav className="main-nav">
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
        ) : (
          <nav className="main-nav">
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
        )}
      </div>
    </div>
  );
};

// Wrapper provides context
export default withContext(Header);
