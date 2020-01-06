const express = require("express");
const router = express.Router();

router.use("/api/v1/user", require("./user.js"));
router.use("/api/v1/resource", require('./resource'));
//router.use("/api/v1/content", require("./content.js"))
router.use("/api/v1/comment", require("./comment.js"));
module.exports = router;
