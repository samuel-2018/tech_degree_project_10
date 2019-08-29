import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
// Base URL
import config from "../config";

// PrivateRoute: Enables restricting page to signed-in users
// import { PrivateRoute, getFormData, sendRequest } from '../helpers';
import { getFormData } from "../helpers/getFormData";
import { sendRequest } from "../helpers/sendRequest";
import PrivateRoute from "../helpers/PrivateRoute";
import { validationErrors } from "../helpers/validationErrors";
import { handleError } from "../helpers/handleError";

class UpdateCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      course: null,

      validationErrors: null
    };
  }

  componentDidMount() {
    // Get course ID #
    const id = this.props.match.params.id;

    // Get course from api
    axios
      .get(`http://localhost:5000/api/courses/${id}`)
      .then(result => {
        // store data in state
        this.setState({
          course: result.data
        });
      })
      .catch(error => {
        const callerThis = this;
        handleError({ error, callerThis });
      });
  }

  componentDidUpdate() {}

  render() {
    const { context } = this.props;
    const onSubmit = event => {
      // prevents the page from re-loading
      event.preventDefault();

      // Pass form, returns form data as JSON
      const data = getFormData(event.target);

      // Get course ID #
      const id = this.props.match.params.id;

      // get authorization info from global
      const { username, password } = this.props.context.authenticatedUser;

      const url = `${config.apiBaseUrl}/courses/${id}`;

      sendRequest({ url, method: "PUT", username, password, data })
        .then(() => {
          // back to main page
          this.props.history.push(`/courses`);
        })
        .catch(error => {
          const callerThis = this;
          handleError({ error, callerThis });
        });
    };

    const updateCourseJSX = () => {
      if (this.state.course && context.user) {
        // get authorization info from context
        const { authenticatedUser } = context;
        const currentUserId = context.user.id;

        // get course info from state
        const courseOwnerId = this.state.course.userId;
        const {
          title,
          description,
          estimatedTime,
          materialsNeeded,
          User
        } = this.state.course;
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
      this.props.history.push(`/courses`);
    };

    return <>{updateCourseJSX()}</>;
  }
}

// Wraps component in HOC,
// restricting page to signed-in users
// Wrapper provides context
export default PrivateRoute(UpdateCourse);
