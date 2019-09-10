import React, { Component } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
// For wrapping on export, provides context
import { withContext } from "../helpers/context";
// Helper functions
import { sendRequest } from "../helpers/sendRequest";
import { handleError } from "../helpers/handleError";
// Base URL: config.apiBaseUrl
import config from "../config";

class CourseDetail extends Component {
  constructor() {
    super();
    this.state = {
      course: null
    };
  }

  componentDidMount() {
    // Calls API, updates state with course data.
    // (Updating state must be done outside of render.)
    (() => {
      const courseId = this.props.match.params.id;

      const url = `${config.apiBaseUrl}/courses/${courseId}`;

      sendRequest({ url, method: "GET" })
        .then(result => {
          // Stores data in state.
          this.setState({
            course: result.data
          });
        })
        .catch(error => {
          handleError({ error, callerThis: this });
        });
    })();
  }

  render() {
    // Note: Content that relies on state being updated needs to be inside of render. Info in 'context' is sometimes updated. If the user is already signed in but refreshes this page, context will make an api call (using info from cookie) to get user info (including first and last name). The page needs updated with this info.

    // Provides access to global.
    const { context } = this.props;

    const courseId = this.props.match.params.id;

    const deleteCourse = () => {
      // Gets authorization info.
      const { username, password } = context.authenticatedUser;

      const url = `http://localhost:5000/api/courses/${courseId}`;

      sendRequest({ url, method: "DELETE", username, password })
        .then(() => {
          // TO DO Add confirmation message.

          // Back to main page
          this.props.history.push(`/courses`);
        })
        .catch(error => {
          // Uses history to redirect to an error page.
          handleError({ error, callerThis: this });
        });
    };

    const actionsBarJSX = () => {
      // These variables must be intialized
      // here to provide proper scope.
      let authenticatedUser = null,
        currentUserId = null,
        courseOwnerId = null;

      // Note: "this.state.course" and "context.user"
      // must be ready in order to get the id of
      // the course owner and the current user.
      if (this.state.course && context.user) {
        authenticatedUser = context.authenticatedUser;
        currentUserId = context.user.id;
        courseOwnerId = this.state.course.userId;
      }

      const { location } = this.props;

      return (
        <div className="actions--bar">
          <div className="bounds">
            <div className="grid-100">
              {/* Is user authenticated? */}
              {authenticatedUser &&
                // Is the current user the course owner?
                (currentUserId === courseOwnerId && (
                  // Yes, display 'Update' and 'Delete' buttons.
                  <>
                    <Link
                      to={{
                        pathname: `/courses/${courseId}/update`,
                        state: { from: location }
                      }}
                      className="button"
                    >
                      Update Course
                    </Link>
                    <Link
                      to={{
                        pathname: `#`,
                        state: { from: location }
                      }}
                      className="button"
                      onClick={deleteCourse}
                    >
                      Delete Course
                    </Link>
                  </>
                ))}
              {/* Display "Return to List" button for all users. */}
              <Link
                to={{
                  pathname: `/courses`,
                  state: { from: location }
                }}
                className="button button-secondary"
              >
                Return to List
              </Link>
            </div>
          </div>
        </div>
      );
    };

    const courseDetailJSX = () => {
      // Is the course ready?
      if (this.state.course) {
        // Yes, display course.

        // Gets course data.
        const {
          title,
          description,
          estimatedTime,
          materialsNeeded,
          User
        } = this.state.course;

        // Gets course owner's name.
        const courseOwnerName = `${User.firstName} ${User.lastName}`;

        // Returns course JSX.
        return (
          <div className="bounds course--detail">
            <div className="grid-66">
              <div className="course--header">
                <h4 className="course--label">Course</h4>
                <h3 className="course--title">{title}</h3>
                <p>By {courseOwnerName}</p>
              </div>
              <div className="course--description">
                <ReactMarkdown source={description} />
              </div>
            </div>
            <div className="grid-25 grid-right">
              <div className="course--stats">
                <ul className="course--stats--list">
                  <li className="course--stats--list--item">
                    <h4>Estimated Time</h4>
                    <h3>{estimatedTime}</h3>
                  </li>
                  <li className="course--stats--list--item">
                    <h4>Materials Needed</h4>
                    <ul>
                      <ReactMarkdown source={materialsNeeded} />
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      }
      // No, display nothing.
    };

    return (
      <>
        {actionsBarJSX()}
        {courseDetailJSX()}
      </>
    );
  }
}

// Wrapper provides access to global functions and user data.
export default withContext(CourseDetail);
