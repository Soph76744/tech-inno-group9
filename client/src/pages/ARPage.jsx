
import "aframe";
import React, { useEffect, useState } from "react";

// AR components
import ARTopPanel from "../components/ar/ARTopPanel";
import ARScene from "../components/ar/ARScene";
import ARBottomPanel from "../components/ar/ARBottomPanel";

// AR page: loads AR, shows status, has system logs, shows current tool, fault data, action buttons, detailed fault info toggle, AR marker visibility 
// Does not give duplicate fault notifications, allows switchibg between fault/tool detection mode and cycles through the tools
export default function ARPage() {
  const [arReady, setArReady] = useState(false);
  const [status, setStatus] = useState("INITIALISING SYSTEM...");
  const [logs, setLogs] = useState([]);
  const [tool, setTool] = useState(null);
  const [fault, setFault] = useState({});
  const [showControls, setShowControls] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [markerVisible, setMarkerVisible] = useState(false);
  const [lastFaultId, setLastFaultId] = useState(null);
  const [mode, setMode] = useState("tool");
  const [toolIndex, setToolIndex] = useState(0);

  // Shows current date
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // Styling and formating for tools
  const toolColours = {
    available: "#00ffb3",
    "in-use": "#ffc400",
    missing: "#ff4d4d",
  };

  const toolLabels = {
    available: "AVAILABLE",
    "in-use": "IN USE",
    missing: "MISSING",
  };
// Navigation styling
  const linkStyle = {
    color: "white",
    textDecoration: "none",
    padding: "8px 16px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.1)",
    fontSize: "13px",
    fontWeight: "500",
    transition: "0.3s",
  };
// Loads AR.js script and checks if it already exists
  useEffect(() => {
    const existingScript = document.querySelector(
      'script[src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"]'
    );
    if (existingScript) {
      setArReady(true);
      return;
    }
    // Adds AR to page
    const script = document.createElement("script");
    script.src =
      "https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js";
    script.async = true;
    script.onload = () => setArReady(true);
    document.body.appendChild(script); 
  }, []);

  // Adds event messages to system log panel on bottom: continuous updates
  function logEvent(msg, type = "info") {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => {
      const updated = [
        ...prev,
        {
          text: `[${time}] ${msg}`,
          type,
        },
      ];
      return updated.slice(-12);
    });
  }
// Goes to next tool
  function nextTool() {
    setToolIndex((prev) => prev + 1);
  }
// Goes to previous tool 
  function previousTool() {
    setToolIndex((prev) => (prev === 0 ? 0 : prev - 1));
  }
// Loads tools from backend 
  async function loadTool() {
    try {
      const res = await fetch("/api/tools", {
        credentials: "include",
      });
      // If tool load fails
      if (!res.ok) {
        throw new Error("Tool request failed");
      }
      // Response converted to JSON
      const tools = await res.json();
      // Only valid tool statuses
      const valid = (tools || []).filter((t) =>
        ["available", "in-use", "missing"].includes(t.status)
      );
      // Handling when there are no tools existing
      if (!valid.length) {
        setTool(null);
        logEvent("No valid tools detected", "warn");
        return;
      }
      const safeIndex = toolIndex % valid.length; 

      const t = valid[safeIndex]; // Selected tool
      setTool(t); // Saved to state

      // AR box object
      const box = document.querySelector("#toolBox");
      // Updating the material of the AR box shown on screen
      if (box) {
        box.setAttribute("material", {
          color: toolColours[t.status],
          metalness: 0.95,
          roughness: 0.15,
          emissive: toolColours[t.status],
          emissiveIntensity: 0.35,
        });
      }
    // Logging tool entry + errors if applicable
      logEvent(`Tool synced: ${t.name}`, "tool");
    } catch (err) {
      console.error(err);
      logEvent("Tool loading failed", "warn");
    }
  }
  // Updating tool status in backend through patch requests - stops if no tool selected
  async function updateTool(statusValue) {
    if (!tool) return;
    try {
      const res = await fetch(`/api/tools/${tool.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: statusValue,
        }),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Tool update failed");
      }
      logEvent(`Tool status updated → ${statusValue}`, "tool");

      loadTool(); // Reloading tools after updates
    } catch (err) {
      console.error(err);
      logEvent("Tool update failed", "warn");
    }
  }

  // Loading fault from backend
  async function loadFault() {
    try {
      // Automatic fault detection 
      await fetch("/api/faults/system/detect", {
        credentials: "include",
      });
      // Fetching fault logs with error handling
      const logsRes = await fetch("/api/fault-logs", {
        credentials: "include",
      });

      if (!logsRes.ok) {
        throw new Error("Could not load fault logs");
      }
      const logsData = await logsRes.json();
      // For when no fault logs exist: empty array
      if (!Array.isArray(logsData) || logsData.length === 0) {
        setFault({});
        return;
      }
      // Finds the first unresolved fault
      const activeFault =
        logsData.find((f) => !f.resolved) || logsData[0];
      // Fault info is saved in state
      setFault({
        FaultName: activeFault.faultName,
        Severity: activeFault.severity,
        ServiceType: activeFault.serviceType,
        ToolsNeeded: activeFault.toolsNeeded,
        Description: activeFault.description,
      });

      // AR fault detection sphere object
      const sphere = document.querySelector("#faultSphere");
      if (!sphere) return;
      // Styling: including colour changing for severity and pulse animation
      let colour = "#00ff88";
      if (activeFault.severity === "CRITICAL") {
        colour = "#ff2222";
        sphere.setAttribute(
          "animation__pulse",
          `
          property: scale;
          dir: alternate;
          dur: 700;
          loop: true;
          to: 1.2 1.2 1.2
        `
        );
      } else if (activeFault.severity === "HIGH") {
        colour = "#ff5500";
        sphere.removeAttribute("animation__pulse");
      } else if (activeFault.severity === "MEDIUM") {
        colour = "#ffbb00";
        sphere.removeAttribute("animation__pulse");
      } else if (activeFault.severity === "LOW") {
        colour = "#ffee55";
        sphere.removeAttribute("animation__pulse");
      }
      sphere.setAttribute(
        "material",
        `
        color:${colour};
        opacity:0.55;
        wireframe:true
      `
      );
      // Preventing duplicate fault notifcations
      if (lastFaultId !== activeFault.id) {
        logEvent(`Fault detected: ${activeFault.faultName}`, "warn");
        setLastFaultId(activeFault.id);
      }
    } catch (err) {
      console.error(err);
      logEvent("Fault system offline", "warn");
    }
  }

  // Only runs when AR is ready
  useEffect(() => {
    if (!arReady) return;
    loadTool();
    loadFault();
    logEvent("AR maintenance system online");
    // Auto refreshes
    const interval = setInterval(() => {
      loadFault();
      loadTool();
    }, 5000);

    // AR marker tracking events
    const setupMarkerEvents = () => {
      const marker = document.querySelector("#mainMarker");
      if (!marker) return;
      marker.addEventListener("markerFound", () => {
        setMarkerVisible(true);
        setShowControls(true);
        setStatus(`${mode.toUpperCase()} MODE ACTIVE`);
        logEvent(`Marker detected in ${mode} mode`, "tool");
      });
      // When marker is lost:
      marker.addEventListener("markerLost", () => {
        setMarkerVisible(false);
        setShowControls(false);
        setShowDetails(false);
        setStatus("MARKER LOST");
        logEvent("Marker tracking lost", "warn");
      });
    };

    setTimeout(setupMarkerEvents, 500); // delay so setup slightly so scene fully loads

    return () => clearInterval(interval); // cleanup interval
  }, [arReady, mode, toolIndex]);

  // Main AR page UI 
  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <ARTopPanel
        status={status}
        linkStyle={linkStyle}
        tool={tool}
        showControls={showControls}
        mode={mode}
        setMode={setMode}
        updateTool={updateTool}
        previousTool={previousTool}
        nextTool={nextTool}
      />

      <ARBottomPanel
        markerVisible={markerVisible}
        mode={mode}
        showDetails={showDetails}
        setShowDetails={setShowDetails}
        today={today}
        fault={fault}
        logs={logs}
      />

      <ARScene
        arReady={arReady}
        mode={mode}
        tool={tool}
        fault={fault}
        showDetails={showDetails}
        toolColours={toolColours}
        toolLabels={toolLabels}
      />
    </div>
  );
}
