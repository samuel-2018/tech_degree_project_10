import React, { Component } from "react";
import Header from "./Header";
import axios from "axios";
import { Link } from "react-router-dom";
// Base URL
import config from "../config";

// For wrapping on export, provides context
import { withContext } from "../helpers/context";

import { validationErrors } from "../helpers/validationErrors";
import { handleError } from "../helpers/handleError";

class UserSignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validationErrors: null
    };
  }

  onSubmit = event => {
    // prevents the page from re-loading
    event.preventDefault();

    // Hides password mismatch message
    document
      .querySelector("#confirm-password__error-msg")
      .classList.add("hide");

    // Sends form to sign up
    this.props.context
      .onSignUp(event.target)
      .then(() => {
        this.props.history.push(this.props.location.state.from.pathname);
      })
      .catch(error => {
        // Client-side validation
        // Password doesn't match confirm password
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
        const callerThis = this;
        handleError({ error, callerThis });
      });
  };
  onCancel = () => {
    // Redirects to main page
    // Note: In the router file, passing 'props' is necessary so this file has access to history.
    this.props.history.push(`/courses`);
  };
  render() {
    const { location, context } = this.props;

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

              <div class="grid-100 pad-bottom">
                <button class="button" type="submit">
                  Sign Up
                </button>
                <button class="button button-secondary" onClick={this.onCancel}>
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

// Wrapper provides context
export default withContext(UserSignUp);
