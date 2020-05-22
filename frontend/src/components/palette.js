import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import lock from "../assets/lock.png";
import unlock from "../assets/unlock.png";
import adjust from "../assets/adjust.png";
import "./palette.css";
import "./navbar.css";

export default class Palette extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      NB_ITEMS: 4,
      islocked: [false, false, false, false],
      imgArray: [unlock, unlock, unlock, unlock],
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

  adjust(pos) {
    // set the active container to the top of the hierarchy
    document.querySelectorAll(".hex_div")[pos].classList.add("highest_index");

    // lower the opacity of other divs
    for (let i = 0; i < this.state.NB_ITEMS; i++) {
      if (i !== pos) {
        document.querySelectorAll(".hex_div")[i].style.opacity = "0.3";
      }
    }

    // overall opacity
    document.querySelector(".opacity").classList.remove("opacity_out");
    document.querySelector(".opacity").classList.add("opacity_in");

    // adjust icon opacity
    document.querySelectorAll(".adjust")[pos].style.opacity = "1";

    // show adjust div
    if (pos < 2) {
      document
        .querySelectorAll(".adjust_div")
        [pos].classList.remove("open_left");
      document.querySelectorAll(".adjust_div")[pos].classList.add("open_right");
    } else {
      document
        .querySelectorAll(".adjust_div")
        [pos].classList.remove("open_right");
      document.querySelectorAll(".adjust_div")[pos].classList.add("open_left");
    }

    document
      .querySelectorAll(".adjust_div")
      [pos].classList.remove("close_adjust_div");
    document
      .querySelectorAll(".adjust_div")
      [pos].classList.add("open_adjust_div");
  }

  closeAdjustDiv(pos) {
    // set the active container to the top of the hierarchy
    document
      .querySelectorAll(".hex_div")
      [pos].classList.remove("highest_index");

    // highen the opacity of all divs
    for (let i = 0; i < this.state.NB_ITEMS; i++) {
      document.querySelectorAll(".hex_div")[i].style.opacity = "1";
    }

    // overall opacity
    document.querySelector(".opacity").classList.remove("opacity_in");
    document.querySelector(".opacity").classList.add("opacity_out");

    // adjust icon opacity
    document.querySelectorAll(".adjust")[pos].style.opacity = "0.5";

    // hide adjust div
    document
      .querySelectorAll(".adjust_div")
      [pos].classList.remove("open_adjust_div");
    document
      .querySelectorAll(".adjust_div")
      [pos].classList.add("close_adjust_div");
  }

  generate() {}

  toggleLock(pos) {
    const lockImg = document.querySelectorAll(".unlock");

    // update array
    let updatedArray = Object.assign({}, this.state).islocked;
    updatedArray[pos] = !updatedArray[pos];
    this.setState({
      islocked: updatedArray,
    });

    // update image array and toggle lock buttons
    let newImgArray = Object.assign({}, this.state).imgArray;
    if (this.state.islocked[pos]) {
      newImgArray[pos] = lock;
      lockImg[pos].style.opacity = "1";
    } else {
      newImgArray[pos] = unlock;
      lockImg[pos].style.opacity = "0.5";
    }
    this.setState({
      imgArray: newImgArray,
    });
    console.log(this.state.islocked);
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
          <div className="actions_div">
            <button>My List</button>
            <button onClick={this.generate}>Generate Colors</button>
            <button>Save Palette</button>
          </div>

          <div className="palette_main_div">
            <div className="opacity"></div>

            {/* 0  */}
            <div className="hex_div">
              <div className="adjust_div open_right">
                <h1
                  className="close_adjust"
                  onClick={() => this.closeAdjustDiv(0)}
                >
                  x
                </h1>
                <h3>Hue</h3>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="1"
                  className="hue"
                ></input>

                <h3>Brightness</h3>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  className="brightness"
                ></input>

                <h3>Saturation</h3>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  className="saturation"
                ></input>
              </div>

              <div className="color">
                <div className="lock_adjust">
                  <img
                    src={this.state.imgArray[0]}
                    alt="unlock"
                    className="unlock"
                    onClick={() => this.toggleLock(0)}
                  ></img>
                  <img
                    src={adjust}
                    alt="adjust"
                    className="adjust"
                    onClick={() => this.adjust(0)}
                  ></img>
                </div>
              </div>
              <div className="code_div">
                <h1>#123456</h1>
              </div>
            </div>

            {/* 1 */}
            <div className="hex_div">
              <div className="adjust_div open_right">
                <h1
                  className="close_adjust"
                  onClick={() => this.closeAdjustDiv(1)}
                >
                  x
                </h1>
                <h3>Hue</h3>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="1"
                  className="hue"
                ></input>

                <h3>Brightness</h3>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  className="brightness"
                ></input>

                <h3>Saturation</h3>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  className="saturation"
                ></input>
              </div>

              <div className="color">
                <div className="lock_adjust">
                  <img
                    src={this.state.imgArray[1]}
                    alt="unlock"
                    className="unlock"
                    onClick={() => this.toggleLock(1)}
                  ></img>
                  <img
                    src={adjust}
                    alt="adjust"
                    className="adjust"
                    onClick={() => this.adjust(1)}
                  ></img>
                </div>
              </div>
              <div className="code_div">
                <h1>#123456</h1>
              </div>
            </div>

            {/* 2 */}
            <div className="hex_div">
              <div className="adjust_div open_left">
                <h1
                  className="close_adjust"
                  onClick={() => this.closeAdjustDiv(2)}
                >
                  x
                </h1>
                <h3>Hue</h3>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="1"
                  className="hue"
                ></input>

                <h3>Brightness</h3>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  className="brightness"
                ></input>

                <h3>Saturation</h3>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  className="saturation"
                ></input>
              </div>

              <div className="color">
                <div className="lock_adjust">
                  <img
                    src={this.state.imgArray[2]}
                    alt="unlock"
                    className="unlock"
                    onClick={() => this.toggleLock(2)}
                  ></img>
                  <img
                    src={adjust}
                    alt="adjust"
                    className="adjust"
                    onClick={() => this.adjust(2)}
                  ></img>
                </div>
              </div>
              <div className="code_div">
                <h1>#123456</h1>
              </div>
            </div>

            {/* 3 */}
            <div className="hex_div">
              <div className="adjust_div open_left">
                <h1
                  className="close_adjust"
                  onClick={() => this.closeAdjustDiv(3)}
                >
                  x
                </h1>
                <h3>Hue</h3>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="1"
                  className="hue"
                ></input>

                <h3>Brightness</h3>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  className="brightness"
                ></input>

                <h3>Saturation</h3>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  className="saturation"
                ></input>
              </div>

              <div className="color">
                <div className="lock_adjust">
                  <img
                    src={this.state.imgArray[3]}
                    alt="unlock"
                    className="unlock"
                    onClick={() => this.toggleLock(3)}
                  ></img>
                  <img
                    src={adjust}
                    alt="adjust"
                    className="adjust"
                    onClick={() => this.adjust(3)}
                  ></img>
                </div>
              </div>
              <div className="code_div">
                <h1>#123456</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="rose-round-div"></div>
      </div>
    );
  }
}
