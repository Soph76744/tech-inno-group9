import { useEffect, useState } from "react";
import { getFaults } from "../services/api";

export default function FaultsPage() {
  const [faults, setFaults] = useState([]);

  useEffect(() => {
  fetch("http://localhost:3000/api/faults")
    .then(res => res.json())
    .then(data => {
      console.log("Fault API response:", data);

      // Ensure it's always an array
      if (Array.isArray(data)) {
        setFaults(data);
      } else if (Array.isArray(data.faults)) {
        setFaults(data.faults);
      } else {
        setFaults([]); // fallback
      }
    })
    .catch(err => {
      console.error(err);
      setFaults([]);
    });
}, []);


    {Array.isArray(faults) && faults.length > 0 ? (
    faults.map(fault => (
        <div key={fault.id}>
        {fault.type} - {fault.severity}
        </div>
    ))
    ) : (
    <p>No faults found</p>
    )}

  return (
    <div>
      <h1>Fault Logs</h1>
      <a href="/">Tools</a> | <a href="/ar">AR</a>

      {faults.map(f => (
        <div key={f.id} className="card">
          <strong>{f.type}</strong>
          <p>Severity: {f.severity}</p>
          <p>Status: {f.status}</p>
        </div>
      ))}
    </div>
  );
}