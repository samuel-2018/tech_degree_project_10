import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Header from "./Header";
import axios from "axios";
import { Link } from "react-router-dom";

// For wrapping on export, provides context
import { withContext } from "../helpers/context";

import { sendRequest } from "../helpers/sendRequest";
import { handleError } from "../helpers/handleError";

class CourseDetail extends Component {
  // Passing 'props' to constructor and super allows access to props. (Otherwise, only available in render via "this.props".)
  constructor(props) {
    super(props);
    this.state = {
      course: null
    };
  }

  componentDidMount() {
    // Get course ID #
    const id = this.props.id;

    const url = `http://localhost:5000/api/courses/${id}`;

    sendRequest({ url, method: "GET" })
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

  render() {
    // Note: Content that relies on state being updated needs to be inside of render. Info in 'context' is sometimes updated. If the user is already signed in but refreshes this page, context will make an api call (using info from cookie) to get user info (including first and last name). The page needs updated with this info.

    const { context } = this.props;
    const deleteCourse = () => {
      // Get course ID #
      const id = this.props.id;
      // get authorization info from global
      const { username, password } = context.authenticatedUser;

      const url = `http://localhost:5000/api/courses/${id}`;

      sendRequest({ url, method: "DELETE", username, password })
        .then(() => {
          // TO DO redirect to main page
          // or confirmation message and link to main page?

          // back to main page
          this.props.history.push(`/courses`);
        })
        .catch(error => {
          const callerThis = this;
          handleError({ error, callerThis });
        });
    };

    const actionsBarJSX = () => {
      // (The course id is needed for the 'update' button.)
      if (this.state.course && context.user) {
        const { location } = this.props;

        // get authorization info from context
        const {
          user: { id: userId },
          authenticatedUser
        } = context;

        const { id, userId: courseOwnerId } = this.state.course;

        return (
          <div className="actions--bar">
            <div className="bounds">
              <div className="grid-100">
                {authenticatedUser && userId === courseOwnerId && (
                  <span>
                    <Link
                      to={{
                        pathname: `/courses/${id}/update`,
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
                  </span>
                )}
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
      }
    };

    const courseDetailJSX = () => {
      if (this.state.course) {
        const {
          id,
          title,
          description,
          estimatedTime,
          materialsNeeded,
          userId
        } = this.state.course;
        // Creates an array of paragraphs (splits at hard return)
        const paragraphs = description.split(/&#13;/);

        // Creates an array of materials (splits at "*")
        const materials = materialsNeeded.split(/\*/);
        console.log("materials: ", materials);

        return (
          <div className="bounds course--detail">
            <div className="grid-66">
              <div className="course--header">
                <h4 className="course--label">Course</h4>
                <h3 className="course--title">{title}</h3>
                <p>By {userId}</p>
              </div>
              <div className="course--description">
                {// Converts the paragraphs array into JSX
                paragraphs.map((paragraph, index) => {
                  return <p key={index}>{paragraph}</p>;
                })}
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
                      {// // Converts the paragraphs array into JSX
                      materials.map((material, index) => {
                        return <li key={index}>{material}</li>;
                      })}
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      }
    };

    return (
      <>
        {actionsBarJSX()}

        {courseDetailJSX()}
      </>
    );
  }
}

// Wrapper provides context
export default withContext(CourseDetail);
