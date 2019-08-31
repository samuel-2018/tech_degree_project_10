import React, { Component } from "react";
// For wrapping on export, provides context.
import { withContext } from "../helpers/context";
// Helper functions
import { getFormData } from "../helpers/getFormData";
import { handleError } from "../helpers/handleError";

class UserSignIn extends Component {
  onSubmit = event => {
    // Prevents the page from re-loading.
    event.preventDefault();

    // Passes form, returns form data as JSON string.
    const data = getFormData(event.target);

    // Creates JavaScript object (needed to access properties).
    const jsonObject = JSON.parse(data);
    const username = jsonObject.emailAddress;
    const password = jsonObject.password;

    this.props.context
      // Gets user info from API, stores user info, sets cookie.
      .onSignIn({ username, password })
      .then(() => {
        // Upon successful login, goes to previous page.
        this.props.history.push(this.props.location.state.from.pathname);
      })
      .catch(error => {
        // Uses history to redirect to an error page.
        handleError({ error, callerThis: this });
      });
  };

  signInJSX() {
    return (
      <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign In</h1>
          <div>
            <form onSubmit={this.onSubmit}>
              <div>
                <input
                  id="emailAddress"
                  name="emailAddress"
                  type="text"
                  className=""
                  placeholder="Email Address"
                />
              </div>
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className=""
                  placeholder="Password"
                />
              </div>
              <div className="grid-100 pad-bottom">
                <button className="button" type="submit">
                  Sign In
                </button>
                <button
                  className="button button-secondary"
                  onClick={this.onCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
          <p>&nbsp;</p>
          <p>
            Don't have a user account? <a onClick={this.goSignUp}>Click here</a>{" "}
            to sign up!
          </p>
        </div>
      </div>
    );
  }

  onCancel = () => {
    // Redirects to main page
    this.props.history.push(`/courses`);
  };

  goSignUp = () => {
    this.props.history.push(`/signup`);
  };

  render() {
    return <>{this.signInJSX()}</>;
  }
}

// Wrapper provides context
export default withContext(UserSignIn);
