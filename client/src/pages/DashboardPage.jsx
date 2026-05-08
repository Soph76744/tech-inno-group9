import { useState } from "react";
import "../styles/DashboardPage.css";

export default function DashboardPage() {

  // dummy placeholder data - no database integration yet

  const [tools] = useState([
    {
      id: 1,
      name: "Wrench",
      status: "available",
      last_checked_by: "admin",
      last_checked: "2026-01-01T10:30:00"
    },
    {
      id: 2,
      name: "Hammer",
      status: "in-use",
      last_checked_by: "admin",
      last_checked: "2026-01-01T11:15:00"
    },
    {
      id: 3,
      name: "Drill",
      status: "missing",
      last_checked_by: "engineer1",
      last_checked: "2026-01-01T12:05:00"
    }
  ]);

  const [faults] = useState([
    { id: 1, type: "Door failure", severity: "high" },
    { id: 2, type: "Brake issue", severity: "medium" },
    { id: 3, type: "Light flicker", severity: "low" }
  ]);

  // most recent tools - based off last checked

  const recentTools = [...tools]
    .sort((a, b) => new Date(b.last_checked) - new Date(a.last_checked))
    .slice(0, 5);

  // fault statistics

  const totalFaults = faults.length;
  const high = faults.filter(f => f.severity === "high").length;
  const medium = faults.filter(f => f.severity === "medium").length;
  const low = faults.filter(f => f.severity === "low").length;

  return (
    <div className="dashboard-page">

      <h1 className="heading-style">Dashboard</h1>

      {/* statistics */}
      <div className="stats-grid">
        <div className="card">Total Faults: {totalFaults}</div>
        <div className="card">High: {high}</div>
        <div className="card">Medium: {medium}</div>
        <div className="card">Low: {low}</div>
      </div>

      {/* main dashboard grid */}
      <div className="dashboard-grid">

        {/* recent tools */}
        <div className="card">
          <h2>Recently Used Tools</h2>

          {recentTools.map(t => (
            <div key={t.id}>
              <div className="tool-name">{t.name}</div>
              ({t.status})<br />
              <small>
                {t.last_checked_by} • {new Date(t.last_checked).toLocaleTimeString()}
              </small>
            </div>
          ))}
        </div>

        {/* fault summary */}
        <div className="card">
          <h2>Fault Summary</h2>

          {faults.map(f => (
            <div key={f.id}>
              {f.type} - <span className={f.severity}>{f.severity}</span>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}