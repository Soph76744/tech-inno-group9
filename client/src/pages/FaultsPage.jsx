import { useEffect, useState } from "react";

export default function FaultsPage() {
  const [faults, setFaults] = useState([]);

  useEffect(() => {
    fetch("/api/faults", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fault API response:", data);

        if (Array.isArray(data)) {
          setFaults(data);
        } else if (Array.isArray(data.faults)) {
          setFaults(data.faults);
        } else {
          setFaults([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setFaults([]);
      });
  }, []);

  return (
    <div>
      <h1>Fault Logs</h1>

      {faults.length > 0 ? (
        faults.map((f) => (
          <div
            key={f.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              margin: "10px 0",
              borderRadius: "8px"
            }}
          >
            <strong>{f.type}</strong>
            <p>Severity: {f.severity}</p>
            <p>Status: {f.status}</p>
          </div>
        ))
      ) : (
        <p>No fault logs found</p>
      )}
    </div>
  );
}

/* Admin-only actions
{user?.role === "admin" && (
  <button onClick={deleteFault}>Delete Fault</button>
)}
*/