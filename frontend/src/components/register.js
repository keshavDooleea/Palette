import React, { Component } from "react";
import { Link } from "react-router-dom";
import back from "./back.png";
import loading from "./loading.gif";
import "../App.css";

function closeErrorMsg(div) {
  setTimeout(function () {
    div.style.display = "none";
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
      errorMsgDiv.style.display = "flex";
      errorMsg.textContent = "Username must be longer than 5 letters!";
      closeErrorMsg(errorMsgDiv);

      return;
    } else if (password.length < 5) {
      errorMsgDiv.style.display = "flex";
      errorMsg.textContent = "Password must be longer than 5 letters!";
      closeErrorMsg(errorMsgDiv);

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
        if (data == "exists") {
          errorMsgDiv.style.display = "flex";
          errorMsg.textContent = "Username already exists!";
          closeErrorMsg(errorMsgDiv);
        } else {
          errorMsgDiv.style.display = "flex";
          errorMsg.textContent = "Account successfully created!";
          errorMsg.style.color = "rgb(64, 122, 64)";

          // redirect to /login
          setTimeout(() => {
            errorMsgDiv.style.display = "none";
            window.location.assign("/login");
          }, 2500);
        }
      });
  }

  render() {
    return (
      <div className="register_parent">
        <div className="rd-register-div">
          <img src="./logo.png" alt="" />
        </div>

        <div className="register_child">
          <div className="left_register_child">
            <h1>COLOR</h1>
          </div>
          <div className="right_register_child">
            <h1>PALETTE</h1>
          </div>
          <div className="register_form_div">
            <form className="register_form">
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
              <img className="register_loading_gif" src={loading} />
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
