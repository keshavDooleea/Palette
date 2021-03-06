import React, { Component } from "react";
import { NavLink, withRouter } from "react-router-dom";
import userLogo from "../assets/user.png";
import "./profile.css";
import "./navbar.css";
import moment from "moment";

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      password: "",
      textColor: "",
      isUsernameClicked: false,
      isPasswordClicked: false,
      isDeleteClicked: false,
      showMessage: false,
      messageShown: "",
      isHamburgerClicked: false,
      isMobileNavLoaded: false,
    };

    this.fetchData = this.fetchData.bind(this);
    this.deleteRequest = this.deleteRequest.bind(this);
    this.updateUsername = this.updateUsername.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.closeUsernameDiv = this.closeUsernameDiv.bind(this);
    this.closePasswordDiv = this.closePasswordDiv.bind(this);
  }

  componentDidMount() {
    document.querySelector("body").style.overflow = "hidden";
    this.fetchData();
  }

  fetchData() {

    fetch("https://colorpalettemern.herokuapp.com/profile", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        authorization: `Bearer ${localStorage.usertoken}`,
      }
    })
      .then((res) => res.json())
      .then((data) => {
        const password = data.password;
        let encrypted = "";

        // converts password into encrypted password (***)
        for (let i = 0; i < password.length; i++) {
          if (i === 0) {
            encrypted += password[i];
          } else if (i === password.length - 1) {
            encrypted += password[i];
          } else {
            encrypted += "*";
          }
        }

        this.setState({
          data: data,
          password: encrypted,
        });
      });
  }

  showMsg() {
    setTimeout(() => {
      this.setState({
        showMessage: false,
      });
    }, 3000);

    return (
      <div className="show_msg_div">
        <p
          className="show_msg"
          style={{
            color: `${this.state.textColor}`,
          }}
        >
          {this.state.messageShown}
        </p>
      </div>
    );
  }

  closeUsernameDiv() {
    document
      .querySelector(".username_change_div")
      .classList.add("remove_slide_in");

    setTimeout(() => {
      document.querySelector(".prof_button_div").classList.remove("no_pointer");

      document.querySelector(".pass_change").classList.remove("no_pointer");
      document.querySelector(".prof_password_div").style.opacity = "1";
      document.querySelector(".prof_button_div").style.opacity = "1";

      this.setState({
        isUsernameClicked: false,
      });
    }, 1800);
  }

  closePasswordDiv() {
    document.querySelector(".password_change_div").classList.add("remove_slide_pass_in");

    setTimeout(() => {
      document.querySelector(".prof_username_div").style.opacity = "1";
      document.querySelector(".prof_button_div").style.opacity = "1";
      document.querySelector(".prof_button_div").classList.remove("no_pointer");
      document.querySelector(".username_change").classList.remove("no_pointer");
      this.setState({
        isPasswordClicked: false,
      });
    }, 1800);
  }

  updateUsername() {
    const newUsername = document.querySelector(".prof_username_input").value;

    if (newUsername.length === 0) {
      this.setState({
        messageShown: "Enter a username",
        textColor: "rgb(189, 76, 76)",
        showMessage: true,
      });

    } else if (newUsername.length < 5) {
      this.setState({
        messageShown: "Enter more than 4 letters",
        textColor: "rgb(189, 76, 76)",
        showMessage: true,
      });

    } else {
      // disappear div
      this.closeUsernameDiv();

      // update data
      fetch("https://colorpalettemern.herokuapp.com/profile/username", {
        headers: {
          "Content-Type": "application/json",
          Accept: 'application/json',
          authorization: `Bearer ${localStorage.usertoken}`
        },
        method: "PUT",
        body: JSON.stringify({
          username: newUsername,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data === "success") {
            this.fetchData();

            this.setState({
              messageShown: "Username saved",
              textColor: "rgb(64, 122, 64)",
              showMessage: true,
            });
          }

          else if (data === "exists") {
            this.setState({
              messageShown: "Username already exists",
              textColor: "rgb(189, 76, 76)",
              showMessage: true,
            });
          }
        });
    }
  }

  updatePassword() {
    const newPassword = document.querySelector(".prof_password_input").value;

    if (newPassword.length === 0) {
      this.setState({
        messageShown: "Enter a password",
        textColor: "rgb(189, 76, 76)",
        showMessage: true,
      });
    }

    else if (newPassword.length < 5) {
      this.setState({
        messageShown: "Enter more than 4 letters",
        textColor: "rgb(189, 76, 76)",
        showMessage: true,
      });
    }

    else {
      // disappear div
      this.closePasswordDiv();

      // update data
      fetch("https://colorpalettemern.herokuapp.com/profile/password", {
        headers: {
          "Content-Type": "application/json",
          Accept: 'application/json',
          authorization: `Bearer ${localStorage.usertoken}`
        },
        method: "PUT",
        body: JSON.stringify({
          password: newPassword,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data === "success") {
            this.fetchData();

            this.setState({
              messageShown: "Password saved",
              textColor: "rgb(64, 122, 64)",
              showMessage: true,
            });
          }
        });
    }
  }

  openUsername() {
    // disble other button
    document.querySelector(".pass_change").classList.add("no_pointer");
    document.querySelector(".prof_button_div").classList.add("no_pointer");
    document.querySelector(".prof_password_div").style.opacity = "0.3";
    document.querySelector(".prof_button_div").style.opacity = "0.3";

    return (
      <div className="username_change_div">
        <h1>Username: </h1>
        <input type="text" className="prof_username_input" spellCheck="false" />
        <div className="username_change_button_div">
          <button onClick={this.updateUsername}>Save</button>
          <button onClick={this.closeUsernameDiv}>Cancel</button>
        </div>
      </div>
    );
  }

  openPassword() {
    // disble other button
    document.querySelector(".username_change").classList.add("no_pointer");
    document.querySelector(".prof_button_div").classList.add("no_pointer");
    document.querySelector(".prof_username_div").style.opacity = "0.3";
    document.querySelector(".prof_button_div").style.opacity = "0.3";

    return (
      <div className="password_change_div">
        <h1>Password: </h1>
        <input type="text" className="prof_password_input" spellCheck="false" />
        <div className="username_change_button_div">
          <button onClick={this.updatePassword}>Save</button>
          <button onClick={this.closePasswordDiv}>Cancel</button>
        </div>
      </div>
    );
  }

  deleteRequest() {
    fetch("https://colorpalettemern.herokuapp.com/profile", {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        Accept: 'application/json',
        authorization: `Bearer ${localStorage.usertoken}`,
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data === "success") {
          // successfully deleted
          window.location.assign("/login");
        }
      });
  }

  openDelete() {
    return (
      <div className="delete_prof_div">
        <p>Are you sure you want to delete your profile?</p>
        <div className="del_btn_div">
          <button className="delete_prof_btn" onClick={this.deleteRequest}>
            Delete
          </button>
          <button
            className="cancel_delete_prof_btn"
            onClick={() => {
              document.querySelector(".delete_prof_div").classList.add("fade_out");

              setTimeout(() => {
                document.querySelector(".prof_username_div").style.visibility = "visible";
                document.querySelector(".prof_password_div").style.visibility = "visible";
                document.querySelector(".prof_button_div").style.visibility = "visible";
                this.setState({
                  isDeleteClicked: false,
                });
              }, 1200);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  openHamburger() {
    const hamburgers = document.querySelectorAll(".prof_hamburger span");

    hamburgers.forEach(span => {
      span.style.backgroundColor = "#f4f3ef";
    });
    document.querySelector(".prof_mobile_nav").style.display = "flex";
    document.querySelector(".prof_mobile_nav").classList.remove("nav_slide_in");
    document.querySelector(".prof_mobile_nav").classList.add("nav_slide_out");

  }

  closeHamburger() {
    const hamburgers = document.querySelectorAll(".prof_hamburger span");

    if (this.state.isMobileNavLoaded) {

      hamburgers.forEach(span => {
        span.style.backgroundColor = "#849994";
      });

      document.querySelector(".prof_mobile_nav").classList.remove("nav_slide_out");
      document.querySelector(".prof_mobile_nav").classList.add("nav_slide_in");
    }
  }

  logOut(e) {
    e.preventDefault();
    localStorage.removeItem('usertoken');
    this.props.history.push("/");
  }

  render() {
    return (
      <div className="profile">
        {/* open close hamburger  */}
        <div className="prof_mobile_nav">
          <ul>
            <li>
              <NavLink
                to={"/palette"}
                className="navLink"
                activeClassName="activeLink"
              >
                Palette
                </NavLink>
            </li>
            <li>
              <NavLink
                to={"/community"}
                className="navLink"
                activeClassName="activeLink"
              >
                {" "}
                  Community's Palette
                </NavLink>
            </li>
            <li>
              <NavLink
                to={"/profile"}
                className="navLink"
                activeClassName="activeLink"
              >
                My Profile
                </NavLink>
            </li>
            <li>
              <button className="navLink" id="logout" onClick={this.logOut.bind(this)}>Log out</button>
            </li>
          </ul>
        </div>

        {this.state.isHamburgerClicked ? this.openHamburger() : this.closeHamburger()}

        <nav className="profile_nav">
          <div className="color_palette_div">
            <h1>Color Palette</h1>
          </div>

          <div className="prof_hamburger"
            onClick={() => this.setState({
              isMobileNavLoaded: true,
              isHamburgerClicked: !this.state.isHamburgerClicked,
            })}>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className="nav_div">
            <ul>
              <li>
                <NavLink to={"/palette"} className="navLink" activeClassName="activeLink">
                  Palette
                </NavLink>
              </li>
              <li>
                <NavLink to={"/community"} className="navLink" activeClassName="activeLink" >
                  Community's Palette
                </NavLink>
              </li>
              <li>
                <NavLink to={"/profile"} className="navLink" activeClassName="activeLink">
                  My Profile
                </NavLink>
              </li>
              <li>
                <button className="navLink" id="logout" onClick={this.logOut.bind(this)}>Log out</button>
              </li>
            </ul>
          </div>
        </nav>

        <div className="profile_main">
          <div className="rose-prof-div"></div>
          <div className="profile_div">
            <div className="prof_image_div">
              <img className="image_p" src={userLogo} alt="userLogo"></img>
              <button className="image_b">Upload photo</button>
            </div>
            <div className="prof_details_div">
              {this.state.isDeleteClicked ? this.openDelete() : null}
              <div className="prof_msg_div">
                {this.state.showMessage ? this.showMsg() : null}
              </div>
              <div className="prof_username_div">
                {this.state.isUsernameClicked ? this.openUsername() : null}
                <h1>Username: </h1>
                <p key={this.state.data.username}>{this.state.data.username}</p>
                <div className="button_div">
                  <button
                    className="username_change"
                    onClick={() => {
                      this.setState({
                        isUsernameClicked: true,
                      });
                    }}
                  >
                    Change
                  </button>
                </div>
              </div>
              <div className="prof_password_div">
                {this.state.isPasswordClicked ? this.openPassword() : null}

                <h1>Password: </h1>
                <p key={this.state.password}>{this.state.password}</p>
                <div className="button_div">
                  <button
                    className="pass_change"
                    onClick={() => {
                      this.setState({
                        isPasswordClicked: true,
                      });
                    }}
                  >
                    Change
                  </button>
                </div>
              </div>
              <div className="prof_button_div">
                <button
                  onClick={() => {
                    document.querySelector(".prof_username_div").style.visibility = "hidden";
                    document.querySelector(".prof_password_div").style.visibility = "hidden";
                    document.querySelector(".prof_button_div").style.visibility = "hidden";
                    this.setState({
                      isDeleteClicked: true,
                    });
                  }}
                >
                  Delete Account
                </button>
              </div>
              <div className="prof_date_div">
                <p>
                  Date created:{" "}
                  {moment(this.state.data.date).format("DD-MM-YYYY")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Profile);