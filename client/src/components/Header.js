
import React, {Component} from "react";

// Consumer/'context' provides access to global context variables
import { Consumer } from '../App.js';


class Header extends Component {
  render() {

    // Sets page title
    document.title = "Courses";

    function loginJSX (context) {
            if (context.authenticatedUser) {
              return (<nav><span>Welcome, {context.firstName + " " + context.lastName}!</span><a className="signout" href="/">Sign Out</a></nav>)
            } else {
              return (<nav><a className="signup" href="/signup">Sign Up</a><a className="signin" href="/signin">Sign In</a></nav>)
            }
    }

    return (

        <div className="header">
    
        <div className="bounds">
          <h1 className="header--logo">Courses</h1>
          <Consumer>
            {
              context => {
                return loginJSX(context);
              }
            }
          </Consumer>
        </div>
      </div>
        
    )
  }
}

export default Header;