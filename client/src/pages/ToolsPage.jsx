import { useEffect, useState } from "react";
import { getTools, createTool, updateTool } from "../services/api";

import ToolForm from "../components/ToolForm";
import ToolList from "../components/ToolList";
import Filters from "../components/Filters";
import Message from "../components/Message";

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
      setMessage("Tool created ✔");
      loadTools();
    } catch {
      setMessage("Error creating tool");
    }
  };

  const handleToggle = async (tool, status) => {
    await updateTool(tool.id, status);
    loadTools();
  };

  return (
    <div>
      <h1>Tool Tracker</h1>

      <ToolForm onAdd={handleAdd} />
      <Message text={message} />

      <div className="card">
        <h2>Tools</h2>
        <Filters onFilter={setFilter} />
        <ToolList tools={tools} onToggle={handleToggle} onSelect={setSelected} />
      </div>

      <div className="card">
        <h2>Details</h2>
        {selected ? (
          <div>
            <p>{selected.name}</p>
            <p>{selected.type}</p>
            <p>{selected.status}</p>
          </div>
        ) : (
          <p>Click a tool to view details.</p>
        )}
      </div>
    </div>
  );
}