import { useEffect, useState } from "react";
import "../styles/AuditLogsPage.css";

// Audit Logs Page
export default function AuditLogsPage() {

  // Separate state arrays for Access Logs and Tool Logs
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
        credentials: "include" // required for session authentication
      });
      const data = await res.json();
      console.log("Audit Data:", data);
      // Saves access logs in state
      setAccessLogs(
        Array.isArray(data.accessLogs)
          ? data.accessLogs
          : []
      );
      // Saves tool logs in state
      setToolLogs(
        Array.isArray(data.toolLogs)
          ? data.toolLogs
          : []
      );

    } catch (err) {
      console.error("Failed to load logs:", err);
      // Resets logs if failure in request
      setAccessLogs([]);
      setToolLogs([]);
    }
  }
  // Main audit page with grid for styling
  return (
    <div className="audit-page">
      <h1 className="heading-style">
        Audit Logs
      </h1>
      <div className="audit-grid">
        {/* Access Logs - shows user, action, message, date*/}
        <div className="log-panel">
          <h2>Access Logs</h2>
          {accessLogs.length === 0 ? (
            <p>No access logs</p>
          ) : (
            accessLogs.map((log) => (
              <div
                key={log.id}
                className="log-card">
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
        {/* Tool Logs - shows user, action, message, date */}
        <div className="log-panel">
          <h2>Tool Logs</h2>
          {toolLogs.length === 0 ? (
            <p>No tool logs</p>
          ) : (
            toolLogs.map((log) => (
              <div
                key={log.id}
                className="log-card">
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