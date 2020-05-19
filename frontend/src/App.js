import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";

// components
import Login from "./components/login";
import Register from "./components/register";
import Palette from "./components/palette";

// form
function App() {
  return (
    <Router>
      <Route path={["/", "/login"]} exact strict component={Login}></Route>
      <Route path="/register" exact component={Register}></Route>
      <Route path="/palette" exact component={Palette}></Route>
    </Router>
  );
}

export default App;
