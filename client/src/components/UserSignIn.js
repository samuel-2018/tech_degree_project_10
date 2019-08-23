import React, {Component} from "react";
import Header from "./Header";
import axios from "axios";
// Base URL
import config from '../config';

// Enables access to global state
import { Consumer } from '../App.js';

class UserSignIn extends Component {
  constructor() {
    super();
    this.state = {
    
    };
    this.context = null;

    // this.onSubmit = this.onSubmit.bind(this);
    // this.goSignUp = this.goSignUp.bind(this);
    // this.onCancel = this.onCancel.bind(this);
  }

  componentDidMount() {
    // Note: Event listeners have to be added after all of the html is ready
   document.querySelector('form').addEventListener('submit', this.onSubmit);
  }


  onSubmit = (event) => {
    // prevents the page from re-loading
    event.preventDefault();

    // The 'event' is the form submission.
    // Form values can be accessed by # or name.
    // event.target[ 0 / 'emailAddress' ].value;

    // Gets login info from form event.
    const username = event.target['emailAddress'].value;
    const password = event.target['password'].value;
    
    // Prepares login info
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Basic ${btoa(`${username}:${password}`)}`
      }
    };

    // Sends login to API
    axios(`${config.apiBaseUrl}/users`, options)
      .then((response) => {

        console.log('Success! Signed in.');
        // console.log(response.data.user);

        //Sends user info back to global state
        this.context.handleSetUser(response.data.user, password);

        
        // Note: Don't use this.props.history.goBack();
        // That will go back to the prev page but also revert state changes.

        // Sends the user back to the page they were on.
        // console.log('this.props.location', this.props.location);
        
        // const prevPage = this.props.history.entries[this.props.history.index - 1].pathname;
        // console.log('prevPage: ', prevPage);
        
        // this.props.history.push(this.context.prevPage);


        this.props.history.push(this.props.location.state.from.pathname);

        //TO DO: cREATE a way to send user back to page they were on.
        // This is not for all things. it is just for two cases: For the two private routes: create and update.
        // this will in some way use >>>>"props.location.state"<<<<<
        // it appears this is not auto generated
        // you will need to make a way to add the history object that will be in the location's state
        // CHANGE this does need to be for all routes per discussion on slack

      })
      .catch((error) => {
        console.log(error);
      })
  }

  signInJSX() {
    
    return(
      <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign In</h1>
          <div>
            
            <form action="#" method="get">
              <div><input id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address"/></div>
              <div><input id="password" name="password" type="password" className="" placeholder="Password"/></div>
              <div className="grid-100 pad-bottom"><button className="button" type="submit">Sign In</button><button className="button button-secondary" onClick={this.onCancel}>Cancel</button></div>
            </form>
          </div>
          <p>&nbsp;</p>
          <p>Don't have a user account? <a onClick={this.goSignUp}>Click here</a> to sign up!</p>
        </div>
      </div>
      
    );
  }

  onCancel = () => {
    // Redirects to main page
    // Note: In the router file, passing 'props' is necessary so this file has access to history.
    this.props.history.push(`/courses`);
  }

  goSignUp = () => {
     this.props.history.push(`/signup`);
  }

  
  render() {
    //  this.signIn('john@smith.com', 'password');
     console.log("UserSignIn (this.props.location): ", this.props.location);



    return (
      <>
        <Consumer>
          {context => { this.context = context;}}
        </Consumer>

        {this.signInJSX()}
  
      </>
    );
  }
 

}

export default UserSignIn;