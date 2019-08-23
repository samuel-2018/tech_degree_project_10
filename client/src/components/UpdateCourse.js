import React, {Component} from "react";
import Header from "./Header";
import axios from "axios";
// Base URL
import config from '../config';

// Enables access to global state
import { Consumer } from '../App.js';

// PrivateRoute: Enables restricting page to signed-in users
import { PrivateRoute, getFormData, sendRequest } from './helpers';


class UpdateCourse extends Component {
  constructor() {
    super();
      this.state = {
        course: null,
        submitListenerAdded: false,
    };
    this.context = null;
  }

componentDidMount() {
    // Get course ID #
    const id = this.props.id;

    // Get course from api
    axios.get(`http://localhost:5000/api/courses/${id}`)
      .then((result) => {
        // store data in state
        this.setState({
          course: result.data,
        })
      })
      .catch((error) => {
        console.log(error);
      })
  }

  // TO DO change how the timing is handled.
  // the current way assumes everything will be ready
  // in just one lifecycle
  componentDidUpdate() {
    if (!this.state.submitListenerAdded && this.state.course) {
      // Note: Event listeners have to be added after all of the html is ready (which is after api call gets data and component is updated with that data)
      document.querySelector('form').addEventListener('submit', this.onSubmit);
      this.setState({ submitListenerAdded: true });
    }
  }


  onSubmit = (event) => {
    // prevents the page from re-loading
    event.preventDefault();

    // Pass form, returns form data as JSON
    const data = getFormData(event.target);
    
    // Get course ID #
    const id = this.props.id;

    // get authorization info from global
    const { user:{emailAddress:username}, password} = this.context;

    const url = `${config.apiBaseUrl}/courses/${id}`;

    sendRequest({url, method:'PUT', username, password, data})
      .then(() => {
        // back to main page
        this.props.history.push(`/courses`);
      })
  }

  updateCourseJSX() {
    if (this.state.course) {
      const { id, title, description, estimatedTime, materialsNeeded, userId } = this.state.course;

      return (
        <div className="bounds course--detail">
          <h1>Update Course</h1>
          <div>
            
            <form action="#" method="put">
              <div className="grid-66">
                <div className="course--header">
                  <h4 className="course--label">Course</h4>
                  <div>
                    {/* Note: React overrides native behaviour for updating the 'value' prop of input. Two solutions: Don't set 'value', instead use 'defaultValue'. Or, set the 'value' to a variable that is updated by an onChange handler.*/}
                    <input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..."
                      defaultValue={title} />
                  </div>
                  <p>By {userId}</p>
                </div>
                <div className="course--description">
                  <div><textarea id="description" name="description" className="" placeholder="Course description..." defaultValue={description} ></textarea></div>
                </div>
              </div>
              <div className="grid-25 grid-right">
                <div className="course--stats">
                  <ul className="course--stats--list">
                    <li className="course--stats--list--item">
                      <h4>Estimated Time</h4>
                      <div><input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input"
                        placeholder="Hours" defaultValue={estimatedTime}/></div>
                    </li>
                    <li className="course--stats--list--item">
                      <h4>Materials Needed</h4>
                      <div><textarea id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials..." defaultValue={materialsNeeded}></textarea></div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="grid-100 pad-bottom">
                <button className="button" type="submit">Update Course</button>
                <button className="button button-secondary" onClick={this.onCancel}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      );
    }
  }

  onCancel = (test) => {
    this.props.history.push(`/courses`);
  }

  render() {
    return (
      <>
        <Consumer>
          {context => { this.context = context;}}
        </Consumer>

        {this.updateCourseJSX()}
      </>
    );
  }
}

// Wraps component in HOC, 
// restricting page to signed-in users
export default PrivateRoute(UpdateCourse);