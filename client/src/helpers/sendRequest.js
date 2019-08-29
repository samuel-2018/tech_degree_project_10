import axios from "axios";

// AXIOS: https://github.com/axios/axios

// SEND API REQUEST
function sendRequest({ url, method, username, password, data }) {
  // Prepares request info
  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  };

  // Sets Authorization (Axios uses basic auth)
  if (username && password) {
    options.auth = {
      username,
      password
    };
  }

  // Adds data
  if (data) {
    options.data = data;
  }

  // Sends request to API
  // returns promise to caller
  return axios(url, options);
}

export { sendRequest };
