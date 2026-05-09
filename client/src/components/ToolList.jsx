import { useEffect, useState } from "react";

export default function ToolList({
  tools,
  onToggle,
  onSelect,
  onDelete,
}) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  if (!Array.isArray(tools)) {
    return <p>Loading...</p>;
  }

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
            Last Updated By:{" "}
            {tool.last_checked_by || "Unknown"}
          </p>

          <div>
            <button
              onClick={() => onToggle(tool, "available")}
            >
              Available
            </button>

            <button
              onClick={() => onToggle(tool, "in-use")}
            >
              In Use
            </button>

            <button
              onClick={() => onToggle(tool, "missing")}
            >
              Missing
            </button>

            <button onClick={() => onSelect(tool)}>
              Details
            </button>

            {user?.role === "admin" && (
              <button
                onClick={() => onDelete(tool.id)}
                style={{
                  background: "crimson",
                  color: "white",
                  marginLeft: 8,
                }}
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
