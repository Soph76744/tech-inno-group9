import { useEffect, useState } from "react";
import { getTools, createTool, updateTool, deleteTool } from "../services/api";

import ToolForm from "../components/ToolForm";
import ToolList from "../components/ToolList";
import Filters from "../components/Filters";
import Message from "../components/Message";
import "../styles/ToolsPage.css";

export default function ToolsPage() {
  const [tools, setTools] = useState([]);
  const [filter, setFilter] = useState(null);
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState(null);

  const loadTools = async () => {
    const res = await getTools(filter);
    setTools(res.data);
  };

  useEffect(() => {
    loadTools();
  }, [filter]);

  const handleAdd = async (data) => {
    try {
      await createTool(data);
      setMessage("Tool added.");
      loadTools();
    } catch {
      setMessage("Error adding tool,");
    }
  };

  const handleToggle = async (tool, status) => {
    await updateTool(tool.id, status);
    loadTools();
  };

  // delete tool
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

  return (
    <div className="tools-page">
      <h1>Tool Tracker</h1>

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
            <p><b>Name</b>: {selected.name}</p>
            <p><b>Type:</b> {selected.type}</p>
            <p><b>Status: </b>{selected.status}</p>
            <p><b>Last User:</b> added when merge</p> 
          </div>
        ) : (
          <p>Click to view details of the tool.</p>
        )}
      </div>
    </div>
  );
}