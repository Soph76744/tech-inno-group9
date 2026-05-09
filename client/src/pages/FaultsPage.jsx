import { useEffect, useState } from "react";

export default function FaultsPage() {
  const [faults, setFaults] = useState([]);

  async function loadFaults() {
    try {
      const res = await fetch("/api/fault-logs", {
        credentials: "include",
      });

      const data = await res.json();

      setFaults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setFaults([]);
    }
  }

  useEffect(() => {
    loadFaults();
  }, []);

  async function resolveFault(id) {
    try {
      await fetch(`/api/fault-logs/${id}/resolve`, {
        method: "PATCH",
        credentials: "include",
      });

      loadFaults();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <h1>Fault Logs</h1>

      {faults.length > 0 ? (
        faults.map((f) => (
          <div
            key={f.id}
            style={{
              border: "1px solid #ccc",
              padding: "14px",
              margin: "12px 0",
              borderRadius: "10px",
              background: f.resolved
                ? "#f0fdf4"
                : "#fff7ed",
            }}
          >
            <strong
              style={{
                fontSize: "18px",
              }}
            >
              {f.faultName}
            </strong>

            <p>
              <b>Severity:</b> {f.severity}
            </p>

            <p>
              <b>Service:</b> {f.serviceType}
            </p>

            <p>
              <b>Status:</b>{" "}
              {f.resolved ? "Resolved" : "Active"}
            </p>

            <p>
              <b>Detected:</b>{" "}
              {new Date(f.detectedAt).toLocaleString()}
            </p>

            {f.resolvedAt && (
              <p>
                <b>Resolved:</b>{" "}
                {new Date(f.resolvedAt).toLocaleString()}
              </p>
            )}

            <p>
              <b>Description:</b> {f.description}
            </p>

            <p>
              <b>Tools Needed:</b> {f.toolsNeeded}
            </p>

            {!f.resolved && (
              <button
                onClick={() => resolveFault(f.id)}
                style={{
                  marginTop: 10,
                  padding: "10px 14px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#22c55e",
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