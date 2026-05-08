const express = require("express");
const router = express.Router();

const fs = require("fs");
const path = require("path");

const Fault = require("../models/Fault");
const Tool = require("../models/Tool");

const { detectFaults } = require("../services/faultDetector");

const logsPath = path.join(__dirname, "../faultLogs.json");

function ensureFaultLogFile() {
  if (!fs.existsSync(logsPath)) {
    fs.writeFileSync(logsPath, JSON.stringify([], null, 2));
  }
}

function readFaultLogs() {
  ensureFaultLogFile();

  const data = fs.readFileSync(logsPath, "utf8");

  if (!data.trim()) {
    return [];
  }

  return JSON.parse(data);
}

function writeFaultLogs(logs) {
  fs.writeFileSync(logsPath, JSON.stringify(logs, null, 2));
}

function saveFaultLog(fault) {
  const logs = readFaultLogs();

  const alreadyActive = logs.find(
    (log) =>
      log.faultName === fault.FaultName &&
      log.resolved === false
  );

  if (alreadyActive) {
    return alreadyActive;
  }

  const newLog = {
    id: Date.now(),
    faultName: fault.FaultName,
    severity: fault.Severity,
    serviceType: fault.ServiceType,
    toolsNeeded: fault.ToolsNeeded,
    description: fault.Description,
    detectedAt: new Date().toISOString(),
    resolved: false
  };

  logs.unshift(newLog);
  writeFaultLogs(logs);

  return newLog;
}

// IMPORTANT: detect route must come BEFORE /:faultName
router.get("/system/detect", async (req, res) => {
  try {
    const tools = await Tool.findAll();

    const detectedFaults = detectFaults(tools);

    if (!detectedFaults || detectedFaults.length === 0) {
      return res.json({
        detected: false,
        faults: [],
        logs: []
      });
    }

    const savedLogs = detectedFaults.map((fault) => saveFaultLog(fault));

    res.json({
      detected: true,
      faults: detectedFaults,
      logs: savedLogs
    });
  } catch (err) {
    console.error("FAULT DETECTION ERROR:", err);
    res.status(500).json({
      error: "Fault detection failed"
    });
  }
});

// Get all faults from static faults.db
router.get("/", async (req, res) => {
  try {
    const faults = await Fault.findAll();
    res.json(faults);
  } catch (err) {
    console.error("GET FAULTS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get one fault by name
router.get("/:faultName", async (req, res) => {
  try {
    const faultName = decodeURIComponent(req.params.faultName);

    const fault = await Fault.findOne({
      where: {
        FaultName: faultName
      }
    });

    if (!fault) {
      return res.status(404).json({ error: "Fault not found" });
    }

    res.json(fault);
  } catch (err) {
    console.error("GET SINGLE FAULT ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;