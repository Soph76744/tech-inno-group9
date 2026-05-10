const express = require("express");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// Importing database models and connection
const { sequelize } = require("./database");

const Log = require("./models/Log");
const User = require("./models/User");

// Routes imported
const toolRoutes = require("./routes/tools");
const faultRoutes = require("./routes/faults");
const authRoutes = require("./routes/auth");

// Middleware packages
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcrypt");

const app = express();

// Pathing to fault logs JSON file, if faultLogs.json does not exist it makes one
const faultLogsPath = path.join(__dirname, "faultLogs.json");

function ensureFaultLogsFile() {
  if (!fs.existsSync(faultLogsPath)) {
    fs.writeFileSync(faultLogsPath, "[]");
  }
}
// Reads fault logs from JSON file
function readFaultLogs() {
  ensureFaultLogsFile();

  const raw = fs.readFileSync(faultLogsPath, "utf8");

  if (!raw.trim()) {
    return [];
  }

  return JSON.parse(raw);
}
// Saves updated fault logs
function writeFaultLogs(logs) {
  fs.writeFileSync(faultLogsPath, JSON.stringify(logs, null, 2));
}

// Middleware - for secure authentication
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
// Middleware: Protects routes from unauthorised users
function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorised" });
  }
  next();
}
// Middlware: Role based access control
function requireRole(role) {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorised" });
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
app.use("/api/faults", requireAuth, faultRoutes);

// Audit logs route
app.get("/api/logs", async (req, res) => {
  try {
    const logs = await Log.findAll({
      order: [["createdAt", "DESC"]],
      limit: 200
    });
    // Access / Authentication Logs
    const accessLogs = logs.filter(log =>
      log.type === "access" ||
      log.type === "authentication"
    );
    // Tool Modification Logs
    const toolLogs = logs.filter(log =>
      log.tool_id !== null
    );

    res.json({
      accessLogs,
      toolLogs
    });

  } catch (err) {
    console.error("Log Route Error:", err);

    res.status(500).json({
      error: "Failed to load logs"
    });
  }
});

// Creating a fault log
app.post("/api/fault-logs", requireAuth, (req, res) => {
  try {
    const logs = readFaultLogs();
    const faultName =
      req.body.faultName ||
      req.body.FaultName ||
      "Unknown Fault";
    // Handling duplicate faults
    const alreadyActive = logs.find(
      (log) => log.faultName === faultName && log.resolved === false
    );
    if (alreadyActive) {
      return res.json(alreadyActive);
    }
    // Creates a new fault object with details, at current time
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
    // Saves fault log
    logs.unshift(newLog);
    writeFaultLogs(logs);
    // Error checking
    return res.status(201).json(newLog);
  } catch (err) {
    console.error("Fault log creation error:", err);

    return res.status(500).json({
      error: "Failed to create fault log",
    });
  }
});

// Marking a fault as resolved through patching
app.patch(
  "/api/fault-logs/:id/resolve",
  requireAuth,
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
      // Updates fault status
      log.resolved = true;
      log.resolvedAt = new Date().toISOString();
      writeFaultLogs(logs);

      return res.json(log);
    } catch (err) {
      console.error("Fault resolve error:", err);

      return res.status(500).json({
        error: "Failed to resolve fault",
      });
    }
  }
);

// Gets all fault logs
app.get("/api/fault-logs", requireAuth, (req, res) => {
  try {
    ensureFaultLogsFile();
    const raw = fs.readFileSync(faultLogsPath, "utf8");
    // Empty file safety
    if (!raw.trim()) {
      return res.json([]);
    }
    const logs = JSON.parse(raw);
    // newest faults first
    logs.sort(
      (a, b) =>
        new Date(b.detectedAt) - new Date(a.detectedAt)
    );
    return res.json(logs);

  } catch (err) {
    console.error("Fault log read error:", err);

    return res.status(500).json({
      error: "Could not load fault logs"
    });
  }
});

// React Frontend
const clientPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientPath));
app.use((req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "API route not found" });
  }

  res.sendFile(path.join(clientPath, "index.html"));
});
// Error handling
app.use((err, req, res, next) => {
  console.error("Full Error:", err);
  res.status(500).json({ error: err.message });
});
// Creates default users
async function createUserIfNotExists(username, password, role) {
  const existing = await User.findByPk(username);

  if (!existing) {
    const hash = await bcrypt.hash(password, 10); // hashing using bcrypt
    await User.create({
      username,
      password: hash,
      role,
    });

    console.log(`Default ${role} user created: ${username}`);
  }
}

const PORT = process.env.PORT || 3000; // Server port

// Starts express server + database
async function startServer() {
  try {
    await sequelize.sync({ alter: true }); // synchronise database tables
    // Default accounts created
    await createUserIfNotExists("admin", "password123", "admin");
    await createUserIfNotExists("engineer1", "password456", "engineer");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Server start failed:", err);
  }
}

startServer();