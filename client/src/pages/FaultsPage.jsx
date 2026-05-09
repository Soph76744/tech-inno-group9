import { useEffect, useState } from "react";
import "../styles/FaultsPage.css";

export default function FaultsPage() {
  const [faults, setFaults] = useState([]);
  async function loadFaults() {
    try {
      const res = await fetch("/api/fault-logs", {
        credentials: "include",
      });
      const data = await res.json();
      setFaults(
        Array.isArray(data) ? data : []
      );

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
      await fetch(
        `/api/fault-logs/${id}/resolve`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );
      loadFaults();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="faults-page">
      <h1 className="heading-style">
        Fault Logs
      </h1>
      {faults.length > 0 ? (
        faults.map((f) => (
          <div
            key={f.id}
            className={`fault-card ${
              f.resolved
                ? "resolved-fault"
                : "active-fault"
            }`}
          >

            <div className="fault-name">
              {f.faultName}
            </div>

            <p className="fault-info">
              <b>Severity:</b> {f.severity}
            </p>

            <p className="fault-info">
              <b>Service:</b> {f.serviceType}
            </p>

            <p className="fault-info">
              <b>Status:</b>{" "}
              {f.resolved
                ? "Resolved"
                : "Active"}
            </p>

            <p className="fault-info">
              <b>Detected:</b>{" "}
              {new Date(
                f.detectedAt
              ).toLocaleString()}
            </p>

            {f.resolvedAt && (
              <p className="fault-info">
                <b>Resolved:</b>{" "}
                {new Date(
                  f.resolvedAt
                ).toLocaleString()}
              </p>
            )}

            <p className="fault-info">
              <b>Description:</b>{" "}
              {f.description}
            </p>

            <p className="fault-info">
              <b>Tools Needed:</b>{" "}
              {f.toolsNeeded}
            </p>

            {!f.resolved && (
              <button
                className="resolve-button"
                onClick={() =>
                  resolveFault(f.id)
                }
              >
                Mark Resolved
              </button>
            )}
          </div>
        ))

      ) : (
        <p className="no-faults">
          No fault logs found
        </p>
      )}
    </div>
  );
}