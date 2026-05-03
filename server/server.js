const express = require("express");
const path = require("path");
require("dotenv").config();

const { sequelize } = require("./database");

const Log = require("./models/Log");
const User = require("./models/User");

const toolRoutes = require("./routes/tools");
const faultRoutes = require("./routes/faults");
const authRoutes = require("./routes/auth");

const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcrypt");

const app = express();

/* ---------------- MIDDLEWARE ---------------- */

// CORS (must be BEFORE routes)
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// JSON
app.use(express.json());

// SESSION (must be BEFORE routes)
app.use(session({
  secret: "secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 30,
    sameSite: "lax",
    secure: false
  }
}));

// Debug logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

/* ---------------- AUTH MIDDLEWARE ---------------- */

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

/* ---------------- API ROUTES ---------------- */

app.use("/api/auth", authRoutes);
app.use("/api/tools", requireAuth, toolRoutes);
app.use("/api/faults", requireAuth, faultRoutes);

app.get("/api/logs", async (req, res) => {
  try {
    const logs = await Log.findAll();
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------------- REACT FRONTEND ---------------- */

// ✅ FIXED PATH (THIS WAS WRONG BEFORE)
const clientPath = path.join(__dirname, "../client/dist");

// Serve static React build
app.use(express.static(clientPath));

// Catch-all (ONLY for non-API routes)
app.use((req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "API route not found" });
  }

  res.sendFile(path.join(clientPath, "index.html"));
});

/* ---------------- ERROR HANDLER ---------------- */

app.use((err, req, res, next) => {
  console.error("FULL ERROR:", err);
  res.status(500).json({ error: err.message });
});

/* ---------------- START SERVER ---------------- */

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.sync();

    // ✅ SAFE USER SEED
    const existing = await User.findByPk("admin");

    if (!existing) {
      const hash = await bcrypt.hash("password123", 10);

      await User.create({
        username: "admin",
        password: hash
      });

      console.log("Default admin user created");
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("SERVER START FAILED:", err);
  }
}

startServer();