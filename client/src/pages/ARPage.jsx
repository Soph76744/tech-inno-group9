/* eslint-disable react/no-unknown-property */
import "aframe";
import React, { useEffect, useState } from "react";

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

  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const toolColors = {
    available: "#00ffb3",
    "in-use": "#ffc400",
    missing: "#ff4d4d",
  };

  const toolLabels = {
    available: "AVAILABLE",
    "in-use": "IN USE",
    missing: "MISSING",
  };

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

  useEffect(() => {
    const existingScript = document.querySelector(
      'script[src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"]'
    );

    if (existingScript) {
      setArReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js";
    script.async = true;
    script.onload = () => setArReady(true);

    document.body.appendChild(script);
  }, []);

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

  async function loadTool() {
    try {
      const res = await fetch("/api/tools", {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Tool request failed");
      }

      const tools = await res.json();

      const valid = (tools || []).filter((t) =>
        ["available", "in-use", "missing"].includes(t.status)
      );

      if (!valid.length) {
        setTool(null);
        logEvent("No valid tools detected", "warn");
        return;
      }

      const t = valid[0];

      setTool(t);

      const box = document.querySelector("#toolBox");

      if (box) {
        box.setAttribute("material", {
          color: toolColors[t.status],
          metalness: 0.95,
          roughness: 0.15,
          emissive: toolColors[t.status],
          emissiveIntensity: 0.35,
        });
      }

      logEvent(`Tool synced: ${t.name}`, "tool");
    } catch (err) {
      console.error(err);
      logEvent("Tool loading failed", "warn");
    }
  }

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

      loadTool();
    } catch (err) {
      console.error(err);
      logEvent("Tool update failed", "warn");
    }
  }

  async function loadFault() {
    try {
      await fetch("/api/faults/system/detect", {
        credentials: "include",
      });

      const logsRes = await fetch("/api/fault-logs", {
        credentials: "include",
      });

      if (!logsRes.ok) {
        throw new Error("Could not load fault logs");
      }

      const logs = await logsRes.json();

      if (!Array.isArray(logs) || logs.length === 0) {
        setFault({});
        return;
      }

      const activeFault = logs.find((f) => !f.resolved) || logs[0];

      setFault({
        FaultName: activeFault.faultName,
        Severity: activeFault.severity,
        ServiceType: activeFault.serviceType,
        ToolsNeeded: activeFault.toolsNeeded,
        Description: activeFault.description,
      });

      const sphere = document.querySelector("#faultSphere");

      if (!sphere) return;

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

      if (lastFaultId !== activeFault.id) {
        logEvent(`Fault detected: ${activeFault.faultName}`, "warn");
        setLastFaultId(activeFault.id);
      }
    } catch (err) {
      console.error(err);
      logEvent("Fault system offline", "warn");
    }
  }

  useEffect(() => {
    if (!arReady) return;

    loadTool();
    loadFault();

    logEvent("AR maintenance system online");

    const interval = setInterval(() => {
      loadFault();
      loadTool();
    }, 5000);

    const setupMarkerEvents = () => {
      const marker = document.querySelector("#mainMarker");

      if (!marker) return;

      marker.addEventListener("markerFound", () => {
        setMarkerVisible(true);
        setShowControls(true);
        setStatus(`${mode.toUpperCase()} MODE ACTIVE`);
        logEvent(`Marker detected in ${mode} mode`, "tool");
      });

      marker.addEventListener("markerLost", () => {
        setMarkerVisible(false);
        setShowControls(false);
        setShowDetails(false);
        setStatus("MARKER LOST");
        logEvent("Marker tracking lost", "warn");
      });
    };

    setTimeout(setupMarkerEvents, 500);

    return () => clearInterval(interval);
  }, [arReady, mode]);

  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          position: "fixed",
          top: 14,
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(10,10,10,0.72)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(14px)",
          color: "white",
          padding: 16,
          borderRadius: 18,
          zIndex: 9999,
          minWidth: 390,
          textAlign: "center",
          boxShadow: "0 0 25px rgba(0,0,0,0.4)",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          AR MAINTENANCE SYSTEM
        </h2>

        <p
          style={{
            marginTop: 8,
            color: "#cfcfcf",
            fontSize: 14,
          }}
        >
          {status}
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            marginTop: 14,
          }}
        >
          <a href="/dashboard" style={linkStyle}>
            Dashboard
          </a>

          <a href="/tools" style={linkStyle}>
            Tools
          </a>

          <a href="/faults" style={linkStyle}>
            Faults
          </a>
        </div>

        <div style={{ marginTop: 16 }}>
          <button
            onClick={() => setMode("tool")}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "none",
              marginRight: 8,
              background: "#00c896",
              color: "white",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Tool Mode
          </button>

          <button
            onClick={() => setMode("fault")}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "none",
              background: "#ff7a00",
              color: "white",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Fault Mode
          </button>
        </div>

        {tool && showControls && mode === "tool" && (
          <div
            style={{
              marginTop: 16,
              display: "flex",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <button
              onClick={() => updateTool("in-use")}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                background: "#ffc400",
                color: "black",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Use
            </button>

            <button
              onClick={() => updateTool("available")}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                background: "#00d084",
                color: "white",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Return
            </button>

            <button
              onClick={() => updateTool("missing")}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                background: "#ff4d4d",
                color: "white",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Missing
            </button>
          </div>
        )}
      </div>

      {markerVisible && mode === "fault" && (
        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{
            position: "fixed",
            bottom: "145px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "14px 24px",
            borderRadius: "12px",
            border: "none",
            background: "rgba(20,20,20,0.85)",
            color: "white",
            backdropFilter: "blur(10px)",
            cursor: "pointer",
            zIndex: 9999,
            fontWeight: 600,
          }}
        >
          {showDetails ? "Hide Details" : "Open Fault Details"}
        </button>
      )}

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(5,5,5,0.9)",
          backdropFilter: "blur(10px)",
          color: "#e5e5e5",
          fontFamily: "Consolas, monospace",
          fontSize: 12,
          padding: "10px 14px",
          maxHeight: 115,
          overflowY: "auto",
          zIndex: 9999,
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            marginBottom: 6,
            color: "#8f8f8f",
          }}
        >
          {markerVisible
            ? `${today} | Technician: Marang | Service: ${
                fault.ServiceType || "Inspection"
              }`
            : today}
        </div>

        {logs.map((l, i) => (
          <div
            key={i}
            style={{
              color:
                l.type === "warn"
                  ? "#ff8080"
                  : l.type === "tool"
                  ? "#6fffd2"
                  : "#d7d7d7",
              marginBottom: 3,
            }}
          >
            {l.text}
          </div>
        ))}
      </div>

      {!arReady ? (
        <div>Loading AR...</div>
      ) : (
        <a-scene
          embedded
          renderer="logarithmicDepthBuffer: true;"
          arjs="sourceType: webcam; debugUIEnabled:false;"
        >
          <a-marker preset="hiro" id="mainMarker" emitevents="true">
            {mode === "tool" && tool && (
              <>
                <a-box
                  id="toolBox"
                  position="0 0.4 0"
                  scale="0.95 0.95 0.95"
                  rotation="0 45 0"
                  animation="
                    property: rotation;
                    to: 360 405 360;
                    loop: true;
                    dur: 9000;
                    easing: linear;
                  "
                />

                <a-ring
                  position="0 -0.3 0"
                  rotation="-90 0 0"
                  radius-inner="0.8"
                  radius-outer="0.95"
                  color={toolColors[tool.status]}
                  opacity="0.55"
                />

                <a-text
                  value="TOOL INTELLIGENCE SYSTEM"
                  position="0 2.1 0"
                  align="center"
                  color="#00ffd0"
                  width="4"
                />

                <a-plane
                  color="#101820"
                  opacity="0.82"
                  width="2.6"
                  height="1.7"
                  position="0 1.25 0"
                  material="shader: flat"
                >
                  <a-text
                    value={`
${tool.name || "Unknown Tool"}

Status:
${toolLabels[tool.status] || "UNKNOWN"}

ID: ${tool.id || "N/A"}

Location:
${tool.location || "Storage Bay"}

Condition:
${tool.condition || "Operational"}

Assigned:
${tool.assignedTo || "None"}

Last Used:
${tool.lastUsed || "N/A"}
                    `}
                    align="center"
                    color="#ffffff"
                    width="2"
                    wrap-count="24"
                    line-height="52"
                    position="0 0 0.01"
                  />
                </a-plane>
              </>
            )}

            {mode === "fault" && (
              <>
                <a-text
                  value="FAULT ANALYSIS"
                  position="0 2 0"
                  align="center"
                  color="#ff8855"
                  width="4"
                />

                <a-sphere
                  id="faultSphere"
                  position="0 0.35 0"
                  radius="0.38"
                  material="color:red; opacity:0.55; wireframe:true"
                />

                {!showDetails ? (
                  <a-plane
                    id="faultBox"
                    color="#1b1b1b"
                    opacity="0.82"
                    width="2.2"
                    height="1"
                    position="0 1.2 0"
                  >
                    <a-text
                      value={`
${fault.FaultName || "FAULT LOADING"}

Severity:
${fault.Severity || "UNKNOWN"}

Service:
${fault.ServiceType || "Inspection"}
                      `}
                      color="#ffffff"
                      align="center"
                      width="1.8"
                      wrap-count="20"
                      line-height="50"
                      position="0 0 0.01"
                    />
                  </a-plane>
                ) : (
                  <a-plane
                    color="#121212"
                    opacity="0.88"
                    width="2.8"
                    height="1.9"
                    position="0 1.25 0"
                  >
                    <a-text
                      value={`
FAULT:
${fault.FaultName || ""}

SEVERITY:
${fault.Severity || ""}

DESCRIPTION:
${fault.Description || "No description available"}

TOOLS REQUIRED:
${fault.ToolsNeeded || "Standard toolkit"}

SERVICE TYPE:
${fault.ServiceType || "Inspection"}
                      `}
                      color="#ffffff"
                      align="center"
                      width="2.2"
                      wrap-count="26"
                      line-height="48"
                      position="0 0 0.01"
                    />
                  </a-plane>
                )}
              </>
            )}
          </a-marker>

          <a-entity camera />
        </a-scene>
      )}
    </div>
  );
}
