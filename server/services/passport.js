const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoose = require("mongoose");
const User = mongoose.model("User");

const keys = require("../config/keys");
const mailjet = require("node-mailjet").connect(
  keys.mailjetKey,
  keys.mailjetSecret
);
const crypto = require('crypto')

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    (req, email, password, done) => {
      let firstName = req.body.firstName;
      let lastName = req.body.lastName;
      User.findOne({ email: email }, (err, user) => {
        if (err) return done(err);
        if (user) {
          return done(null, false, { message: "Email alrady is being used." });
        } else {
          // check if email is edu

                // generate token
                const buf = crypto.randomBytes(256);
          // send verification email
            const htmlContent = `<a href="localhost:3000/${buf}">click here to verify </a>`

          const request = mailjet.post("send", { version: "v3.1" }).request({
            Messages: [
              {
                From: {
                  Email: "Gareth.kh.lau@gmail.com",
                  Name: "Gareth"
                },
                To: [
                  {
                    Email: email,
                    Name: firstName
                  }
                ],
                Subject: "Please Verify",
                TextPart: buf,
                HTMLPart: htmlContent,
                CustomID: "nice"
              }
            ]
          });

          request
            .then(result => {
              console.log(result.body);
            })
            .catch(err => {
              console.log(err);
            });
          // create (unverified) user
          let newUser = User();
          newUser.firstName = firstName;
          newUser.lastName = lastName;
          newUser.classes = [];
          newUser.email = email;
          newUser.isVerified = false;
          newUser.createAccountToken = buf;
          newUser.createAccountExpires = "";
          newUser.resetPasswordToken = "";
          newUser.resetPasswordExpires = "";
        }
      });
    }
  )
);
