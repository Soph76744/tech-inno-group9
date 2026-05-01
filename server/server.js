const express = require("express");
const path = require("path");
require("dotenv").config();

const { sequelize } = require("./database");

const Log = require("./models/Log");

const toolRoutes = require("./routes/tools");

const faultRoutes = require("./routes/faults");

const app = express();

const cors = require("cors");

app.use(cors({
  origin: "http://localhost:5173" // React dev server
}));

app.use(express.json());
app.use(express.static("../client/dist"));

// Optional request logging (good for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// API routes
app.use("/api/tools", toolRoutes);

app.use("/api/faults", faultRoutes);

app.get("/api/logs", async (req, res) => {
  try {
    const logs = await Log.findAll();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "static/index.html"));
});

app.get("/ar", (req, res) => {
  res.sendFile(path.join(__dirname, "static/ar.html"));
});

app.get("/faults", (req, res) => {
  res.sendFile(path.join(__dirname, "static/faults.html"));
});

// Health
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Favicon fix
app.get("/favicon.ico", (req, res) => res.status(204));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Unexpected server error" });
});

// Start server
const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});