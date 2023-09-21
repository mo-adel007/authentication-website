const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

// Signup page
router.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

router.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    await newUser.save();
    res.redirect("/login");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login page
router.get("/login", (req, res) => {
  res.render("login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

// Profile page
router.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect("/login");
  } else {
    res.render("profile.ejs", { user: req.user });
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = router;
