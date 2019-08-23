

// wrap UpdateCourse and CreateCourse

// The wrapper will have a switch
// If auth, then render
// if not, redirect to sign in

// because of auth check, needs access to auth
// auth is simply the bool stored in app.js state

// how does helpers get auth?
// header gets it from subscribing to context

// Enables access to global state
import { Consumer } from '../App.js';


import React, { Component } from "react";
import { Route, Redirect } from 'react-router-dom';
import axios from "axios";

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
            context.authenticatedUser ?
              // Yes, render requested page.
              <OriginalComponent {...context} {...this.props} /> :
              // No, redirect to signin.
              <Redirect to={{
                pathname: `/signin`,
                state: { from: location }
              }}/>
          )
        }}
      </Consumer>
    );
  }
}
}


function getFormData(form) {
    // Formats data as "multipart/form-data"
    const data = new FormData(form);
    // Converts to JSON
  const dataJSON = JSON.stringify(Object.fromEntries(data));
  return dataJSON;
}

// AXIOS: https://github.com/axios/axios

// SEND API REQUEST
function sendRequest({url, method, username, password, data}) {

  // Prepares request info
  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  };

  // Sets Authorization (Axios uses basic auth)
  if (username && password) {
    options.auth = {
      username,
      password
    }
  }

  // Adds data
  if (data) {
    options.data = data
  }

  // Sends request to API
  // returns promise to caller
  return axios(url, options)
    .catch((error) => {
      console.log(error);
    })
}


export { PrivateRoute };
export { getFormData };
export { sendRequest };





