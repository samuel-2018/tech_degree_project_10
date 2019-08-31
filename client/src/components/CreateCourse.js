import React, { Component } from "react";
// Base URL: config.apiBaseUrl
import config from "../config";
// Helper functions
import { getFormData } from "../helpers/getFormData";
import { sendRequest } from "../helpers/sendRequest";
import { validationErrors } from "../helpers/validationErrors";
import { handleError } from "../helpers/handleError";
// Enables restricting page to signed-in users
import PrivateRoute from "../helpers/PrivateRoute";

class CreateCourse extends Component {
  constructor() {
    super();
    this.state = {
      validationErrors: null
    };
  }

  render() {
    // Submits form, creating new course.
    const onSubmit = event => {
      // Prevents the page from re-loading.
      event.preventDefault();

      // Passes form, returns form data as JSON.
      const data = getFormData(event.target);

      // Gets authentication info.
      const { username, password } = this.props.context.authenticatedUser;

      const url = `${config.apiBaseUrl}/courses`;

      // Sends API request.
      sendRequest({ url, method: "POST", username, password, data })
        .then(() => {
          // Back to main page
          this.props.history.push(`/courses`);
        })
        .catch(error => {
          // If the error is a validation error,
          // then this helper function will add
          // the validation errors to state.

          // For all other errors, it will use
          // history to redirect to an error page.

          handleError({ error, callerThis: this });
        });
    };

    const createCourseJSX = () => {
      return (
        <div className="bounds course--detail">
          <h1>Create Course</h1>
          <div>
            {/* Displays validation errors */}
            {validationErrors(this.state.validationErrors)}
            <form onSubmit={onSubmit}>
              <div className="grid-66">
                <div className="course--header">
                  <h4 className="course--label">Course</h4>
                  <div>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      className="input-title course--title--input"
                      placeholder="Course title..."
                    />
                  </div>
                  {/* The course is by the current user. */}
                  <p>
                    {!!this.props.context.user
                      ? `By ${this.props.context.user.firstName} ${this.props.context.user.lastName} `
                      : ""}
                  </p>
                </div>
                <div className="course--description">
                  <div>
                    <textarea
                      id="description"
                      name="description"
                      className=""
                      placeholder="Course description..."
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="grid-25 grid-right">
                <div className="course--stats">
                  <ul className="course--stats--list">
                    <li className="course--stats--list--item">
                      <h4>Estimated Time</h4>
                      <div>
                        <input
                          id="estimatedTime"
                          name="estimatedTime"
                          type="text"
                          className="course--time--input"
                          placeholder="Hours"
                        />
                      </div>
                    </li>
                    <li className="course--stats--list--item">
                      <h4>Materials Needed</h4>
                      <div>
                        <textarea
                          id="materialsNeeded"
                          name="materialsNeeded"
                          className=""
                          placeholder="List materials..."
                        ></textarea>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="grid-100 pad-bottom">
                <button className="button" type="submit">
                  Create Course
                </button>
                <button className="button button-secondary" onClick={onCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    };

    const onCancel = () => {
      // Redirects to main page
      this.props.history.push(`/courses`);
    };

    return <>{createCourseJSX()}</>;
  }
}

// Wraps component in HOC,
// restricting page to signed-in users.
// Wrapper provides context.
export default PrivateRoute(CreateCourse);
