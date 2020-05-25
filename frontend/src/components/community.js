import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "./community.css";
import "./navbar.css";

export default class Community extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      isDataEmpty: true,
    };
  }

  // when user doesnt have any palette saved yet
  emptyCom() {
    return (
      <div className="empty_com">
        <p>No one has added a palette yet..</p>
      </div>
    );
  }

  render() {
    return (
      <div className="community">
        <nav className="com_nav">
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
                  Palette
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
                  My Profile
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
        <div className="community_main">
          <div className="rose-com-div"></div>

          {this.state.isDataEmpty ? this.emptyCom() : null}
        </div>
      </div>
    );
  }
}
