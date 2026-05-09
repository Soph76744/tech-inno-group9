// Detects faults based off tool's condition
function detectFaults(tools) {
  const faults = []; // stores all detected faults

  if (!Array.isArray(tools)) {
    return faults;
  }

  // Missing tools
  const missingTools = tools.filter(
    (tool) => tool.status === "missing"
  );

  // Tools currently in use
  const inUseTools = tools.filter(
    (tool) => tool.status === "in-use"
  );

  // Fault when at least one tool is missing
  if (missingTools.length > 0) {
    faults.push({
      FaultName: "Loose Bolt",
      Severity: "MEDIUM",
      ServiceType: "Repair",
      ToolsNeeded: "Wrench, Torque Driver",
      Description:
        "Required maintenance tool is missing, creating a possible unresolved repair fault."
    });
  }

  // Fault when 2 or more tools are in use 
  if (inUseTools.length >= 2) {
    faults.push({
      FaultName: "Damaged Fuse",
      Severity: "HIGH",
      ServiceType: "Replacement",
      ToolsNeeded: "Fuse Puller, Multimeter",
      Description:
        "Multiple tools are currently in use, indicating a possible electrical maintenance issue."
    });
  }

  // Fault when 2 or more tools are missing
  if (missingTools.length >= 2) {
    faults.push({
      FaultName: "Brake Pressure Loss",
      Severity: "HIGH",
      ServiceType: "Inspection",
      ToolsNeeded: "Pressure Gauge, Wrench",
      Description:
        "Several missing tools indicate incomplete brake maintenance procedures."
    });
  }

  return faults; // Returns all detected faults
}

module.exports = {
  detectFaults
};
