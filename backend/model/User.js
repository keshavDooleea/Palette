const mongo = require("mongoose");

// user schema for login
const userSchema = new mongo.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    min: 5,
  },
  password: {
    type: String,
    required: true,
    min: 5,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

var User = mongo.model("User", userSchema);

module.exports = { User: User };
