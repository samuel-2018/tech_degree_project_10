import React, {Component} from 'react';
// import logo from './logo.svg';
import './global.css';
import axios from "axios";

// Components
import CourseDetail from "./components/CourseDetail";
import Courses from "./components/Courses";
import CreateCourse from "./components/CreateCourse";
import Header from "./components/Header";
import UpdateCourse from "./components/UpdateCourse";
import UserSignIn from "./components/UserSignIn";
import UserSignOut from "./components/UserSignOut";
import UserSignUp from "./components/UserSignUp";

// Router
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

// Context
const Context = React.createContext();
const Provider = Context.Provider; 

class App extends Component {

   constructor() {
    super();
     this.state = {
      // 'true' for testing
       authenticatedUser: true,
       firstName: 'John',
       lastName: 'Smith'
  }
  }

  render() {
    

    return (
      <BrowserRouter>
        <div className="App">
          <Provider value={{ authenticatedUser: this.state.authenticatedUser, firstName: this.state.firstName, lastName: this.state.lastName }} >
            <Header />
            <Switch>
              <Route exact path="/courses" render={() => <Courses />} />
              <Route path="/courses/create" render={() => <CreateCourse />} />
              <Route path="/courses/:id" render={(props) => <CourseDetail id={props.match.params.id} />} />
              
              <Route path="/signin" render={()=><UserSignIn />} />
              <Route path="/signup" render={()=><UserSignUp />} />
              <Route path="/signout" render={()=><UserSignOut />} />
      
             
              <UserSignIn />
            </Switch>
          </Provider>
        </div>
      </BrowserRouter>

      // value = {{ authenticatedUser: this.state.authenticatedUser, firstName: this.state.firstName, lastName: this.state.lastName }}
  );
}
  
}

export default App;

export const Consumer = Context.Consumer;