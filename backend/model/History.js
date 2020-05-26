const mongo = require("mongoose");

// user schema for login
const paletteHistory = new mongo.Schema({
  username: {
    type: String,
    required: true,
    min: 5,
  },
  hexArray: { type: Array },
  date: {
    type: Date,
    default: Date.now,
  },
});

var History = mongo.model("History", paletteHistory);

module.exports = { History: History };
