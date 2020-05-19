import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";

// components
import Login from "./components/login";
import Register from "./components/register";

// form
function App() {
  return (
    <Router>
      <Route path={["/", "/login"]} component={Login}></Route>
      <Route path="/register" component={Register}></Route>
    </Router>
  );
}

export default App;
