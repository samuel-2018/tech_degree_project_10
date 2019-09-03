import React, { Component } from "react";
import { Redirect } from "react-router-dom";
// Base URL: config.apiBaseUrl
import config from "../config";
// Helper functions
import { getFormData } from "../helpers/getFormData";
import { sendRequest } from "../helpers/sendRequest";
import { validationErrors } from "../helpers/validationErrors";
import { handleError } from "../helpers/handleError";
// Enables restricting page to signed-in users
import PrivateRoute from "../helpers/PrivateRoute";

class UpdateCourse extends Component {
  constructor() {
    super();
    this.state = {
      course: null,
      validationErrors: null
    };
  }

  componentDidMount() {
    // Calls API, updates state with course data.
    // (Updating state must be done outside of render.)
    (() => {
      // Gets course ID #
      const id = this.props.match.params.id;

      const url = `http://localhost:5000/api/courses/${id}`;

      // Sends API request.
      sendRequest({ url, method: "GET" })
        .then(result => {
          // Stores data in state.
          this.setState({
            course: result.data
          });
        })
        .catch(error => {
          // Uses history to redirect to an error page.
          handleError({ error, callerThis: this });
        });
    })();
  }

  render() {
    const { context } = this.props;

    // Gets course ID #.
    const id = this.props.match.params.id;

    const onSubmit = event => {
      // Prevents the page from re-loading.
      event.preventDefault();

      // Passes form, returns form data as JSON.
      const data = getFormData(event.target);

      // Gets authentication info.
      const { username, password } = context.authenticatedUser;

      const url = `${config.apiBaseUrl}/courses/${id}`;

      // Sends API request.
      sendRequest({ url, method: "PUT", username, password, data })
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

    const updateCourseJSX = () => {
      // Is the course ready? Is the user data ready?
      if (this.state.course && context.user) {
        // Gets authentication info.
        const { authenticatedUser } = context;

        // Gets current user id.
        const currentUserId = context.user.id;

        // Gets course data.
        const courseOwnerId = this.state.course.userId;
        const {
          title,
          description,
          estimatedTime,
          materialsNeeded,
          User
        } = this.state.course;

        // Gets course owner's name.
        const courseOwnerName = `${User.firstName} ${User.lastName}`;

        // Does the current user own this course?
        if (!(authenticatedUser && currentUserId === courseOwnerId)) {
          //No, redirect. (Replaces current page in history.)
          return <Redirect to="/forbidden" />;
        } else {
          // Yes, render page.
          return (
            <div className="bounds course--detail">
              <h1>Update Course</h1>
              <div>
                {/* Displays validation errors */}
                {validationErrors(this.state.validationErrors)}
                <form onSubmit={onSubmit}>
                  <div className="grid-66">
                    <div className="course--header">
                      <h4 className="course--label">Course</h4>
                      <div>
                        {/* Note: React overrides native behaviour for updating the 'value' prop of input. Two solutions: Don't set 'value', instead use 'defaultValue'. Or, set the 'value' to a variable that is updated by an onChange handler.*/}
                        <input
                          id="title"
                          name="title"
                          type="text"
                          className="input-title course--title--input"
                          placeholder="Course title..."
                          defaultValue={title}
                        />
                      </div>
                      <p>By {courseOwnerName}</p>
                    </div>
                    <div className="course--description">
                      <div>
                        <textarea
                          id="description"
                          name="description"
                          className=""
                          placeholder="Course description..."
                          defaultValue={description}
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
                              defaultValue={estimatedTime}
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
                              defaultValue={materialsNeeded}
                            ></textarea>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="grid-100 pad-bottom">
                    <button className="button" type="submit">
                      Update Course
                    </button>
                    <button
                      className="button button-secondary"
                      onClick={onCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          );
        }
      }
    };

    const onCancel = () => {
      this.props.history.push(`/courses/${id}`);
    };

    return <>{updateCourseJSX()}</>;
  }
}

// Wraps component in HOC,
// restricting page to signed-in users.
// Wrapper provides context.
export default PrivateRoute(UpdateCourse);
