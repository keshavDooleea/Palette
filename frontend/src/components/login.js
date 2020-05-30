import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import loading from "../assets/loading.gif";
import logo from "../assets/logo.png";
import "../App.css";

function displayMsg(div, msgElement, msg) {
  div.style.display = "flex";
  div.classList.remove("close");
  div.classList.add("open");

  msgElement.textContent = msg;

  setTimeout(function () {
    div.classList.add("close");
    div.classList.remove("open");
  }, 2500);
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
  }


  registerClicked(e) {
    document.querySelector(".login_form").reset();
  }

  login(e) {
    e.preventDefault();

    const loginBtn = document.querySelector(".login_btn");
    const registerBtn = document.querySelector(".register_btn");
    const loadingGif = document.querySelector(".login_loading_gif");
    const errorMsgDiv = document.querySelector(".login_error_div");
    const errorMsg = document.querySelector(".login_msg");

    const formData = new FormData(document.querySelector(".login_form"));
    const username = formData.get("username");
    const password = formData.get("password");

    // length validation
    if (username.length < 5) {
      displayMsg(errorMsgDiv, errorMsg, "Username must be longer than 4 letters!");
      return;

    } else if (password.length < 5) {
      displayMsg(errorMsgDiv, errorMsg, "Password must be longer than 4 letters!");
      return;

    } else {
      errorMsgDiv.style.display = "none";
    }

    const user = {
      username,
      password,
    };

    // show loading spinner
    loginBtn.style.visibility = "hidden";
    registerBtn.style.visibility = "hidden";
    loadingGif.style.display = "block";

    // post to server
    fetch("http://localhost:5000/login", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // show loading spinner
        loginBtn.style.visibility = "visible";
        registerBtn.style.visibility = "visible";
        loadingGif.style.display = "none";

        // user does not exist
        if (data === "not_exists") {
          displayMsg(errorMsgDiv, errorMsg, "Username incorrect!");
        }

        // wrong password
        else if (data === "password_invalid") {
          displayMsg(errorMsgDiv, errorMsg, "Wrong password!");
        }

        // success
        else if (data.message === "success") {
          errorMsg.style.color = "rgb(64, 122, 64)";
          displayMsg(errorMsgDiv, errorMsg, "Login successful!");
          errorMsg.style.color = "rgb(189, 76, 76);";

          // save token
          localStorage.setItem('usertoken', data.token);

          // redirect to palette.html
          setTimeout(() => {
            this.props.history.push("/palette");
          }, 2600);
        }
      });
  }

  render() {
    return (
      <div className="parent">
        <div className="rd-div">
          <img src={logo} alt="" />
        </div>

        <div className="login_child">
          <div className="left_login_child">
            <h1>COLOR</h1>
          </div>
          <div className="right_login_child">
            <h1>PALETTE</h1>
          </div>
          <div className="login_form_div">
            <form className="login_form" autoComplete="off">
              <h1>LOGIN</h1>
              <fieldset>
                <legend>Username</legend>
                <input type="text" spellCheck="false" name="username"></input>
              </fieldset>
              <fieldset>
                <legend>Password</legend>
                <input type="text" spellCheck="false" name="password"></input>
              </fieldset>
              <div className="login_inputs">
                <input
                  type="submit"
                  className="login_btn"
                  value="Sign In"
                  onClick={this.login}
                ></input>
                <button className="register_btn" onClick={this.registerClicked}>
                  <Link className="register_link" to="/register">
                    Register?
                  </Link>
                </button>
                <img
                  className="login_loading_gif"
                  src={loading}
                  alt="loading"
                />
                <div className="login_error_div">
                  <p className="login_msg">ERROR</p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Login)