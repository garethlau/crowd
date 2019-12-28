const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  classes: Array,
  isVerified: Boolean,
  createAccountToken: String,
  createAccountExpires: String,
  resetPasswordToken: String,
  resetPasswordExpires: String
});

UserSchema.methods.generateHash = password => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = (password, hash) => {
  /*
   *   @param {String}   password    Password entered by the user
   *   @param {String}   hash        Hashed password saved to the user
   */
  return bcrypt.compareSync(password, hash);
};

module.exports = mongoose.model("User", UserSchema);
