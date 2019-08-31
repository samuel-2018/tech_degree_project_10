import React from "react";
import { Link } from "react-router-dom";

// For wrapping on export, provides context
import { withContext } from "../helpers/context";

const Header = props => {
  // Sets page title
  document.title = "Courses";
  // 'location' is the current route.
  //  Each 'Link' element provides that
  // information to the page followed
  // through the link.
  const { location, context } = props;

  return (
    <div className="header">
      <div className="bounds">
        <h1 className="header--logo">
          <Link to={{ pathname: `/courses` }}>Courses</Link>
        </h1>
        {/* Is user authenticated? Is user data ready? */}
        {!!context.authenticatedUser && !!context.user ? (
          // Yes, display welcome message and "Sign Out" button.
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
          // No, display "Sign Up" and "Sign In" buttons.
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
