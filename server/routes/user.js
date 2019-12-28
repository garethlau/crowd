const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("User");

// get user data
router.get("/current", (req, res) => {
  res.send({user: req.user});
});

// login
router.post("/login", (req, res, next) => {
    passport.authenticate('local-login', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            res.send({message: info.message})
        }
        else {
            req.login(user, (err) => {
                if (err) return next(err)
                res.send({message: info.message})
            })
        }
    })(req, res, next);
});

// logout
router.get("/logout", (req, res) => {
  res.send("logout");
});

// sign up
router.post("/signup", (req, res, next) => {
  console.log(req.body);
  console.log("CREATE NEW USER");
  passport.authenticate("local-signup", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // a user with the same email already exists
      res.send({ message: info.message });
    } else {
      req.login(user, err => {
        if (err) return next(err);
        res.send({ message: info.message });
      });
    }
  })(req, res, next);
});

// sign up with (with token)
router.get("/signup/:token", (req, res) => {
  console.log("sign up w/ token", req.params.token);
  const token = req.params.token;
  User.findOne(
    { createAccountToken: token, createAccountExpires: { $gt: Date.now() } },
    (err, user) => {
      if (err) {
        console.log("There was an err", err);
        res.send({ message: "There was an error" });
      }
      if (!user) {
        console.log("Password token is invalid or expired");
        res.send({ message: "Invalid token" });
      } else {
        user.isVerified = true;
        user.createAccountToken = "";
        user.createAccountExpires = "";
        user
          .save()
          .then(savedUser => {
            console.log("user verified");
            res.send({ message: "nice" });
          })
          .catch(err => {
            console.log("There was an errorr");
            res.send({ message: err });
          });
      }
    }
  );
});

// reset password
router.post("/reset-password", (req, res) => {
  res.send("reset password");
});

// reset password (with token)
router.get("/reset-password/:token", (req, res) => {
  res.send("reset password w/ token", req.params.token);
});

module.exports = router;
