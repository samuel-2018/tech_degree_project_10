import React from "react";
import { Redirect } from "react-router-dom";

// NOTE: In development mode, the custom error page will only briefly show before going to the normal error page. Check the address bar to see which page would be rendered in production.

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, code: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      console.log("ErrorBoundry; Code: ", this.state.code);
      return <Redirect to="/error" />;
    }
    // renders the child components
    return this.props.children;
  }
}
