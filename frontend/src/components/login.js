import React, { Component } from "react";
import { Link } from "react-router-dom";
import loading from "./loading.gif";
import "../App.css";

function closeErrorMsg(div) {
  setTimeout(function () {
    div.style.display = "none";
  }, 2500);
}

export default class Login extends Component {
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
        if (data == "not_exists") {
          errorMsgDiv.style.display = "flex";
          errorMsg.textContent = "Username incorrect!";
          closeErrorMsg(errorMsgDiv);
        }

        // wrong password
        else if (data == "password_invalid") {
          errorMsgDiv.style.display = "flex";
          errorMsg.textContent = "Wrong password!";
          closeErrorMsg(errorMsgDiv);
        }

        // success
        else if (data == "success") {
          console.log("SSSSS");
          errorMsgDiv.style.display = "flex";
          errorMsg.textContent = "Login successful!";
          errorMsg.style.color = "rgb(64, 122, 64)";

          // redirect to palette.html
          setTimeout(() => {
            errorMsg.style.color = "rgb(189, 76, 76);";
            errorMsgDiv.style.display = "none";

            window.location.assign("/palette");
          }, 2500);
        }
      });
  }

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
                <img className="login_loading_gif" src={loading} />
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
