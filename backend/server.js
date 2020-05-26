const express = require("express");
const cors = require("cors");
const mongo = require("mongoose");
const User = require("./model/User").User; // load schema
const History = require("./model/History").History; // load schema
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
    if (err) res.json("error");

    if (user != null) {
      res.send(user);
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

app.post("/palette/:id", (req, res) => {
  // retrieve info
  const body = {
    hexArray: req.body.codeArray,
    name: req.body.name,
  };

  // find user and push palette
  User.findById(req.params.id, async (err, user) => {
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
app.delete("/palette/:id/:paletteId", (req, res) => {
  User.findById(req.params.id, async (err, user) => {
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

app.get("/profile/:id", (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) return;

    res.json(user);
  });
});

app.delete("/profile/:id", (req, res) => {
  console.log("S");
  User.findByIdAndDelete(req.params.id, (err, data) => {
    if (err) res.json("error");

    res.json("success");
  });
});

// update username from profile
app.put("/profile/username/:id", (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.params.id },
    { username: req.body.username },
    (err, user) => {
      if (err) {
        res.json(err);
      }

      res.json("success");
    }
  );
});

// update password from profile
app.put("/profile/password/:id", (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.params.id },
    { password: req.body.password },
    (err, user) => {
      if (err) {
        res.json(err);
      }

      res.json("success");
    }
  );
});

app.listen(5000, () => console.log("listening on port 5000"));
