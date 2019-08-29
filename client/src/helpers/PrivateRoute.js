// Enables access to global state
import { Consumer } from "./context";

import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";

// HOC
function PrivateRoute(OriginalComponent) {
  return function(...props) {
    const { location } = props;
    return (
      <Consumer>
        {context => {
          return (
            <Route
              render={props =>
                // Is the user signed in?
                context.authenticatedUser ? (
                  // Yes, render requested page.
                  <OriginalComponent context={context} {...props} />
                ) : (
                  // No, redirect to signin.
                  <Redirect
                    to={{
                      pathname: `/signin`,
                      state: { from: location }
                    }}
                  />
                )
              }
            />
          );
        }}
      </Consumer>
    );
  };
}

export default PrivateRoute;
