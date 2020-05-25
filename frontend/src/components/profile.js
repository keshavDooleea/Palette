import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "./profile.css";
import "./navbar.css";
import moment from "moment";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      data: [],
      password: "",
    };

    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    fetch(`http://localhost:5000/profile/${this.state.id}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
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

  render() {
    return (
      <div className="profile">
        <nav className="profile_nav">
          <div className="color_palette_div">
            <h1>Color Palette</h1>
          </div>
          <div className="nav_div">
            <ul>
              <li>
                <NavLink
                  to={`/palette/${this.state.id}`}
                  className="navLink"
                  activeClassName="activeLink"
                >
                  My Palette
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={`/community/${this.state.id}`}
                  className="navLink"
                  activeClassName="activeLink"
                >
                  Community's Palette
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={`/profile/${this.state.id}`}
                  className="navLink"
                  activeClassName="activeLink"
                >
                  Profile
                </NavLink>
              </li>
              <li>
                <NavLink to="/" className="navLink" id="logout">
                  Log out
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
        <div className="profile_main">
          <div className="rose-prof-div"></div>
          <div className="profile_div">
            <div className="prof_image_div"></div>
            <div className="prof_details_div">
              <div className="prof_msg_div"></div>
              <div className="prof_username_div">
                <h1>Username: </h1>
                <p key={this.state.data.username}>{this.state.data.username}</p>
                <div>
                  <button>Change</button>
                </div>
              </div>
              <div className="prof_password_div">
                <h1>Password: </h1>
                <p key={this.state.password}>{this.state.password}</p>
                <div>
                  <button>Change</button>
                </div>
              </div>
              <div className="prof_button_div">
                <button>Delete Account</button>
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
