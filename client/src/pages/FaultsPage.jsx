import { useEffect, useState } from "react";
import "../styles/FaultsPage.css";

// Faults page 
export default function FaultsPage() {
  const [faults, setFaults] = useState([]); // Stores fault logs from backend
  // Loads faults from backend
  async function loadFaults() {
    // Fault logs from backend endpoint
    try {
      const res = await fetch("/api/fault-logs", {
        credentials: "include",
      });
      // Stores data in the state if its an array
      const data = await res.json();
      setFaults(
        Array.isArray(data) ? data : []
      );
    // Logging errors to console
    } catch (err) {
      console.error(err);
      setFaults([]);
    }
  }
  useEffect(() => {
    loadFaults();
  }, []);
// Marking faults as resolved through updating a fault
  async function resolveFault(id) {
    try {
      await fetch(
        `/api/fault-logs/${id}/resolve`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );
      // Reloading faults after updates
      loadFaults();
    } catch (err) {
      console.error(err);
    }
  }
// UI of faults page - shows each fault separately
// Displays both unresolved and resolved faults: if unresolved, there is a button to resolve it
// Shows fault name, severity, service type, status, detected at, resolved at, fault description and tools needed
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
        // Only when there are no faults found it is displayed
        <p className="no-faults">
          No fault logs found</p>
      )}
    </div>
  );
}