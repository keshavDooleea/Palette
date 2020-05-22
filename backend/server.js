const express = require("express");
const cors = require("cors");
const mongo = require("mongoose");
const User = require("./model/User").User; // load schema
require("dotenv/config");

const app = express();

app.use(cors());
app.use(express.json());

// connect to mongoDB
mongo.connect(
  process.env.DB_CONNECTION,
  { useUnifiedTopology: true, useNewUrlParser: true },
  () => console.log("connected to DB!")
);
mongo.set("useCreateIndex", true);

app.get("/", (req, res) => {
  res.json({
    message: "success",
  });
});

app.get("/palette/:id", async (req, res) => {
  await User.find({ _id: req.params.id }, (err, user) => {
    if (user != null) {
      res.json(user);
    }
  });
});

// retrieve login info sent by client
app.post("/login", async (req, res) => {
  await User.findOne({ username: req.body.username }, (err, user) => {
    // user not found
    if (user == null) {
      // user does not exists
      res.json("not_exists");
    }

    // user found/exists
    else {
      // verify if password is the same
      User.findOne(
        { username: req.body.username, password: req.body.password },
        (err, user2) => {
          // password does not match
          if (user2 == null) {
            res.json("password_invalid");
          } else {
            res.json({ user2, message: "success" });
          }
        }
      );
    }
  });
});

// set up post for register to be called in register.html
// route to receive the request
// listen to a post by client
app.post("/register", (req, res) => {
  const user = {
    username: req.body.username.toString(),
    password: req.body.password.toString(),
  };

  // insert into db
  User.findOne({ username: req.body.username }, async (err, user) => {
    // user not found
    if (user == null) {
      // save to db
      try {
        const newUser = new User({
          username: req.body.username.toString(),
          password: req.body.password.toString(),
        });

        const savedUser = await newUser.save();
        console.log("saved new user!");

        // send response back to client
        res.status(200).json("success");
      } catch (err) {
        res.status(400).send(err);
      }
    }
    // user found/exists
    else {
      res.status(200).json("exists");
    }
  });
});

app.listen(5000, () => console.log("listening on port 5000"));
