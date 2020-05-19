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
      <Route path="/register" component={Register}></Route>
      <Route path="/palette" component={Palette}></Route>
      <Route path={["/", "/login"]} component={Login}></Route>
    </Router>
  );
}

export default App;
