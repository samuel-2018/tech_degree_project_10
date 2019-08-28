import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { handleError } from "../helpers/handleError";

class Courses extends Component {
  constructor() {
    super();
    this.state = {
      courses: []
    };
  }

  componentDidMount() {
    // Get courses from api
    axios
      .get("http://localhost:5000/api/courses")
      .then(result => {
        // store data in state
        this.setState({
          courses: result.data
        });
      })
      .catch(error => {
        const callerThis = this;
        handleError({ error, callerThis });
      });
  }

  render() {
    const { location } = this.props;

    let coursesJSX = "";

    // Got courses data?
    if (this.state.courses) {
      // Turns course data into array of JSX
      coursesJSX = this.state.courses.map((course, index) => {
        return (
          <div className="grid-33" key={index}>
            <Link
              to={{
                pathname: `/courses/${course.id}`,
                state: { from: location }
              }}
              className="course--module course--link"
            >
              <h4 className="course--label">Course</h4>
              <h3 className="course--title">{course.title}</h3>
            </Link>
          </div>
        );
      });
    }

    // builds a create new course button/box
    const newCourseJSX = (
      <div className="grid-33">
        <Link
          to={{
            pathname: `/courses/create`,
            state: { from: location }
          }}
          className="course--module course--add--module"
        >
          <h3 className="course--add--title">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 13 13"
              className="add"
            >
              <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
            </svg>
            New Course
          </h3>
        </Link>
      </div>
    );

    return (
      <>
        <div className="bounds">
          {/* Renders the courses */}
          {coursesJSX}
          {newCourseJSX}
        </div>
      </>
    );
  }
}

export default Courses;
