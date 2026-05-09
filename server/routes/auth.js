const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../models/User");
const Log = require("../models/Log");

// Login attempt tracking
const loginAttempts = {};
const MAX_ATTEMPTS = 3;
const LOCK_TIME = 5 * 60 * 1000; // 5 minutes

function isMalicious(input) {
  return /('|--|;|OR\s+1=1|DROP|SELECT)/i.test(input);
}

function handleFail(username) {
  if (!loginAttempts[username]) {
    loginAttempts[username] = { count: 1 };
  } else {
    loginAttempts[username].count++;
  }

  const record = loginAttempts[username];

  if (record.count >= MAX_ATTEMPTS) {
    record.lockUntil = Date.now() + LOCK_TIME;
    return 0;
  }

  return MAX_ATTEMPTS - record.count;
}

// Login
router.post("/login", async (req, res) => {
  try {
    let { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "All fields required",
      });
    }

    username = username.trim();
    password = password.trim();

    if (isMalicious(username) || isMalicious(password)) {
      return res.status(400).json({
        error: "Invalid input detected",
      });
    }

    const record = loginAttempts[username];

    if (record && record.lockUntil) {
      const remaining = Math.ceil(
        (record.lockUntil - Date.now()) / 1000
      );

      if (remaining > 0) {
        return res.status(429).json({
          error: "Account locked",
          remainingTime: remaining,
        });
      }

      loginAttempts[username] = { count: 0 };
    }

    const user = await User.findByPk(username);

    if (!user) {
      await Log.create({
        user: username,
        action: "Failed login",
        type: "access",
        message: `Failed login attempt for ${username}`,
      });

      handleFail(username);

      return res.status(401).json({
        error: "Invalid username",
      });
    }

    let match = false;

    if (user.password.startsWith("$2b$")) {
      match = await bcrypt.compare(password, user.password);
    } else {
      match = password === user.password;
    }

    if (!match) {
      await Log.create({
        user: username,
        action: "Failed login",
        type: "access",
        message: `Incorrect password for ${username}`,
      });

      const remainingAttempts = handleFail(username);

      if (remainingAttempts <= 0) {
        await Log.create({
          user: username,
          action: "Account locked",
          type: "access",
          message: `${username} exceeded login attempts`,
        });

        return res.status(429).json({
          error: "Too many attempts",
          remainingTime: 300,
        });
      }

      return res.status(401).json({
        error: `Invalid password (${remainingAttempts} attempts left)`,
      });
    }

    loginAttempts[username] = { count: 0 };

    req.session.user = {
      username: user.username,
      role: user.role,
    };

    await Log.create({
      user: user.username,
      action: "Login",
      type: "access",
      message: `${user.username} logged in`,
    });

    res.json({
      message: "Login successful",
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);

    res.status(500).json({
      error: "Server error",
    });
  }
});

// Logout
router.post("/logout", async (req, res) => {
  try {
    const username = req.session?.user?.username || "unknown";

    await Log.create({
      user: username,
      action: "Logout",
      type: "access",
      message: `${username} logged out`,
    });

    req.session.destroy();

    res.json({
      message: "Logged out",
    });
  } catch (err) {
    console.error("LOGOUT ERROR:", err);

    res.status(500).json({
      error: "Server error",
    });
  }
});

// Session check
router.get("/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({
      error: "Not logged in",
    });
  }

  res.json({
    user: {
      username: req.session.user.username,
      role: req.session.user.role,
    },
  });
});

module.exports = router;