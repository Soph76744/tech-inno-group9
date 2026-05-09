import { useEffect, useState } from "react";
import "../styles/AuditLogsPage.css";

// Audit Logs Page
// Displays:
// 1. Access logs (login/logout/security events)
// 2. Tool logs (tool creation/modification/deletion)

export default function AuditLogsPage() {

  // Separate state arrays for cleaner UI layout
  const [accessLogs, setAccessLogs] = useState([]);
  const [toolLogs, setToolLogs] = useState([]);

  // Load logs on page load
  useEffect(() => {
    loadLogs();
  }, []);

  // Fetch logs from backend API
  async function loadLogs() {
    try {
      const res = await fetch("/api/logs", {
        credentials: "include" // required for session auth
      });

      const data = await res.json();

      console.log("AUDIT DATA:", data);

      // Backend returns:
      // {
      //   accessLogs: [],
      //   toolLogs: []
      // }

      setAccessLogs(
        Array.isArray(data.accessLogs)
          ? data.accessLogs
          : []
      );

      setToolLogs(
        Array.isArray(data.toolLogs)
          ? data.toolLogs
          : []
      );

    } catch (err) {
      console.error("Failed to load logs:", err);

      // Prevent frontend crash
      setAccessLogs([]);
      setToolLogs([]);
    }
  }

  return (
    <div className="audit-page">

      {/* PAGE TITLE */}
      <h1 className="heading-style">
        Audit Logs
      </h1>

      {/* 2 COLUMN LAYOUT */}
      <div className="audit-grid">

        {/* ================= ACCESS LOGS ================= */}
        <div className="log-panel">

          <h2>Access Logs</h2>

          {accessLogs.length === 0 ? (
            <p>No access logs</p>
          ) : (
            accessLogs.map((log) => (
              <div
                key={log.id}
                className="log-card"
              >

                <p>
                  <b>User:</b>{" "}
                  {log.user || "Unknown"}
                </p>

                <p>
                  <b>Action:</b>{" "}
                  {log.action || "N/A"}
                </p>

                <p>
                  <b>Message:</b>{" "}
                  {log.message || "N/A"}
                </p>

                <p className="timestamp">
                  {log.createdAt
                    ? new Date(log.createdAt).toLocaleString()
                    : "Unknown"}
                </p>

              </div>
            ))
          )}

        </div>

        {/* ================= TOOL LOGS ================= */}
        <div className="log-panel">

          <h2>Tool Logs</h2>

          {toolLogs.length === 0 ? (
            <p>No tool logs</p>
          ) : (
            toolLogs.map((log) => (
              <div
                key={log.id}
                className="log-card"
              >

                <p>
                  <b>User:</b>{" "}
                  {log.user || "Unknown"}
                </p>

                <p>
                  <b>Action:</b>{" "}
                  {log.action || "N/A"}
                </p>

                <p>
                  <b>Message:</b>{" "}
                  {log.message || "N/A"}
                </p>

                <p>
                  <b>Tool ID:</b>{" "}
                  {log.tool_id || "N/A"}
                </p>

                <p className="timestamp">
                  {log.createdAt
                    ? new Date(log.createdAt).toLocaleString()
                    : "Unknown"}
                </p>

              </div>
            ))
          )}

        </div>

      </div>
    </div>
  );
}