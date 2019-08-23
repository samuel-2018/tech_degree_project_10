import React, {Component} from "react";
import Header from "./Header";
import axios from "axios";
import { Link } from 'react-router-dom'
// Enables access to global state
import { Consumer } from '../App.js';

import { sendRequest } from './helpers';

class CourseDetail extends Component {
  constructor() {
    super();
    this.state = {
      course: null
    };
    this.deleteCourse = this.deleteCourse.bind(this);
  }

  componentDidMount() {
    // Get course ID #
    const id = this.props.id;

    const url = `http://localhost:5000/api/courses/${id}`;

    sendRequest({ url, method: 'GET' })
      .then((result) => {
        // store data in state
        this.setState({
          course: result.data,
        })
      })
  }

  deleteCourse() {
     // Get course ID #
    const id = this.props.id;
    // get authorization info from global
    const { user:{emailAddress:username}, password} = this.state.context;

    const url = `http://localhost:5000/api/courses/${id}`;

    sendRequest({url, method:'DELETE', username, password})
      .then(() => {
              // TO DO redirect to main page
              // or confirmation message and link to main page?
              
              // back to main page
              this.props.history.push(`/courses`);         
      })

}
  actionsBarJSX() {
    // Is the course loaded?
    // (The course id is needed for the 'update' button.)
    if (this.state.course) {
      const { location } = this.props;

        // get authorization info from context
      const { user:{id:userId}, authenticatedUser} = this.state.context;
      
      const {id, userId:courseOwnerId} = this.state.course;

      return (
        <div className="actions--bar">
          <div className="bounds">
            <div className="grid-100">
                {(authenticatedUser && userId === courseOwnerId) &&
                  <span>
                    <Link
                    to={{
                      pathname: `/courses/${id}/update`,
                      state: { from: location }
                    }}
                  className="button" >Update Course
                    </Link>
                    <Link
                    to={{
                      pathname: `#`,
                      state: { from: location }
                    }}
                  className="button" onClick={this.deleteCourse}>Delete Course
                    </Link>
                  </span>
               }
             <Link
              to={{
                pathname: `/courses`,
                state: { from: location }
              }}
             className="button button-secondary" >Return to
                List
              </Link>
            </div>
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
              <p>By {userId}</p>
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
        <Consumer>
          {context => {
            // Raises context variable
            // Immediately as soon as course is loaded in state
            // (Saving it as an instance varible can case a delay in it being available.)
            this.state.context = context;
            this.text = "some value";
          }}
        </Consumer>

        {this.actionsBarJSX()}
         
        {this.courseDetailJSX()}
        
      </>
      
    );
}

}
export default CourseDetail;