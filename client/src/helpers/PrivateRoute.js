// Enables access to global state
import { Consumer } from "./context";

import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";

// HOC
function PrivateRoute(OriginalComponent) {
  return class extends Component {
    // constructor() {
    //   super();
    //   this.state = {

    //   };

    // }
    render() {
      const { location } = this.props;
      return (
        <Consumer>
          {context => {
            return (
              // Is the user signed in?
              context.authenticatedUser ? (
                // Yes, render requested page.

                // TO DO  Should this be  "context={context}"? YES CHANGED

                <OriginalComponent context={context} {...this.props} />
              ) : (
                // No, redirect to signin.
                <Redirect
                  to={{
                    pathname: `/signin`,
                    state: { from: location }
                  }}
                />
              )
            );
          }}
        </Consumer>
      );
    }
  };
}

export { PrivateRoute };
