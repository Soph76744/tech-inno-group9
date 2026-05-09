import { useEffect, useState } from "react";
import "../styles/DashboardPage.css";
import PieChart from "../components/PieChart.jsx";
import BarChart from "../components/BarChart";
// Importing charts created using React Google Charts ^

export default function DashboardPage() {

  // Tool data from backend
  const [tools, setTools] = useState([]);

  // Fault log data
  const [faults, setFaults] = useState([]);

  // Load dashboard data
  useEffect(() => {
    loadTools();
    loadFaults();
  }, []);

  // Load tools from database
  async function loadTools() {
    try {
      const res = await fetch("/api/tools", {
        credentials: "include",
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setTools(data);
      } else {
        setTools([]);
      }
    } catch (err) {
      console.error(err);
      setTools([]);
    }
  }

  // Load fault logs
  async function loadFaults() {
    try {
      const res = await fetch("/api/fault-logs", {
        credentials: "include",
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        // Only unresolved faults are shown due to severity
        const activeFaults = data.filter(
          f => !f.resolved
        );
        setFaults(activeFaults);
      } else {
        setFaults([]);
      }
    } catch (err) {
      console.error(err);
      setFaults([]);
    }
  }

  // Most recent tools - based off last checked
  const recentTools = [...tools]
    .sort(
      (a, b) =>
        new Date(b.last_checked) -
        new Date(a.last_checked)
    )
    .slice(0, 5);

  // Fault statistics
  const totalFaults = faults.length;
  const high = faults.filter(
    f => f.severity === "HIGH"
  ).length;
  const medium = faults.filter(
    f => f.severity === "MEDIUM"
  ).length;
  const low = faults.filter(
    f => f.severity === "LOW"
  ).length;

  // Dashboard display
  return (
    <div className="dashboard-page">
      <h1 className="heading-style"> Dashboard </h1>
      {/* Statistics shown as cards in a 'grid' along top showing total severity of unresolved faults */}
      <div className="stats-grid">
        <div className="card">
          Total Faults: {totalFaults}
        </div>
        <div className="card">
          High: {high}
        </div>
        <div className="card">
          Medium: {medium}
        </div>
        <div className="card">
          Low: {low}
        </div>
      </div>
      {/* Main dashboard grid layout */}
      <div className="dashboard-grid">
        {/* Recent tools mapped on card: shows last user and time last checked*/}
        <div className="card">
          <h2>Recently Used Tools</h2>
          {recentTools.length > 0 ? (
            recentTools.map(t => (
              <div
                key={t.id}
                style={{
                  marginBottom: "12px"
                }}
              >
                <div className="tool-name">
                  {t.name}
                </div>
                ({t.status})
                <br/>
                <small>
                  {t.last_checked_by}
                  {" | "}
                  {new Date(t.last_checked).toLocaleString()}
                </small>
              </div>
            ))
          ) : (
            <p>No tools found</p>
          )}

        </div>
        {/* Fault severity pie chart */}
        <div className="card">
          <h2>Fault Severity</h2>
          <PieChart faults={faults} />
        </div>
        {/* Fault types bar chart along bottom */}
        <div className="card wide-card">
          <h2>Fault Types</h2>
          <BarChart faults={faults} />
        </div>
      </div>
    </div>
  );
}