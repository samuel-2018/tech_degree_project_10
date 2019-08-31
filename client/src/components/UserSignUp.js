import React, { Component } from "react";
import { Link } from "react-router-dom";
// For wrapping on export, provides context.
import { withContext } from "../helpers/context";
// Helper functions
import { validationErrors } from "../helpers/validationErrors";
import { handleError } from "../helpers/handleError";

class UserSignUp extends Component {
  constructor() {
    super();
    this.state = {
      validationErrors: null
    };
  }

  onSubmit = event => {
    // Prevents the page from re-loading.
    event.preventDefault();

    // Hides password mismatch message.
    document
      .querySelector("#confirm-password__error-msg")
      .classList.add("hide");

    // Sends form to sign up.
    this.props.context
      // Sends new user info to API.
      // Gets user info from API, stores user info, sets cookie.
      .onSignUp(event.target)
      .then(() => {
        // Upon successful account creation and login, goes to previous page.
        this.props.history.push(this.props.location.state.from.pathname);
      })
      .catch(error => {
        // Client-side validation.
        // Does the password match the confirm password?
        if (error === "passwordMismatch") {
          console.log("passwordMismatch");
          document
            .querySelector("#confirm-password__error-msg")
            .classList.remove("hide");
        } else {
          throw error;
        }
      })
      .catch(error => {
        // If the error is a server-side validation error,
        // then this helper function will add
        // the validation errors to state.

        // For all other errors, it will use
        // history to redirect to an error page.

        handleError({ error, callerThis: this });
      });
  };
  onCancel = () => {
    // Redirects to main page.
    this.props.history.push(`/courses`);
  };
  render() {
    const { location } = this.props;

    return (
      <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign Up</h1>
          {/* Displays validation errors */}
          {validationErrors(this.state.validationErrors)}
          <div>
            <form onSubmit={this.onSubmit}>
              <div>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  className=""
                  placeholder="First Name"
                />
              </div>
              <div>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className=""
                  placeholder="Last Name"
                />
              </div>
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

              <div id="confirm-password">
                <input
                  id="confirm-password__input"
                  name="confirmPassword"
                  type="password"
                  className=""
                  placeholder="Confirm Password"
                />
                <div
                  id="confirm-password__error-msg"
                  className="error-msg hide"
                >
                  Passwords must match.
                </div>
              </div>

              <div className="grid-100 pad-bottom">
                <button className="button" type="submit">
                  Sign Up
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
            Already have a user account? Click here to{" "}
            <span>
              <Link
                to={{
                  pathname: `/signin`,
                  state: { from: location }
                }}
                className="signin"
              >
                sign in!
              </Link>
            </span>
          </p>
        </div>
      </div>
    );
  }
}

// Wrapper provides context.
export default withContext(UserSignUp);
