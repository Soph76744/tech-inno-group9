import "../styles/ToolsPage.css";
import { useAuth } from "../context/AuthContext";


export default function ToolList({
  tools, // list of tools 
  onToggle, // function to change status of tool
  onSelect, // function to view details of tool
  onDelete // function to delete tool
}) {
  const { user } = useAuth(); // Gets current logged-in user 

  // Loading message, also validates that map runs only on a valid array
  if (!Array.isArray(tools)) {
    return <p>Loading...</p>;
  }
  // Creates UI card through mapping every tool alongside their information
  return (
    <div>
      {tools.map((tool) => (
        <div key={tool.id} className="tool-card">
          <strong className="name-style">
            {tool.name}
          </strong>
          <p>Status: {tool.status}</p>
          <p>Location: {tool.location}</p>
          <p>
            Last Updated By:
            {" "}
            {tool.last_checked_by || "Unknown"} {/* If no user is given says unknown */}
          </p>
          <div> {/* Buttons for each tool to interact with */} 
            <button
              className="general-button"
              onClick={() => onToggle(tool, "in-use")}>
              Use
            </button>

            <button
              className="general-button"
              onClick={() => onToggle(tool, "available")}>
              Return
            </button>

            <button
              className="general-button"
              onClick={() => onToggle(tool, "missing")}>
              Missing
            </button>

            <button
              className="general-button"
              onClick={() => onSelect(tool)}>
              Details
            </button>

            {/* Delete button only shown to admins */}
            {user?.role === "admin" && (
              <button
                className="delete-button"
                onClick={() => onDelete(tool.id)}>
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}