import { useEffect, useState } from "react";
import "../styles/DashboardPage.css";

// example with dummy dashboard
// to do: design, link metrics from backend, etc.

export default function DashboardPage() {
    return (
      <div className="background-style">
        <h1 className="heading-style">Dashboard</h1>
        <a href="/tools">Tools</a> | <a href="/ar">Open AR</a> | <a href="/faults">Fault Logs</a>
      </div>
    );
  }