const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
router.get("/home", authMiddleware, (req, res) => {
  res.render("home");
});

module.exports = router;