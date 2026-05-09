/* eslint-disable react/no-unknown-property */
import "aframe";
import React, { useEffect, useState } from "react";

import ARTopPanel from "../components/ar/ARTopPanel";
import ARScene from "../components/ar/ARScene";
import ARBottomPanel from "../components/ar/ARBottomPanel";

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

  function nextTool() {
    setToolIndex((prev) => prev + 1);
  }

  function previousTool() {
    setToolIndex((prev) => (prev === 0 ? 0 : prev - 1));
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

      const safeIndex = toolIndex % valid.length;
      const t = valid[safeIndex];

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

      const logsData = await logsRes.json();

      if (!Array.isArray(logsData) || logsData.length === 0) {
        setFault({});
        return;
      }

      const activeFault =
        logsData.find((f) => !f.resolved) || logsData[0];

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
  }, [arReady, mode, toolIndex]);

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
        toolColors={toolColors}
        toolLabels={toolLabels}
      />
    </div>
  );
}
