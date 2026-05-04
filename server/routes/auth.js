const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../models/User");

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findByPk(username);

  if (!user) {
    return res.status(401).json({ error: "Invalid username" });
  }

  let match = false;

  if (user.password.startsWith("$2b$")) {
    match = await bcrypt.compare(password, user.password);
  } else {
    // fallback for plain text (dev only)
    match = password === user.password;
  }

  if (!match) {
    return res.status(401).json({ error: "Invalid password" });
  }

  req.session.user = user.username;

  res.json({ message: "Login successful" });
});

// Logout
router.post("/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out" });
});

// Check session
router.get("/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not logged in" });
  }

  res.json({ user: req.session.user });
});

module.exports = router;