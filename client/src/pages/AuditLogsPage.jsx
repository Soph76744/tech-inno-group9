import { useEffect, useState } from "react";
import "../styles/AuditLogsPage.css";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("/api/logs", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setLogs(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error(err);
        setLogs([]);
      });
  }, []);

  return (
    <div className="audit-page">
      <h1>Audit Logs</h1>

      {logs.length === 0 ? (
        <p>No logs found.</p>
      ) : (
        logs.map((log) => (
          <div
            key={log.id}
            className="audit-card"
          >
            <p>
              <b>User:</b> {log.user || "Unknown"}
            </p>

            <p className="audit-action">
              {log.action || "N/A"}
            </p>

            <p>
              <span className="audit-type">
                {log.type || "N/A"}
              </span>
            </p>

            <p>
              <b>Tool ID:</b> {log.tool_id || "N/A"}
            </p>

            <p>
              <b>Time:</b>{" "}
              {log.createdAt
                ? new Date(log.createdAt).toLocaleString()
                : "Unknown"}
            </p>
          </div>
        ))
      )}
    </div>
  );
}