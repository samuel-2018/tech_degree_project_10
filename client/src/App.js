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
import { BrowserRouter, Route, Switch, Redirect, withRouter } from "react-router-dom";

// Provides Header access to location
const HeaderwithRouter = withRouter(Header);

// Context
const Context = React.createContext();
const {Provider, Consumer} = Context; 

class App extends Component {

  constructor() {
    super();
    this.state = {
      authenticatedUser: false,
      password: '',
      user: {},
    };

    // this.prevPage = '/';

    this.handleSetUser = this.handleSetUser.bind(this);
    // this.handlePrevPage = this.handlePrevPage.bind(this);
       
  }

  handleSetUser(user, password) {
    this.setState({ user, password, authenticatedUser: true });
  }

  componentDidMount() {
  console.log("******** App -- componentDidMount   **********");
  
}


  render() {
    

    return (
      <BrowserRouter>
        <div className="App">

          <Provider value={{ ...this.state, handleSetUser: this.handleSetUser}} >

            <HeaderwithRouter />

            <Switch>
              <Route exact path="/" render={() => <Redirect to="/courses" />} />

              <Route exact path="/courses" render={() => <Courses />} /> 
              
              <Route exact path="/courses/create" render={(props) => <CreateCourse {...props}/>} />

              <Route exact path="/courses/:id/update" render={(props) => <UpdateCourse id={props.match.params.id} {...props}/>} />

              <Route path="/courses/:id" render={(props) => <CourseDetail id={props.match.params.id} {...props} />} />

              {/* Passing in 'props' is necessary so it has access to history. It has to be in the format of:  render={(props) => <SomeComponent {...props} />}. This will not work: <SomeComponent history={props.history} />}   */}

              <Route exact path="/signin" render={(props) => <UserSignIn   {...props} />} />
              
              <Route exact path="/signup" render={(props)=><UserSignUp {...props} />} />
              <Route exact path="/signout" render={()=><UserSignOut />} />
     
            </Switch>
          </Provider>
        </div>
      </BrowserRouter>

  );
}
  
}

export default App;

export {Consumer};