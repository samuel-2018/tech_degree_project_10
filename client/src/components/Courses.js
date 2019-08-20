
import React, {Component} from "react";

// import CourseDetail from "./CourseDetail";
// import CreateCourse from "./CreateCourse";
import axios from "axios";


class Courses extends Component {
  constructor() {
    super();
    this.state = {
    courses: []
  }
  }
  
  componentDidMount() {
    // Get courses from api
    axios.get("http://localhost:5000/api/courses")
      .then((result) => {
        // console.log(result);
        // store data in state
      this.setState({
        courses: result.data,
      })
  }).catch((error) => {
        console.log(error);
      })
}

  
  
  
  render() {
    console.log(this.props);
    
    

     let coursesJSX = '';
    // const { } = this.props;

    // Got courses data?
    if (this.state.courses) {
      // Turns course data into array of JSX
      coursesJSX = this.state.courses.map((course, index) => {
        return (
          <div className="grid-33" key={index}>
            <a className="course--module course--link" href={`/courses/${course.id}`}>
              <h4 className="course--label">Course</h4>
              <h3 className="course--title">{course.title}</h3>
            </a>
          </div>)
      })
    } 

    // builds a create new course button/box
    const newCourseJSX = (
       <div className="grid-33"><a className="course--module course--add--module" href="/courses/create">
            <h3 className="course--add--title"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                viewBox="0 0 13 13" className="add">
                <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
              </svg>New Course</h3>
          </a></div>
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