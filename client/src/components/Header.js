
import React, {Component} from "react";
import { Link } from 'react-router-dom'

// Consumer/'context' provides access to global context variables
import { Consumer } from '../App.js';


class Header extends Component {
  render() {
    // Sets page title
    document.title = "Courses";
// console.log('Header (this.props.location): ',this.props.location);

    const { location } = this.props;

    // console.log('Header (this.props)',this.props);
    
    // Sends App.js the current location
    // prevPage(location.pathname);

  
    
    function loginJSX(context) {
      if (context.authenticatedUser) {
        return (
          <nav>

            <span>Welcome, {context.user.firstName + " " + context.user.lastName}!</span>

            <Link
              to={{
                pathname: `/`,
                state: { from: location }
              }}
              className="signout" href="/">Sign Out
              </Link>
            
          </nav>)
      } else {
        return (
          <nav>

            <Link
              to={{
                pathname: `/signup`,
                state: { from: location }
              }}
              className="signup" >Sign Up
            </Link>
            
            <Link
              to={{
                pathname: `/signin`,
                state: { from: location }
              }}
              className="signin" >Sign In
              </Link>
            
          </nav>
        )
      }
    }

    return (
        <div className="header">
        <div className="bounds">
          <h1 className="header--logo">
            <Link
              to={{pathname: `/courses` }}>Courses
            </Link>
          </h1>
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

// NOTE this doesn't work
// // Should be available as "this.context"
// Header.contextType = Context;

export default Header;