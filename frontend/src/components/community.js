import React, { Component } from "react";
import { NavLink, withRouter } from "react-router-dom";
import "./community.css";
import "./navbar.css";
import moment from "moment";

class Community extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDataEmpty: false, // set to true if some prob occurs
      historyData: [],
      isHamburgerClicked: false,
      isMobileNavLoaded: false,
    };
  }

  componentDidMount() {
    document.querySelector("body").style.overflow = "hidden";
    this.fetchHistory();
  }

  fetchHistory() {
    fetch("https://colorpalettemern.herokuapp.com/community")
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

  openHamburger() {
    const hamburgers = document.querySelectorAll(".com_hamburger span");

    hamburgers.forEach(span => {
      span.style.backgroundColor = "#f4f3ef";
    });
    document.querySelector(".com_mobile_nav").style.display = "flex";
    document.querySelector(".com_mobile_nav").classList.remove("nav_slide_in");
    document.querySelector(".com_mobile_nav").classList.add("nav_slide_out");

  }

  closeHamburger() {
    const hamburgers = document.querySelectorAll(".com_hamburger span");

    if (this.state.isMobileNavLoaded) {

      hamburgers.forEach(span => {
        span.style.backgroundColor = "#849994";
      });

      document.querySelector(".com_mobile_nav").classList.remove("nav_slide_out");
      document.querySelector(".com_mobile_nav").classList.add("nav_slide_in");
    }
  }

  logOut(e) {
    e.preventDefault();
    localStorage.removeItem('usertoken');
    this.props.history.push("/");
  }

  render() {
    return (
      <div className="community">
        {/* open close hamburger  */}
        <div className="com_mobile_nav">
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

        <nav className="com_nav">
          <div className="color_palette_div">
            <h1>Color Palette</h1>
          </div>

          <div className="com_hamburger"
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
        </nav>
        <div className="community_main">
          <div className="rose-com-div"></div>

          {this.state.isDataEmpty ? this.emptyCom() : this.displayPalettes()}
        </div>
      </div>
    );
  }
}

export default withRouter(Community);