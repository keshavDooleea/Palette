import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "./community.css";

export default class Community extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="community">
        <nav className="com_nav">
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
        <div className="community_main">COMMUNITY</div>
      </div>
    );
  }
}
