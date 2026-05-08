const express = require("express");
const path = require("path");
const fs = require("fs");
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

const faultLogsPath = path.join(__dirname, "faultLogs.json");

function ensureFaultLogsFile() {
  if (!fs.existsSync(faultLogsPath)) {
    fs.writeFileSync(faultLogsPath, "[]");
  }
}

function readFaultLogs() {
  ensureFaultLogsFile();

  const raw = fs.readFileSync(faultLogsPath, "utf8");

  if (!raw.trim()) {
    return [];
  }

  return JSON.parse(raw);
}

function writeFaultLogs(logs) {
  fs.writeFileSync(faultLogsPath, JSON.stringify(logs, null, 2));
}

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 30,
      sameSite: "lax",
      secure: false,
    },
  })
);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.session.user.role !== role) {
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  };
}

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tools", requireAuth, toolRoutes);
app.use("/api/faults", requireAuth, requireRole("admin"), faultRoutes);

app.get("/api/logs", requireAuth, async (req, res) => {
  try {
    const logs = await Log.findAll();
    res.json(logs);
  } catch (err) {
    console.error("LOG READ ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// READ ALL FAULT LOGS
app.get("/api/fault-logs", requireAuth, requireRole("admin"), (req, res) => {
  try {
    const logs = readFaultLogs();
    return res.json(logs);
  } catch (err) {
    console.error("FAULT LOG READ ERROR:", err);

    return res.status(500).json({
      error: "Failed to load fault logs",
    });
  }
});

// CREATE FAULT LOG
app.post("/api/fault-logs", requireAuth, requireRole("admin"), (req, res) => {
  try {
    const logs = readFaultLogs();

    const faultName =
      req.body.faultName ||
      req.body.FaultName ||
      "Unknown Fault";

    const alreadyActive = logs.find(
      (log) => log.faultName === faultName && log.resolved === false
    );

    if (alreadyActive) {
      return res.json(alreadyActive);
    }

    const newLog = {
      id: Date.now(),
      faultName,
      severity:
        req.body.severity ||
        req.body.Severity ||
        "MEDIUM",
      serviceType:
        req.body.serviceType ||
        req.body.ServiceType ||
        "Inspection",
      toolsNeeded:
        req.body.toolsNeeded ||
        req.body.ToolsNeeded ||
        "Standard toolkit",
      description:
        req.body.description ||
        req.body.Description ||
        "No description available",
      detectedAt: new Date().toISOString(),
      resolved: false,
    };

    logs.unshift(newLog);
    writeFaultLogs(logs);

    return res.status(201).json(newLog);
  } catch (err) {
    console.error("FAULT LOG CREATE ERROR:", err);

    return res.status(500).json({
      error: "Failed to create fault log",
    });
  }
});

// RESOLVE FAULT LOG
app.patch(
  "/api/fault-logs/:id/resolve",
  requireAuth,
  requireRole("admin"),
  (req, res) => {
    try {
      const logs = readFaultLogs();

      const log = logs.find(
        (l) => Number(l.id) === Number(req.params.id)
      );

      if (!log) {
        return res.status(404).json({
          error: "Fault not found",
        });
      }

      log.resolved = true;
      log.resolvedAt = new Date().toISOString();

      writeFaultLogs(logs);

      return res.json(log);
    } catch (err) {
      console.error("FAULT RESOLVE ERROR:", err);

      return res.status(500).json({
        error: "Failed to resolve fault",
      });
    }
  }
);

// React Frontend
const clientPath = path.join(__dirname, "../client/dist");

app.use(express.static(clientPath));

app.use((req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "API route not found" });
  }

  res.sendFile(path.join(clientPath, "index.html"));
});

app.use((err, req, res, next) => {
  console.error("FULL ERROR:", err);
  res.status(500).json({ error: err.message });
});

async function createUserIfNotExists(username, password, role) {
  const existing = await User.findByPk(username);

  if (!existing) {
    const hash = await bcrypt.hash(password, 10);

    await User.create({
      username,
      password: hash,
      role,
    });

    console.log(`Default ${role} user created: ${username}`);
  }
}

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.sync();

    await createUserIfNotExists("admin", "password123", "admin");
    await createUserIfNotExists("engineer1", "password456", "engineer");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("SERVER START FAILED:", err);
  }
}

startServer();
