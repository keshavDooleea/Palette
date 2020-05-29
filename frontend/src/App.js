import React, { Component } from "react";
import { BrowserRouter as Router, Route /*Redirect*/ } from "react-router-dom";
import "./App.css";

// auth
// https://reacttraining.com/react-router/web/example/auth-workflow

// to access params in url: this.props.match.params.id

// components
import Login from "./components/login";
import Register from "./components/register";
import Palette from "./components/palette";
import Community from "./components/community";
import Profile from "./components/profile";

// form
class App extends Component {
  constructor(props) {
    super(props);

    // Bind the this context to the handler function
    this.handler = this.handler.bind(this);

    // Set some state
    this.state = {
      isLogged: false,
    };
  }

  // This method will be sent to the child component
  handler(value) {
    this.setState({
      isLogged: value,
    });
  }

  render() {
    return (
      <Router>
        <Route path={["/", "/login"]} exact strict component={Login}></Route>
        <Route path="/register" exact strict component={Register}></Route>
        <Route path="/palette" exact component={Palette}></Route>
        <Route path="/community" exact component={Community}></Route>
        <Route path="/profile" exact component={Profile}></Route>
      </Router>
    );
  }
}

export default App;
