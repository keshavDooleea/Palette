import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import lock from "../assets/lock.png";
import unlock from "../assets/unlock.png";
import adjust from "../assets/adjust.png";
import "./palette.css";
import "./navbar.css";
import chroma from "chroma-js";
import * as clipboard from "clipboard-polyfill/dist/clipboard-polyfill.promise";

const ShowCopiedMsg = () => {
  return (
    <div className="hexCopied">
      <p>Hex code copied</p>
    </div>
  );
};

export default class Palette extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      NB_ITEMS: 4,
      isCopied: false,
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

  // when DOM loads up
  componentDidMount() {
    this.generate();
    this.copyToClipboard();
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
    // document.querySelectorAll(".adjust")[pos].style.opacity = "1";

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
    // document.querySelectorAll(".adjust")[pos].style.opacity = "0.5";

    // hide adjust div
    document
      .querySelectorAll(".adjust_div")
      [pos].classList.remove("open_adjust_div");
    document
      .querySelectorAll(".adjust_div")
      [pos].classList.add("close_adjust_div");
  }

  assignInputColor(pos, hexCode) {
    // remove the # from hex code
    let hex = hexCode.substr(1);

    // inputs
    const hues = document.querySelectorAll(".hue");
    const brightness = document.querySelectorAll(".brightness");
    const sat = document.querySelectorAll(".saturation");

    // get current number in chroma to perform operations
    const color = chroma(hex);

    // hue color
    hues[
      pos
    ].style.backgroundImage = `linear-gradient(to right, rgb(255, 0, 0), rgb(255,255 ,0), rgb(0, 255, 0), rgb(0, 255, 255),
     rgb(0,0,255), rgb(255,0,255), rgb(255,0,0))`;

    // get chroma brightness of current color
    const lowBrightness = color.set("hsl.l", 0);
    const middleBrightness = color.set("hsl.l", 0.5);
    const highBrightness = color.set("hsl.l", 1);
    const brightnessScale = chroma.scale([
      lowBrightness,
      middleBrightness,
      highBrightness,
    ]);
    brightness[
      pos
    ].style.backgroundImage = `linear-gradient(to right, ${brightnessScale(
      0
    )}, ${brightnessScale(0.5)}, ${brightnessScale(1)})`;

    // get the lowest and highest saturation of corresponding color
    const lowSat = color.set("hsl.s", 0);
    const highSat = color.set("hsl.s", 1);
    const saturationScale = chroma.scale([lowSat, color, highSat]);
    sat[
      pos
    ].style.backgroundImage = `linear-gradient(to right, ${saturationScale(
      0
    )}, ${saturationScale(1)})`;
  }

  // adjust div hue, brightness and saturation inputs
  inputActions(pos, hexCode) {
    // remove the # from hex code
    let hex = hexCode.substr(1);
    const colors = document.querySelectorAll(".color");

    // all 3 inputs from current hex div
    const inputs = document
      .querySelectorAll(".adjust_div")
      [pos].querySelectorAll("input");

    // dragging state
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener("input", (e) => {
        let color = chroma(hex)
          .set("hsl.h", inputs[0].value)
          .set("hsl.l", inputs[1].value)
          .set("hsl.s", inputs[2].value);

        // update current background color of main div and inputs
        colors[pos].style.backgroundColor = color;

        // update hexa code on the div
        const hexa = document.querySelectorAll(".code_div h1")[pos];
        hexa.textContent = color.hex().toUpperCase();

        this.assignInputColor(pos, "#" + color);
      });
    }

    // released state
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener("change", (e) => {
        // retrieve background color
        const color = chroma(colors[pos].style.backgroundColor);
        const hex = document.querySelectorAll(".code_div h1")[pos];
        hex.textContent = color.hex().toUpperCase();
      });
    }
  }

  // update color of each inputs while dragging
  setInputRange() {
    // get all 12 inputs
    const inputs = document.querySelectorAll(".adjust_div input");

    // get all 4 hex div
    const colors = document.querySelectorAll(".color");

    // target colors of specific input
    /*
    hsl(): 
      0 equals hue
      1 equals sat
      2 equals brightness
    */
    let colorIndex = 0;
    for (let i = 0; i < inputs.length; i++) {
      // hue inputs
      if (i % 3 === 0) {
        const hue = colors[colorIndex].style.backgroundColor;
        const hueValue = chroma(hue).hsl()[0];
        inputs[i].value = Math.floor(hueValue);
      }

      // brightness inputs
      else if (i % 3 === 1) {
        const brightness = colors[colorIndex].style.backgroundColor;
        const brightnessValue = chroma(brightness).hsl()[2];
        inputs[i].value = Math.floor(brightnessValue * 100) / 100;
      }

      // saturation
      else if (i % 3 === 2) {
        const sat = colors[colorIndex].style.backgroundColor;
        const satValue = chroma(sat).hsl()[1];
        inputs[i].value = Math.floor(satValue * 100) / 100;

        // update index to target next div
        colorIndex++;
      }
    }
  }

  // illuminate current div
  lightUpDiv(pos) {
    const hexDiv = document.querySelectorAll(".hex_div")[pos];
    hexDiv.classList.add("shine_border");
    this.setState({
      isCopied: true,
    });

    setTimeout(() => {
      hexDiv.classList.remove("shine_border");
      this.setState({
        isCopied: false,
      });
    }, 2000);
  }

  // copy to clipboard feature
  copyToClipboard() {
    const hexCode = document.querySelectorAll(".code_div h1");
    const colors = document.querySelectorAll(".color");

    for (let i = 0; i < hexCode.length; i++) {
      // getting corresponding hexcode when clicked upon the hex code
      hexCode[i].addEventListener("click", (e) => {
        clipboard.writeText(e.target.textContent);
        this.lightUpDiv(i);
      });

      // when clicked on the div itself
      colors[i].addEventListener("click", (e) => {
        // selecting only parent node
        if (colors[i] !== e.target) return;

        const color = e.target.parentElement.querySelectorAll(".code_div h1");
        clipboard.writeText(color[0].textContent);
        this.lightUpDiv(i);
      });
    }
  }

  // random hex code generator
  generate() {
    const colors = document.querySelectorAll(".color");
    const colorCodes = document.querySelectorAll(".code_div h1");
    const codes = "0123456789ABCDE";
    let hex = "#";
    let randomCode = 0;

    for (let k = 0; k < this.state.NB_ITEMS; k++) {
      // if item is not locked
      if (!this.state.islocked[k]) {
        // fill up 6 codes
        for (let i = 0; i < 6; i++) {
          randomCode = Math.random() * 15;
          hex += codes[Math.floor(randomCode)];
        }

        // set up div colors
        colors[k].style.backgroundColor = hex;
        colorCodes[k].textContent = hex;
        this.assignInputColor(k, hex);
        this.inputActions(k, hex);
      }
      // re-initiate value
      hex = "#";
    }

    // update inputs
    this.setInputRange();
  }

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
            <button onClick={() => this.generate()}>Generate Colors</button>
            <button>Save Palette</button>
          </div>

          <div className="palette_main_div">
            <div className="opacity"></div>

            {/* show copied msg */}
            {this.state.isCopied ? <ShowCopiedMsg /> : null}

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
