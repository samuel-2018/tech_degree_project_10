import React, { Component } from "react";

import axios from "axios";
import Cookies from "js-cookie";

import { Redirect } from "react-router-dom";

import { sendRequest } from "./sendRequest";
import { getFormData } from "./getFormData";

// Base URL
import config from "../config";

// Context: Has the properties 'Provider' and 'Consumer'
const Context = React.createContext();

class Provider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // store username(email) and password
      authenticatedUser: Cookies.getJSON("authenticatedUser") || null,
      // Store user info
      // (Must default to 'null' for value checking elsewhere.)
      user: null
    };
  }

  onSignIn = ({ username, emailAddress, password }) => {
    // TO DO should only need username and password?

    // If username not sent, will set emailAddress as username
    username = username ? username : emailAddress;

    const url = `${config.apiBaseUrl}/users`;

    // Sends login to API
    return sendRequest({ url, method: "GET", username, password }).then(
      response => {
        const user = response.data.user;
        // Calls fn to store user info
        this.setUser({ user });
        // Calls fn for authentication
        this.setCookies({ username, password });
      }
    );
    // .then(() => {
    //   // Note: Provider does not have access to location, so can't handle some redirects.

    //   // return to caller
    //   return;
    //   // // ('Redirect' has to be returned to render.)
    //   // return <Redirect push to={this.props.location.state.from.pathname} />;
    // });
  };

  onSignOut = () => {
    // Removes authentication cookie
    Cookies.remove("authenticatedUser");
    // Clears authentication and user info from state
    this.setState({ authenticatedUser: null, user: null });

    // Goes to main page
    // ('Redirect' has to be returned to render.)
    return <Redirect push to="/courses" />;
  };

  onSignUp = form => {
    // Pass form, returns form data as JSON string
    // (In format the API needs)
    const data = getFormData(form);

    // JavaScript object (needed to access properties)
    const newAccountData = JSON.parse(data);

    const username = newAccountData.emailAddress;
    const password = newAccountData.password;
    const confirmPassword = newAccountData.confirmPassword;

    if (password === confirmPassword) {
      const url = `${config.apiBaseUrl}/users`;

      // Sends new user info to API
      return sendRequest({ url, method: "POST", data }).then(() => {
        console.log("Success! Account created.");
        this.onSignIn({ username, password });
      });
    } else {
      return Promise.reject("passwordMismatch");
    }
  };

  // Gets current signed in user (from cookie)
  getUser() {
    const authenticatedUser = Cookies.getJSON("authenticatedUser");
    if (authenticatedUser) {
      const username = authenticatedUser.username;

      const password = authenticatedUser.password;

      if (username && password) {
        const url = `${config.apiBaseUrl}/users`;
        // Get user: id, firstName, lastName, emailAddress
        // Note: Since this is a promise,
        // it must be return to the caller.
        // (And the data must also later be returned.)
        return sendRequest({ url, method: "GET", username, password }).then(
          result => {
            return result.data.user;
          }
        );
      }
    } else {
      // No authentication cookie found, return 'null'.
      // (Caller is expecting a promise.)
      return Promise.resolve(null);
    }
  }

  setUser({ user }) {
    // Stores user: id, firstName, lastName, emailAddress
    this.setState({ user });
  }

  setCookies({ username, password }) {
    // JavaScript Cookie: https://github.com/js-cookie/js-cookie

    // Sets cookie for authentication
    Cookies.set("authenticatedUser", { username, password }, { expires: 1 });
    // Adds authentication info to state
    this.setState({
      authenticatedUser: { username, password }
    });
  }

  componentDidMount() {
    console.log("*****App.js, componentDidMount******");

    // Gets user authentication from cookie, adds user to state
    this.getUser().then(user => {
      this.setUser({ user });
    });
  }

  render() {
    return (
      // 'Provider' is a property of 'Context'.
      <Context.Provider
        value={{
          ...this.state,
          onSignIn: this.onSignIn,
          onSignOut: this.onSignOut,
          onSignUp: this.onSignUp
        }}
      >
        {/* Any elements between original 'Provider' tags will be rendered. Once 'Provider' has been exported, elements nested between the imported 'Provider' tags will become props of 'Provider'. Specifically, the elements will be in "this.props.children".     Inserting those props here will cause any nested elements to be rendered. */}
        {this.props.children}
        {/* For elements to access the values/props in 'Context', they will still need to be wrapped in the 'Consumer'. This can be done the normal way in each file by adding a 'Consumer' element with a function that receives and then makes available 'context'. Or, a HOC can be used. A HOC would set 'context' as a static variable available throughout the component. If using the HOC, the component can be wrapped in the file with the routes or wrapped on export. (Wrapping on export might make it easier to reuse code. Shows dependency.)*/}
      </Context.Provider>
    );
  }
}

function withContext(OriginalComponent) {
  return function ContextComponent(props) {
    // TO DO may need wrapped in a function, takes in props, and then spreads them in below component. DONE
    // And, why does this make it work?
    return (
      <Context.Consumer>
        {context => <OriginalComponent {...props} context={context} />}
      </Context.Consumer>
    );
  };
}

export { withContext };

export { Provider };

export const Consumer = Context.Consumer;
