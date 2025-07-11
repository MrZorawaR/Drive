const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

router.get("/register", (req, res) => {
  res.render("register");
});

router.post(
  "/register",
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email address"),
  body("username").trim().notEmpty().withMessage("Username is required"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let { username, email, password } = req.body;
    // Check if user already exists
    User.findOne({ email }).then((existingUser) => {
      if (existingUser) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }
    });
    password = await hashPassword(password);

    const newUser = new User({ username, email, password });
    await newUser
      .save()
      .then(() => {
        console.log(`User registered: ${username}, Email: ${email}`);
        res.send("Registration successful");
      })
      .catch((err) => {
        console.error("Error registering user:", err);
        res.status(500).send("Internal server error");
      });
  }
);

router.get("/login", (req, res) => {
  res.render("login");
});

// Export the router
module.exports = router;
