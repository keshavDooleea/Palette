import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "./palette.css";

export default class Palette extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
    };

    fetch(`http://localhost:5000/palette/${this.state.id}`, {
      method: "GET",
      headers: {
        "content-type": "application/JSON",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // document.querySelector(".navlink_palette").textContent =
        //   data[0].username + "'s Palette";
      });
  }

  render() {
    return (
      <div className="palette">
        <nav className="palette_nav">
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
                  {" "}
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

        <div className="palette_main">
          <div className="main_div"></div>
        </div>
        <div className="rose-round-div"></div>
      </div>
    );
  }
}
