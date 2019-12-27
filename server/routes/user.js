const express = require("express");
const router = express.Router();

// get user data
router.get("/current-user", (req, res) => {
  console.log("users");
  res.send("nice");
});

// login
router.get("/login", (req, res) => {
  res.send("Login");
});

// logout
router.get("/logout", (req, res) => {
  res.send("logout");
});

// sign up
router.post("/signup", (req, res) => {
  console.log("CREATE NEW USER");
  res.send("create");
});

// sign up with (with token)
router.get("/signup/:token", (req, res) => {
  res.send("sign up w/ token", req.params.token);
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
