import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "./palette.css";

export default class Palette extends Component {
  constructor(props) {
    super(props);

    this.state = {
      prop: props,
    };
  }

  render() {
    return (
      <div className="palette">
        <nav className="palette_nav">
          <ul>
            <li>
              <NavLink to="/palette">My Palette</NavLink>
            </li>
            <li>
              <NavLink to="/community">Community's Palette</NavLink>
            </li>
            <li>
              <NavLink to="/profile">Profile</NavLink>
            </li>
          </ul>
        </nav>

        <div className="palette_main">PALETTE {this.props.params.username}</div>
      </div>
    );
  }
}
