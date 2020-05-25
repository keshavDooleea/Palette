import React, { Component } from "react";
import { Link } from "react-router-dom";
import back from "../assets/back.png";
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

export default class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectLogin: false,
    };
  }

  createAccount(e) {
    e.preventDefault();

    const createBtn = document.querySelector(".create_acc_btn");
    const loadingGif = document.querySelector(".register_loading_gif");
    const errorMsgDiv = document.querySelector(".register_error_div");
    const errorMsg = document.querySelector(".register_msg");

    const formData = new FormData(document.querySelector(".register_form"));
    const username = formData.get("username");
    const password = formData.get("password");

    // length validation
    if (username.length < 5) {
      displayMsg(
        errorMsgDiv,
        errorMsg,
        "Username must be longer than 4 letters!"
      );

      return;
    } else if (password.length < 5) {
      displayMsg(
        errorMsgDiv,
        errorMsg,
        "Password must be longer than 4 letters!"
      );

      return;
    } else {
      errorMsgDiv.style.display = "none";
    }

    const user = {
      username,
      password,
    };

    console.log(user);

    // show loading spinner
    createBtn.style.visibility = "hidden";
    loadingGif.style.display = "block";

    // post to server
    fetch("http://localhost:5000/register", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // hide loading spinner
        createBtn.style.visibility = "visible";
        loadingGif.style.display = "none";

        // user already exists
        if (data === "exists") {
          displayMsg(errorMsgDiv, errorMsg, "Username unavailable!");
        } else {
          errorMsg.style.color = "rgb(64, 122, 64)";
          displayMsg(errorMsgDiv, errorMsg, "Account successfully created!");
          errorMsg.style.color = "rgb(189, 76, 76);";

          // redirect to /login
          setTimeout(() => {
            window.location.assign("/login");
          }, 2600);
        }
      });
  }

  render() {
    return (
      <div className="register_parent">
        <div className="rd-register-div">
          <img src={logo} alt="" />
        </div>

        <div className="register_child">
          <div className="left_register_child">
            <h1>COLOR</h1>
          </div>
          <div className="right_register_child">
            <h1>PALETTE</h1>
          </div>
          <div className="register_form_div">
            <form className="register_form" autoComplete="off">
              <Link to="/">
                <img className="register_back" src={back} alt="" />
              </Link>
              <h1>REGISTER</h1>
              <fieldset>
                <legend>Username</legend>
                <input type="text" spellCheck="false" name="username"></input>
              </fieldset>
              <fieldset>
                <legend>Password</legend>
                <input type="text" spellCheck="false" name="password"></input>
              </fieldset>
              <input
                type="submit"
                className="create_acc_btn"
                value="Create Account"
                onClick={this.createAccount}
              />
              <img
                className="register_loading_gif"
                src={loading}
                alt="loading_reg"
              />
              <div className="register_error_div">
                <p className="register_msg">ERROR</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
