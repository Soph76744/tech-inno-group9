import { useEffect, useState } from "react";

export default function FaultsPage() {
  const [faults, setFaults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadFaultLogs() {
    try {
      setLoading(true);

      const res = await fetch("/api/fault-logs", {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Could not load fault logs");
      }

      const data = await res.json();

      setFaults(Array.isArray(data) ? data : []);
      setMessage("");
    } catch (err) {
      console.error(err);
      setFaults([]);
      setMessage("Fault logs could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  async function markResolved(id) {
    try {
      const res = await fetch(`/api/fault-logs/${id}/resolve`, {
        method: "PATCH",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Could not resolve fault");
      }

      loadFaultLogs();
    } catch (err) {
      console.error(err);
      setMessage("Could not mark fault as resolved.");
    }
  }

  useEffect(() => {
    loadFaultLogs();

    const interval = setInterval(() => {
      loadFaultLogs();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        padding: "24px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <h1>Fault Logs</h1>

      {message && (
        <p
          style={{
            color: "#ff4d4d",
            fontWeight: 600,
          }}
        >
          {message}
        </p>
      )}

      {loading ? (
        <p>Loading fault logs...</p>
      ) : faults.length > 0 ? (
        faults.map((f) => (
          <div
            key={f.id}
            style={{
              border: "1px solid #ccc",
              padding: "14px",
              margin: "12px 0",
              borderRadius: "8px",
              background: f.resolved ? "#f1f1f1" : "#fff7f7",
            }}
          >
            <h3 style={{ margin: "0 0 8px" }}>
              {f.faultName || "Unknown Fault"}
            </h3>

            <p>
              <b>Severity:</b> {f.severity || "Unknown"}
            </p>

            <p>
              <b>Service:</b> {f.serviceType || "Inspection"}
            </p>

            <p>
              <b>Tools Needed:</b> {f.toolsNeeded || "Standard toolkit"}
            </p>

            <p>
              <b>Description:</b>{" "}
              {f.description || "No description available"}
            </p>

            <p>
              <b>Status:</b>{" "}
              {f.resolved ? "Resolved" : "Active"}
            </p>

            <p>
              <b>Detected At:</b>{" "}
              {f.detectedAt
                ? new Date(f.detectedAt).toLocaleString()
                : "Unknown"}
            </p>

            {!f.resolved && (
              <button
                onClick={() => markResolved(f.id)}
                style={{
                  marginTop: "8px",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#00a86b",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Mark Resolved
              </button>
            )}
          </div>
        ))
      ) : (
        <p>No fault logs found</p>
      )}
    </div>
  );
}
