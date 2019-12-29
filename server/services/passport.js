const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoose = require("mongoose");
const User = mongoose.model("User");

const keys = require("../config/keys");
const mailjet = require("node-mailjet").connect(
  keys.mailjetKey,
  keys.mailjetSecret
);
const crypto = require("crypto");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use("local-login", new LocalStrategy({
    usernameField: 'email',
    passwordField:"password",
    passReqToCallback: true,
}, (req, email, password, done) => {
    User.findOne({email, email}, (err, user) => {
        if (err) return done(err);
        if (!user) {
            return done(null, false, {message: "User does not exist."})
        }
        const hash = user.password;
        if (!user.validPassword(password, hash)) {
            return done(null, false, {message: "Incorrect password."});
        }
        return done(null, user, {message: "Logged in."})
    })
}))


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
          return done(null, false, { message: "Email already is being used." });
        } else {
          // check if email is edu

          // generate token
          const buf = crypto.randomBytes(256);
          const token = buf.toString("hex");
          // send verification email
          const htmlContent = `Use this token to verify your email: ${token}`;

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
                Subject: "Please verify your email",
                TextPart: "",
                HTMLPart: htmlContent,
                CustomID: ""
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
          newUser.email = email;
          newUser.password = newUser.generateHash(password);
          newUser.firstName = firstName;
          newUser.lastName = lastName;
          newUser.classes = [];
          newUser.isVerified = false;
          newUser.createAccountToken = token;
          newUser.createAccountExpires = Date.now() + (1 * 60 * 60 * 1000);
          newUser.resetPasswordToken = "";
          newUser.resetPasswordExpires = "";
          newUser
            .save()
            .then(savedUser => {
              console.log("Saved user", savedUser);
              return done(null, savedUser, { message: "User signed up." });
            })
            .catch(err => {
              console.log("error saving user.");
              return done(null, false, { message: "Error saving user." });
            });
        }
      });
    }
  )
);
