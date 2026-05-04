import "aframe";
import { useEffect, useState } from "react";

export default function ARPage() {
  const [arReady, setArReady] = useState(false);
  const [status, setStatus] = useState("Starting...");
  const [logs, setLogs] = useState([]);
  const [tool, setTool] = useState(null);
  const [showControls, setShowControls] = useState(false);
  const [lastFaultId, setLastFaultId] = useState(null);

  // Load AR.js
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js";
    script.async = true;

    script.onload = () => {
      console.log("AR.js loaded");
      setArReady(true);
    };

    document.body.appendChild(script);
  }, []);

  // Log system
  function logEvent(msg, type = "info") {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [
      ...prev,
      { text: `[${time}] ${msg}`, type }
    ]);
  }

  // Tool
  async function loadTool() {
    const res = await fetch("/api/tools", {credentials: "include"});
    const tools = await res.json();
    if (!tools.length) return;

    const t = tools[0];
    setTool(t);

    const text = document.querySelector("#toolText");
    const box = document.querySelector("#toolBox");

    if (!text || !box) return;

    text.setAttribute("value", `${t.name}\n(${t.status})`);

    let colour = "#00cc66";
    if (t.status === "in-use") colour = "#f0c040";
    if (t.status === "missing") colour = "#cc3333";

    box.setAttribute("color", colour);
  }

  async function updateTool(status) {
    if (!tool) return;

    await fetch(`/api/tools/${tool.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
      credentials: "include"
    });

    loadTool();
  }

  // Fault
  async function loadFault() {
    try {
      const res = await fetch("/api/faults/detect", { credentials: "include" });
      const data = await res.json();

      const text = document.querySelector("#faultText");
      const sphere = document.querySelector("#faultSphere");

      if (!text || !sphere) return;

      if (!data.detected) {
        text.setAttribute("value", "No faults detected");
        sphere.setAttribute("material", "color:green; opacity:0.3;");

        if (lastFaultId !== "none") {
          logEvent("No faults detected");
          setLastFaultId("none");
        }
        return;
      }

      const fault = data.fault;

      text.setAttribute(
        "value",
        `${fault.type}\nSeverity: ${fault.severity}`
      );

      let colour = "red";
      if (fault.severity === "medium") colour = "orange";
      if (fault.severity === "low") colour = "yellow";

      sphere.setAttribute(
        "material",
        `color:${colour}; opacity:0.4; wireframe:true`
      );

      if (lastFaultId !== fault.id) {
        logEvent(`Fault detected: ${fault.type}`, "warn");
        setLastFaultId(fault.id);
      }

    } catch (err) {
      console.error(err);
    }
  }

  // Init after AR ready
  useEffect(() => {
    if (!arReady) return;

    loadTool();
    loadFault();
    logEvent("System ready");

    const interval = setInterval(loadFault, 5000);

    const scene = document.querySelector("a-scene");

    scene.addEventListener("loaded", () => {
      const toolMarker = document.querySelector("#toolMarker");
      const faultMarker = document.querySelector("#faultMarker");

      if (!toolMarker || !faultMarker) return;

      toolMarker.addEventListener("markerFound", () => {
        setStatus("Tool detected");
        setShowControls(true);
        logEvent("Tool marker detected");
      });

      toolMarker.addEventListener("markerLost", () => {
        setStatus("Tool lost");
        setShowControls(false);
      });

      faultMarker.addEventListener("markerFound", () => {
        setStatus("Fault detected");
        logEvent("Fault marker detected", "warn");
        loadFault();
      });

      faultMarker.addEventListener("markerLost", () => {
        setStatus("Fault lost");
      });
    });

    return () => clearInterval(interval);
  }, [arReady]);

  // UI
  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>

      {/* TOP UI */}
      <div style={{
        position: "fixed",
        top: 10,
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(0,0,0,0.7)",
        color: "white",
        padding: 12,
        borderRadius: 8,
        zIndex: 9999,
        textAlign: "center"
      }}>

        <h3>AR Maintenance</h3>
        <p>{status}</p>

        {tool && showControls && (
          <>
            <button onClick={() => updateTool("in-use")}>Use</button>
            <button onClick={() => updateTool("available")}>Return</button>
            <button onClick={() => updateTool("missing")}>Missing</button>
          </>
        )}
      </div>

      {/* LOG BAR */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "rgba(0,20,40,0.9)",
        color: "#00FF88",
        fontFamily: "monospace",
        fontSize: 12,
        padding: 10,
        maxHeight: 120,
        overflowY: "auto",
        zIndex: 9999
      }}>
        {logs.map((l, i) => (
          <div key={i} style={{ color: l.type === "warn" ? "#FF8800" : "#00FF88" }}>
            {l.text}
          </div>
        ))}
      </div>

      {/* AR SCENE */}
      {!arReady ? (
        <div style={{ padding: 20 }}>Loading AR...</div>
      ) : (
        <a-scene embedded arjs="sourceType: webcam; debugUIEnabled:false;">

          {/* TOOL */}
          <a-marker preset="hiro" id="toolMarker">
            <a-box
              id="toolBox"
              position="0 0.5 0"
              scale="0.8 0.8 0.8"
              animation="property: rotation; to: 0 360 0; loop: true; dur: 3000"
            />
            <a-text id="toolText" position="0 1.4 0" align="center" color="#fff" />
          </a-marker>

          {/* FAULT */}
          <a-marker preset="kanji" id="faultMarker">
            <a-text value="FAULT DETECTED" position="0 1.2 0" color="red" />
            <a-text id="faultText" position="0 0.5 0" color="white" />
            <a-sphere
              id="faultSphere"
              position="0 0.2 0"
              radius="0.3"
            />
          </a-marker>

          <a-entity camera />
        </a-scene>
      )}
    </div>
  );
}