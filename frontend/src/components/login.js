import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../App.css";

export default class Login extends Component {
  render() {
    return (
      <div className="parent">
        <div className="rd-div">
          <img src="./logo.png" alt="" />
        </div>

        <div className="login_child">
          <div className="left_login_child">
            <h1>COLOR</h1>
          </div>
          <div className="right_login_child">
            <h1>PALETTE</h1>
          </div>
          <div className="login_form_div">
            <form className="login_form">
              <h1>LOGIN</h1>
              <fieldset>
                <legend>Username</legend>
                <input type="text" spellCheck="false"></input>
              </fieldset>
              <fieldset>
                <legend>Password</legend>
                <input type="text" spellCheck="false"></input>
              </fieldset>
              <div className="login_inputs">
                <input
                  type="submit"
                  className="login_btn"
                  value="Sign In"
                ></input>
                <button className="register_btn">
                  <Link className="register_link" to="/register">
                    Register?
                  </Link>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
