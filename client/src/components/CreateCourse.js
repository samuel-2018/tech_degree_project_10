import React, {Component} from "react";
import Header from "./Header";
import axios from "axios";
// Base URL
import config from '../config';

// PrivateRoute: Enables restricting page to signed-in users
import { PrivateRoute, getFormData, sendRequest } from './helpers';

// Enables access to global state
import { Consumer } from '../App.js';

class CreateCourse extends Component {
  constructor() {
    super();
    this.state = {
      userId: null,
      submitListenerAdded: false,
    };
    this.context = null;
  }

  componentDidMount() {
    this.setState({ userId: this.context.user.id });
  }

 componentDidUpdate() {
    if (!this.state.submitListenerAdded && this.state.userId) {
      // Note: Event listeners have to be added after all of the html is ready (which is after api call gets data and component is updated with that data)
      document.querySelector('form').addEventListener('submit', this.onSubmit);
      this.setState({ submitListenerAdded: true });
    }
  }



  onSubmit = (event) => {
    // prevents the page from re-loading
    event.preventDefault();

    // // The 'event' is the form submission.
    // // Form values can be accessed by # or name.
    // // event.target[ 0 / 'emailAddress' ].value;

    // // Gets info from form event.
    // const title = event.target['title'].value;
    // const description = event.target['description'].value;
    // const estimatedTime = event.target['estimatedTime'].value;
    // const materialsNeeded = event.target['materialsNeeded'].value;

    // Pass form, returns form data as JSON
    const data = getFormData(event.target);

    // // Get course ID #
    // const id = this.props.id;

    // get authorization info from global
    const { user:{emailAddress:username}, password} = this.context;

    const url = `${config.apiBaseUrl}/courses`;

    sendRequest({url, method:'POST', username, password, data})
      .then(() => {
        // back to main page
        this.props.history.push(`/courses`);
      })


    // // Prepares request info
    // const options = {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json; charset=utf-8',
    //     'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
    //   },
    //   data: data,
    //   // data: {
    //   //     title, description, estimatedTime, materialsNeeded
    //   //   }
    // };

    // // Sends to API
    // axios(`${config.apiBaseUrl}/courses`, options)
    //   .then((response) => {

    //     console.log('Success! Course created.');

    //     // back to main page
    //     this.props.history.push(`/courses`);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   })
  }
  createCourseJSX() {
    // //Is user id ready? (there seems to be a delay in context being ready, thus a need to add user info from context to state and wait to update from state when ready)
    // would redesigning this page with async/await help?
    if (this.state.userId) {
      
    
      // Get current user ID #
      // Note: In the response body for get user, the user parameter is 'id.' In get course response body, 'id' refers the the course and 'userId' refers to the owner of the course.
      // const userId = this.context.user.id;
      // console.log('CreateCourse ... this.context', this.context);
    
      // const { user: { id: userId } } = this.context;

      const userId = this.state.userId;

      return (
        <div className="bounds course--detail">
          <h1>Create Course</h1>
          <div>
            <div>
              <h2 className="validation--errors--label">Validation errors</h2>
              <div className="validation-errors">
                <ul>
                  <li>Please provide a value for "Title"</li>
                  <li>Please provide a value for "Description"</li>
                </ul>
              </div>
            </div>

            <form action="#" method="post">
              <div className="grid-66">
                <div className="course--header">
                  <h4 className="course--label">Course</h4>
                  <div><input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..."
                  /></div>
                  {/* The course is 'by' the current user. */}
                  <p>By {userId}</p>
                </div>
                <div className="course--description">
                  <div><textarea id="description" name="description" className="" placeholder="Course description..."></textarea></div>
                </div>
              </div>
              <div className="grid-25 grid-right">
                <div className="course--stats">
                  <ul className="course--stats--list">
                    <li className="course--stats--list--item">
                      <h4>Estimated Time</h4>
                      <div><input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input"
                        placeholder="Hours" /></div>
                    </li>
                    <li className="course--stats--list--item">
                      <h4>Materials Needed</h4>
                      <div><textarea id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials..."></textarea></div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="grid-100 pad-bottom">
              
                <button className="button" type="submit">Create Course</button>
              
                <button className="button button-secondary" onClick={this.onCancel}>Cancel</button>

              </div>
            </form>
          </div>
        </div>
      );
    }
  }
  
  onCancel = () => {
  //  event.preventDefault()
    // Redirects to main page
    // Note: In the router file, passing 'props' is necessary so this file has access to history.
    this.props.history.push(`/courses`);
  }
  render() {
    return (
      <>
        <Consumer>
          {context => { this.context = context;}}
        </Consumer>

        {this.createCourseJSX()}
      </>
    );
  }
}

// Wraps component in HOC, 
// restricting page to signed-in users
export default PrivateRoute(CreateCourse);