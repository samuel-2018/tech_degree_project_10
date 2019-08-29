import React, { Component } from "react";
// Base URL
import config from "../config";

// PrivateRoute: Enables restricting page to signed-in users
// import { PrivateRoute, getFormData, sendRequest } from '../helpers';
import { getFormData } from "../helpers/getFormData";
import { sendRequest } from "../helpers/sendRequest";
import PrivateRoute from "../helpers/PrivateRoute";
import { validationErrors } from "../helpers/validationErrors";
import { handleError } from "../helpers/handleError";

class CreateCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      validationErrors: null
    };
  }

  onSubmit = event => {
    // prevents the page from re-loading
    event.preventDefault();

    // Pass form, returns form data as JSON
    const data = getFormData(event.target);

    // get authorization info from global
    const { username, password } = this.props.context.authenticatedUser;

    const url = `${config.apiBaseUrl}/courses`;

    sendRequest({ url, method: "POST", username, password, data })
      .then(() => {
        // back to main page
        this.props.history.push(`/courses`);
      })
      .catch(error => {
        const callerThis = this;
        handleError({ error, callerThis });
      });
  };

  createCourseJSX() {
    return (
      <div className="bounds course--detail">
        <h1>Create Course</h1>
        <div>
          {/* Displays validation errors */}
          {validationErrors(this.state.validationErrors)}
          <form onSubmit={this.onSubmit}>
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

              <button
                className="button button-secondary"
                onClick={this.onCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
    // }
  }

  onCancel = () => {
    // Redirects to main page
    this.props.history.push(`/courses`);
  };
  render() {
    return <>{this.createCourseJSX()}</>;
  }
}

// Wraps component in HOC,
// restricting page to signed-in users
export default PrivateRoute(CreateCourse);
