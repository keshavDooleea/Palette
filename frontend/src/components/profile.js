import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "./profile.css";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="profile">
        <nav className="profile_nav">
          <ul>
            <li>
              <NavLink to="/palette">Palette</NavLink>
            </li>
            <li>
              <NavLink to="/community">Community</NavLink>
            </li>
            <li>
              <NavLink to="/profile">Profile</NavLink>
            </li>
          </ul>
        </nav>
        <div className="profile_main">PROFILE</div>
      </div>
    );
  }
}
