import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "./profile.css";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
    };
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
                  className="navlink"
                  activeClassName="activeNavlink"
                >
                  My Palette
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={`/community/${this.state.id}`}
                  className="navlink"
                  activeClassName="activeNavlink"
                >
                  Community's Palette
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={`/profile/${this.state.id}`}
                  className="navlink"
                  activeClassName="activeNavlink"
                >
                  Profile
                </NavLink>
              </li>
              <li>
                <NavLink to="/" className="navlink">
                  Log out
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
        <div className="profile_main">PROFILE</div>
      </div>
    );
  }
}
