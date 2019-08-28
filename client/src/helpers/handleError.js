export const handleError = ({ error, callerThis }) => {
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
};
