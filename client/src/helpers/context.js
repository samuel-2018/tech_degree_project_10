import React, { Component } from "react";
import Cookies from "js-cookie";
import { Redirect } from "react-router-dom";
// Helper functions
import { sendRequest } from "./sendRequest";
import { getFormData } from "./getFormData";
import { handleError } from "../helpers/handleError";
// Base URL: config.apiBaseUrl
import config from "../config";
// Context: Has the properties 'Provider' and 'Consumer'
const Context = React.createContext();

class Provider extends Component {
  // Note: Provider does not have access to location or history.
  constructor(props) {
    super(props);
    this.state = {
      // Stores username(email) and password.
      authenticatedUser: Cookies.getJSON("authenticatedUser") || null,
      // Stores user info: id, firstName, lastName, and emailAddress.
      // (Must default to 'null' for value checking elsewhere.)
      user: null
    };
  }

  onSignIn = ({ username, password }) => {
    const url = `${config.apiBaseUrl}/users`;

    // Sends login to API.
    return sendRequest({ url, method: "GET", username, password }).then(
      response => {
        // Gets user info.
        const user = response.data.user;
        // Calls fn to store user info.
        this.setUser({ user });
        // Calls fn for authentication.
        this.setCookies({ username, password });
      }
    ); // Caller handles errors.
  };

  onSignOut = () => {
    // Removes authentication cookie.
    Cookies.remove("authenticatedUser");
    // Clears authentication and user info from state.
    this.setState({ authenticatedUser: null, user: null });
    // Goes to main page
    // ('Redirect' has to be returned to render.)
    return <Redirect push to="/courses" />;
  };

  onSignUp = form => {
    // Passes form, returns form data as JSON string.
    // (In format the API needs.)
    const data = getFormData(form);

    // JavaScript object (needed to access properties).
    const newAccountData = JSON.parse(data);

    const username = newAccountData.emailAddress;
    const password = newAccountData.password;
    const confirmPassword = newAccountData.confirmPassword;

    // Client-side validation.
    // Does the password match the confirm password?
    if (password === confirmPassword) {
      const url = `${config.apiBaseUrl}/users`;

      // Sends new user info to API.
      return sendRequest({ url, method: "POST", data }).then(() => {
        // Gets user info from API, stores user info, sets cookie.
        this.onSignIn({ username, password });
      }); // Caller handles errors.
    } else {
      // User sign in page will display error message.
      return Promise.reject("passwordMismatch");
    }
  };

  getUser() {
    // Gets current signed in user (from cookie).
    const authenticatedUser = Cookies.getJSON("authenticatedUser");
    // Is user authenticated?
    if (authenticatedUser) {
      const username = authenticatedUser.username;
      const password = authenticatedUser.password;
      // Is there a username and password?
      if (username && password) {
        const url = `${config.apiBaseUrl}/users`;

        // Note: Since this is a promise,
        // it must be return to the caller.
        // (And the data must also later be returned.)

        return sendRequest({ url, method: "GET", username, password }).then(
          result => {
            return result.data.user;
          }
        ); // Caller handles errors.
      } else {
        // Username and password not found, return 'null'.
        // (Caller is expecting a promise.)
        return Promise.resolve(null);
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

    // Sets cookie for authentication.
    Cookies.set("authenticatedUser", { username, password }, { expires: 1 });
    // Adds authentication info to state.
    this.setState({
      authenticatedUser: { username, password }
    });
  }

  componentDidMount() {
    // Gets user authentication from cookie, adds user to state.
    this.getUser()
      .then(user => {
        // If there is no cookie or the cookie does not have
        // a username and password, 'null' will be returned
        // as the user value.
        this.setUser({ user });
      })
      .catch(error => {
        // Uses history to redirect to an error page.
        // (Could return a 401 error if no user match is found by API.)
        handleError({ error, callerThis: this });
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
        {/* For elements to access the values/props in 'Context', they will still need to be wrapped in the 'Consumer'. This can be done the normal way in each file by adding a 'Consumer' element with a function that receives and then makes available 'context'. Or, a HOC can be used. A HOC would set 'context' as a static variable available throughout the component. If using the HOC, the component can be wrapped in the file with the routes or wrapped on export. (Wrapping on export might make it easier to reuse code; shows the dependency in the component file.)*/}
      </Context.Provider>
    );
  }
}

function withContext(OriginalComponent) {
  return function(props) {
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
