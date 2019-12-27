const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoose = require("mongoose");
const User = mongoose.model("User");

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
          let newUser = User();
          newUser.firstName = firstName;
          newUser.lastName = lastName;
          newUser.classes = [];
          newUser.email = email;
          newUser.isVerified = false;
          newUser.createAccountToken = "";
          newUser.createAccountExpires = "";
          newUser.resetPasswordToken = "";
          newUser.resetPasswordExpires = "";
        }
        
      });
    }
  )
);
