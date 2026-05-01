export default function ToolList({ tools, onToggle, onSelect }) {
    if (!Array.isArray(tools)) return <p>Loading...</p>;
  
    return (
    <div>
      {tools.map(tool => (
        <div key={tool.id} className="card">
          <strong>{tool.name}</strong> ({tool.status})

          <div>
            <button onClick={() => onToggle(tool, "in-use")}>Use</button>
            <button onClick={() => onToggle(tool, "available")}>Return</button>
            <button onClick={() => onToggle(tool, "missing")}>Missing</button>
            <button onClick={() => onSelect(tool)}>Details</button>
          </div>
        </div>
      ))}
    </div>
  );
}