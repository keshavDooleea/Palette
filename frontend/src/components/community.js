import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "./community.css";
import "./navbar.css";
import moment from "moment";

export default class Community extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      isDataEmpty: false, // set to true if some prob occurs
      historyData: [],
    };
  }

  componentDidMount() {
    this.fetchHistory();
  }

  fetchHistory() {
    fetch("http://localhost:5000/community")
      .then((res) => res.json())
      .then((data) => {
        if (data === null) {
          this.setState({
            isDataEmpty: true,
          });
        } else {
          data.reverse();
          this.setState({
            isDataEmpty: false,
            historyData: data,
          });
        }
      });
  }

  // when user doesnt have any palette saved yet
  emptyCom() {
    return (
      <div className="empty_com">
        <p>No one has added a palette yet..</p>
      </div>
    );
  }

  displayPalettes() {
    console.log(this.state.historyData);
    return (
      <div className="history_div">
        {this.state.historyData.map((data) => (
          <div key={data._id} className="history_item">
            <div className="history_details">
              <div className="history_name">
                <p>{data.username} </p>
                <small>
                  {moment(data.date).format("h:mm a")} on{" "}
                  {moment(data.date).format("DD-MM-YYYY")}
                </small>
              </div>
              <div className="history_p">
                <p>added a new palette to his collection</p>
              </div>
            </div>
            <div className="history_body">
              <span className="history_color_span">
                {data.hexArray.map((item) => (
                  <span
                    className="history_colors"
                    key={item}
                    style={{
                      backgroundColor: `${item}`,
                    }}
                  ></span>
                ))}
              </span>
              <span className="history_colors_text">
                {data.hexArray.map((item) => (
                  <span
                    className="span_hex_text"
                    key={item}
                    style={{
                      color: `${item}`,
                    }}
                  >
                    {item}
                  </span>
                ))}
              </span>
            </div>
          </div>
        ))}
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

          {this.state.isDataEmpty ? this.emptyCom() : this.displayPalettes()}
        </div>
      </div>
    );
  }
}
