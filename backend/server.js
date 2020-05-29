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
  { useUnifiedTopology: true, useNewUrlParser: true },
  () => console.log("connected to DB!"));
mongo.set("useCreateIndex", true);

app.get("/", (req, res) => {
  res.json({
    message: "success",
  });
});

app.get("/palette", async (req, res) => {
  // find encoded user 
  let decodedUser = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);

  await User.findById(decodedUser._id, (err, user) => {
    if (err) res.json("error");

    // check is user exists ?

    res.json(user);
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
    if (err) res.json("error");

    // user found/exists
    if (user) {
      // validation passwords match
      if (bcrypt.compareSync(req.body.password, user.password)) {

        // retrieve user
        const loggedUser = {
          _id: user._id,
          username: user.username,
          password: user.password,
          palette: user.palette,
          date: user.date
        };

        // jwt token
        let token = jwt.sign(loggedUser, process.env.SECRET_KEY, {
          expiresIn: 1440
        });

        res.json({
          message: "success",
          token: token
        });
      }

      // password does not match
      else {
        res.json("password_invalid");
      }
    }
    // user does not exists
    else {
      res.json("not_exists");
    }
  });
});

app.post("/register", (req, res) => {
  // insert into db
  User.findOne({ username: req.body.username }, async (err, user) => {

    if (err) res.json(err);

    // user not found => save user
    if (!user) {
      // hash password ***
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {

        if (err) res.json(err);

        // create user
        const newUser = new User({
          username: req.body.username,
          password: hashedPassword,
        });

        // save user in db
        await newUser.save(() => {
          res.json("success");
        });
      })
    }

    // user already exists
    else {
      res.json("exists");
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

app.delete("/profile/:id", (req, res) => {
  User.findByIdAndDelete(req.params.id, (err, data) => {
    if (err) res.json("error");

    res.json("success");
  });
});

// update username from profile
app.put("/profile/username/:id", async (req, res) => {
  await User.exists({ username: req.body.username }, function (err, user) {
    if (err) {
      res.send(err);
    } else {
      // username already exists
      if (user) {
        res.json("exists");
      } else {
        // update
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
      }
    }
  });
});

// update password from profile
app.put("/profile/password/:id", (req, res) => {
  User.findByIdAndUpdate({ _id: req.params.id }, { password: req.body.password }, (err, user) => {
    if (err) {
      res.json(err);
    }

    res.json("success");
  }
  );
});

app.listen(5000, () => console.log("listening on port 5000"));
