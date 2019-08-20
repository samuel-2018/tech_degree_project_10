import React, {Component} from "react";
import Header from "./Header";
import axios from "axios";
// import { Consumer } from '../App.js';

class CourseDetail extends Component {
  constructor() {
    super();
    this.state = {
      course: null
    };
    this.deleteCourse = this.deleteCourse.bind(this);
  }

  componentDidMount() {
    // console.log('test1', this.state);
    
    // Get course ID #
    const id = this.props.id;

    // Get course from api
    axios.get(`http://localhost:5000/api/courses/${id}`)
      .then((result) => {
        // console.log(result);
        // store data in state
        this.setState({
          course: result.data,
        })
      }).then(() => {
      console.log('test1',this.state);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  deleteCourse() {
     // Get course ID #
    const id = this.props.id;
         // Delete course from api
    axios.delete(`http://localhost:5000/api/courses/${id}`)
      .then(() => {
        // TO DO redirect to main page
        // or confirmation message and link to main page?
        
      }).catch((error) => {
        console.log(error);
      })
}
  actionsBarJSX() {
    if (this.state.course) {
      // console.log(this.state.course);
        
      const { id, title, description, estimatedTime, materialsNeeded, userId } = this.state.course;
      return (
        <div className="actions--bar">
          <div className="bounds">
            <div className="grid-100"><span><a className="button" href={`/course/${id}/update`}>Update Course</a><a className="button"
              href="#" onClick={this.deleteCourse}>Delete Course</a></span><a className="button button-secondary" href="/courses">Return to
                List</a></div>
          </div>
        </div>
      )
    }
  }

    courseDetailJSX() {
      if (this.state.course) {
           const { id, title, description, estimatedTime, materialsNeeded, userId } = this.state.course;
          // Creates an array of paragraphs (splits at hard return)
      const paragraphs = description.split(/&#13;/);

      // Creates an array of materials (splits at "*")
        const materials = materialsNeeded.split(/\*/);
        console.log('materials: ', materials);
        
        return (
          <div className="bounds course--detail">
          <div className="grid-66">
            <div className="course--header">
              <h4 className="course--label">Course</h4>
              <h3 className="course--title">{title}</h3>
              <p>By {id}</p>
            </div>
              <div className="course--description">
                {
                  // Converts the paragraphs array into JSX
                  paragraphs.map((paragraph, index) => {
                    return (<p key={index}>{paragraph}</p>)
                  })
                }
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
                      {
                        // // Converts the paragraphs array into JSX
                        materials.map((material, index) => {
                        return (<li key={index}>{material}</li>)
                        })
                     
                      }
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
        )
      }
    }

  render() {
    return (
      <>
     

        {this.actionsBarJSX()}
         
        {this.courseDetailJSX()}
        
      </>
      
    );
}

}
export default CourseDetail;