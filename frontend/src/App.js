import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import "./App.css";

// to access params in url: this.props.match.params.id

// components
import Login from "./components/login";
import Register from "./components/register";
import Palette from "./components/palette";
import Community from "./components/community";
import Profile from "./components/profile";

class App extends Component {

  render() {
    return (
      <Router>
        <Route exact path={["/", "/login"]} strict component={Login}></Route>
        <Route exact path="/register" strict component={Register}></Route>

        <Route exact path="/palette" render={() => (
          localStorage.usertoken ? <Palette /> : <Redirect to="/" />
        )}></Route>

        <Route exact path="/community" render={() => (
          localStorage.usertoken ? <Community /> : <Redirect to="/" />
        )}></Route>

        <Route exact path="/profile" render={() => (
          localStorage.usertoken ? <Profile /> : <Redirect to="/" />
        )}></Route>
      </Router>
    );
  }
}

export default App;
