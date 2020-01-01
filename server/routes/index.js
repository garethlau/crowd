const express = require("express");
const router = express.Router();

router.use("/api/v1/user", require("./user.js"));
router.use("/api/v1/content", require("./content.js"))
module.exports = router;
