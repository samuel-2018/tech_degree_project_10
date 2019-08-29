export const handleError = ({ error, callerThis }) => {
  try {
    // Handling Errors, Axios API
    // https://github.com/axios/axios#handling-errors

    if (error.response) {
      // The request was made and the server responded with
      // a status code that falls out of the range of 2xx

      // Is it a validation error?
      if (error.response.data.name === "SequelizeValidationError") {
        // Adds an array of errors to state
        callerThis.setState({
          validationErrors: error.response.data.validationErrors
        });
      } else if (error.response.status === 404) {
        callerThis.props.history.replace(`/notfound`);
      } else if (error.response.status === 401) {
        callerThis.props.history.replace(`/forbidden`);
      } else {
        // Handles code 500
        callerThis.props.history.replace(`/error`);
      }
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest
      // in the browser and an instance of http.ClientRequest
      // in node.js

      callerThis.props.history.replace(`/error`);
    } else {
      // Something happened in setting up the request that triggered an Error

      callerThis.props.history.replace(`/error`);
    }
    callerThis.props.history.replace(`/error`);
  } catch (error) {
    // Handles errors created in the error handler
    window.location.pathname = "/error";
  }
};
