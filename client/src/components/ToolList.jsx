import "../styles/ToolsPage.css";
import { useAuth } from "../context/AuthContext";

export default function ToolList({ tools, onToggle, onSelect, onDelete }) {
  const { user } = useAuth();

  if (!Array.isArray(tools)) return <p>Loading...</p>;

  return (
    <div>
      {tools.map((tool) => (
        <div key={tool.id} className="tool-card">
          <strong className="name-style">{tool.name}</strong> ({tool.status})

          <div>
            <button
              className="general-button"
              onClick={() => onToggle(tool, "in-use")}
            >
              Use
            </button>

            <button
              className="general-button"
              onClick={() => onToggle(tool, "available")}
            >
              Return
            </button>

            <button
              className="general-button"
              onClick={() => onToggle(tool, "missing")}
            >
              Missing
            </button>

            <button
              className="general-button"
              onClick={() => onSelect(tool)}
            >
              Details
            </button>

            {/* ROLE-BASED DELETE */}
            {user?.role === "admin" && (
              <button
                className="delete-button"
                onClick={() => onDelete(tool.id)}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}