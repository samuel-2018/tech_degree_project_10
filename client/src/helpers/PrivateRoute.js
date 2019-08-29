// Enables access to global state
import { Consumer } from "./context";

import React from "react";
import { Route, Redirect } from "react-router-dom";

// HOC
function PrivateRoute(OriginalComponent) {
  return function(...props) {
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
                      state: { from: props.location }
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
