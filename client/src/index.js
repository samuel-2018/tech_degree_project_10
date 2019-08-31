import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "./helpers/context";
import { ErrorBoundary } from "./components/ErrorBoundary";

ReactDOM.render(
  <BrowserRouter>
    {/* "ErrorBoundary" catches some errors in child components
         and renders a fallback UI: "/error". */}
    <ErrorBoundary>
      {/* "Provider" allows global state. */}
      <Provider>
        <App />
      </Provider>
    </ErrorBoundary>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
