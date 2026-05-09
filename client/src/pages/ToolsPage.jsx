import { useEffect, useState } from "react";
import { getTools, createTool, updateTool, deleteTool } from "../services/api";

import ToolForm from "../components/ToolForm";
import ToolList from "../components/ToolList";
import Filters from "../components/Filters";
import Message from "../components/Message";
import "../styles/ToolsPage.css";

// Data stored as state for page 
export default function ToolsPage() {
  const [tools, setTools] = useState([]);
  const [filter, setFilter] = useState(null);
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState(null);
// Loading tool from backend 
  const loadTools = async () => {
    const res = await getTools(filter);
    setTools(res.data);
  };

  useEffect(() => {
    loadTools();
  }, [filter]);
// Calls backend via API to add a tool
  const handleAdd = async (data) => {
    try {
      await createTool(data);
      setMessage("Tool added.");
      loadTools();
    } catch {
      setMessage("Error adding tool,");
    }
  };
  // Calls backend via API to update tool status
  const handleToggle = async (tool, status) => {
    await updateTool(tool.id, status);
    loadTools();
  };
  // Calls backend via API to delete tool
  const handleDelete = async (id) => {
    try {
      await deleteTool(id);
      setMessage("Deleted successfully.");
      loadTools();
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    }
  };
  // UI Layout adding tool form, tools list and details display
  return (
    <div className="tools-page">
      <h1 className="heading-style">Tool Tracker</h1>

      <ToolForm onAdd={handleAdd} />
      <Message text={message} />

      <div className="tool-card">
        <h2 className="heading-style">Tools</h2>
        <Filters onFilter={setFilter} />
        <ToolList
          tools={tools}
          onToggle={handleToggle}
          onSelect={setSelected}
          onDelete={handleDelete}
        />
      </div>

      <div className="tool-card">
        <h2 className="heading-style">Details</h2>
        {selected ? (
          <div>
            <p><b>Name:</b> {selected.name}</p>
            <p><b>Type:</b> {selected.type}</p>
            <p><b>Location:</b> {selected.location}</p>
            <p><b>Status:</b> {selected.status}</p>
            <p> {/* If no known user is there, show Unknown */}
              <b>Created By:</b>
              {" "}
              {selected.created_by || "Unknown"}
            </p>
            <p>
              <b>Last Updated By:</b>
              {" "}
              {selected.last_checked_by || "Unknown"}
            </p>
            <p>
              <b>Last Checked:</b>
              {" "}
              {selected.last_checked
                ? new Date(selected.last_checked).toLocaleString() : "Never"}
            </p>
          </div>
        ) : (
          <p>Click to view details of the tool.</p>
        )}
      </div>
    </div>
  );
}