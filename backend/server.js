const express = require("express");
const cors = require("cors");
const mongo = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// load schemas
const User = require("./model/User").User;
const History = require("./model/History").History;
require("dotenv/config");

const app = express();
app.use(cors());
app.use(express.json());

// connect to mongoDB
mongo.connect(process.env.DB_CONNECTION,
  { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false },
  () => console.log("connected to DB!"));
mongo.set("useCreateIndex", true);

app.get("/", (req, res) => {
  res.json({
    message: "success",
  });
});

app.get("/palette", async (req, res) => {
  // find encoded user 
  let decodedUser = jwt.verify(req.headers['authorization'].split(' ')[1], process.env.SECRET_KEY);

  await User.findById(decodedUser._id, (err, user) => {
    if (err) res.json("error");

    // check is user exists ?
    res.send(user);
  });
});

// send every palette to community
app.get("/community", async (req, res) => {
  await History.find({}, (err, users) => {
    if (err) res.json(err);

    res.json(users);
  });
});

app.get("/profile", (req, res) => {
  // find encoded user
  let decodedUser = jwt.verify(req.headers['authorization'].split(' ')[1], process.env.SECRET_KEY); // check if expired

  User.findById(decodedUser._id, (err, user) => {
    if (err) res.json("error");

    res.json(user);
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

            // retrieve user
            const loggedUser = {
              _id: user2._id,
              username: user2.username,
              password: user2.password,
              palette: user2.palette,
              date: user2.date
            };

            // generate jwt token
            let token = jwt.sign(loggedUser, process.env.SECRET_KEY, {
              expiresIn: 1440
            });

            res.json({
              message: "success",
              token: token
            });
          }
        }
      );
    }
  });
});

app.post("/register", (req, res) => {
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

app.post("/palette", (req, res) => {
  // find encoded user
  let decodedUser = jwt.verify(req.headers['authorization'].split(' ')[1], process.env.SECRET_KEY); // check if expired

  // retrieve info
  const body = {
    hexArray: req.body.codeArray,
    name: req.body.name,
  };

  // find user and push palette
  User.findById(decodedUser._id, async (err, user) => {
    if (user != null) {
      // save to all time history
      const newItem = new History({
        username: user.username,
        hexArray: body.hexArray,
      });
      const updateHistory = await newItem.save();

      // verify if name exists
      for (let i = 0; i < user.palette.length; i++) {
        if (user.palette[i].name == body.name) {
          res.json("exists");
          return;
        }
      }

      // if reached here, it means the name doesn't not exist
      user.palette.push(body);
      user.save();
      res.json("success");
    }
  });
});

// delete specific palette
app.delete("/palette/:paletteId", (req, res) => {
  // find encoded user
  let decodedUser = jwt.verify(req.headers['authorization'].split(' ')[1], process.env.SECRET_KEY); // check if expired

  User.findById(decodedUser._id, async (err, user) => {
    for (let i = 0; i < user.palette.length; i++) {
      // palette found
      if (user.palette[i]._id == req.params.paletteId) {
        // delete palette
        user.palette.remove(user.palette[i]._id);
        user.save(() => {
          res.json("deleted");
        });
      }
    }
  });
});

app.delete("/profile", (req, res) => {
  // find encoded user
  let decodedUser = jwt.verify(req.headers['authorization'].split(' ')[1], process.env.SECRET_KEY); // check if expired

  User.findByIdAndDelete(decodedUser._id, (err, data) => {
    if (err) res.json("error");

    res.json("success");
  });
});

// update username from profile
app.put("/profile/username", async (req, res) => {
  // find encoded user
  let decodedUser = jwt.verify(req.headers['authorization'].split(' ')[1], process.env.SECRET_KEY); // check if expired

  await User.exists({ username: req.body.username }, function (err, user) {
    if (err) {
      res.send(err);
    } else {
      // username already exists
      if (user) {
        res.json("exists");
      } else {
        // update
        User.findByIdAndUpdate({ _id: decodedUser._id }, { username: req.body.username }, (err, user) => {
          if (err) {
            res.json(err);
          }

          res.json("success");
        }
        );
      }
    }
  });
});

// update password from profile
app.put("/profile/password", (req, res) => {
  // find encoded user
  let decodedUser = jwt.verify(req.headers['authorization'].split(' ')[1], process.env.SECRET_KEY); // check if expired

  User.findByIdAndUpdate({ _id: decodedUser._id }, { password: req.body.password }, (err, user) => {
    if (err) {
      res.json(err);
    }

    res.json("success");
  }
  );
});

app.listen(5000, () => console.log("listening on port 5000"));
