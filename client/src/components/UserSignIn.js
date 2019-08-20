import React, {Component} from "react";
import Header from "./Header";
import axios from "axios";
// Base URL
import config from '../config';



class UserSignIn extends Component {
  constructor() {
    super();
  this.signIn = this.signIn.bind(this);
  }

  componentDidMount() {
    // Note: Event listeners have to be added after all of the html is ready
   document.querySelector('form').addEventListener('submit', this.signIn);
  }


  signIn(event) {
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
      .then(() => {
        console.log('Success! Signed in.');
      })
      .catch((error) => {
        console.log(error);
      })
  }

  signInJSX() {
 
    return (
      <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign In</h1>
          <div>
            <form action="#" method="get">
              <div><input id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address"/></div>
              <div><input id="password" name="password" type="password" className="" placeholder="Password"/></div>
              <div className="grid-100 pad-bottom"><button className="button" type="submit">Sign In</button><button className="button button-secondary" onClick={`event.preventDefault(); href=${config.apiBaseUrl}/courses;`}>Cancel</button></div>
            </form>
          </div>
          <p>&nbsp;</p>
          <p>Don't have a user account? <a href="sign-up.html">Click here</a> to sign up!</p>
        </div>
      </div>
      
    );
  }


  render() {
    //  this.signIn('john@smith.com', 'password');




    return (
      <>
        <Header />

        <this.signInJSX />
  
      </>
    );
  }
 

}

export default UserSignIn;