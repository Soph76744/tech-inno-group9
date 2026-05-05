import { useState } from "react";
import "../styles/ToolsPage.css";


export default function ToolForm({ onAdd }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = () => {
    if (!name || !type) return;

    onAdd({ name, type, location });

    setName("");
    setType("");
    setLocation("");
  };

  return (
    <div className="card">
      <h2>Add Tool</h2>

      <div className="row">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Tool name" />
        <input value={type} onChange={e => setType(e.target.value)} placeholder="Tool type" />
        <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" />
      </div>

      <button className="filters-button" onClick={handleSubmit}>Add Tool</button>
    </div>
  );
}