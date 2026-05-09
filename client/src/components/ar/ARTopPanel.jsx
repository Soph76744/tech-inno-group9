// Panel shown at top of AR - for navigation and options
export default function ARTopPanel({
  status,
  linkStyle,
  tool,
  showControls,
  mode,
  setMode,
  updateTool,
  previousTool,
  nextTool,
}) {

  // Button styling
  const panelButtonStyle = {
    borderRadius: "8px",
    border: "1px solid black",
    padding: "0.5em 1em",
    margin: "0.3em",
    fontSize: "0.8em",
    fontWeight: "bold",
    fontFamily: "'Lucida Console', monospace",
    cursor: "pointer",
    boxShadow: "3px 3px black",
    transition: "0.2s",
  };
  // Top panel 
  return (
    <div
      style={{
        position: "fixed",
        top: 14,
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(10,10,10,0.72)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(14px)",
        color: "white",
        padding: 16,
        borderRadius: 18,
        zIndex: 9999,
        minWidth: 390,
        textAlign: "center",
        boxShadow: "0 0 25px rgba(0,0,0,0.4)",
      }}
    >
      <h2
        style={{
          margin: 0,
          fontWeight: 700,
          letterSpacing: 1,
          fontFamily: "'Lucida Console', monospace",
        }}
      >
        AR MAINTENANCE SYSTEM
      </h2>
      <p
        style={{
          marginTop: 8,
          color: "#cfcfcf",
          fontSize: 14,
          fontFamily: "'Lucida Console', monospace",
        }}
      >
        {status}
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 12,
          marginTop: 14,
        }}
      >
        {/* Navigation to main pages */}
        <a href="/dashboard" style={linkStyle}>
          Dashboard
        </a>
        <a href="/tools" style={linkStyle}>
          Tools
        </a>
        <a href="/faults" style={linkStyle}>
          Faults
        </a>
      </div>
      <div style={{ marginTop: 16 }}>
        <button
          onClick={() => setMode("tool")}
          style={{
            ...panelButtonStyle,
            background: "#737D9E",
            color: "black",
          }}
        >
          {/* Button options to switch between tool/fault mode */}
          Tool Mode
        </button>
        <button
          onClick={() => setMode("fault")}
          style={{
            ...panelButtonStyle,
            background: "#424a65",
            color: "white",
          }}
        >
          Fault Mode
        </button>
      </div>
      
      {/* When in tool mode shows controls for updating tool's options */}
      {tool && showControls && mode === "tool" && (
        <div
          style={{
            marginTop: 16,
            display: "flex",
            justifyContent: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => updateTool("in-use")}
            style={{
              ...panelButtonStyle,
              background: "#E6B44E",
              color: "black",
            }}
          >
            Use
          </button>
          <button
            onClick={() => updateTool("available")}
            style={{
              ...panelButtonStyle,
              background: "#90D938",
              color: "black",
            }}
          >
            Return
          </button>
          <button
            onClick={() => updateTool("missing")}
            style={{
              ...panelButtonStyle,
              background: "#C2472F",
              color: "white",
            }}
          >
            Missing
          </button>
          <button
            onClick={previousTool}
            style={{
              ...panelButtonStyle,
              background: "#737D9E",
              color: "black",
            }}
          >

            {/* Allows the user to switch to previous/next tool */}
            Previous Tool
          </button>
          <button
            onClick={nextTool}
            style={{
              ...panelButtonStyle,
              background: "#737D9E",
              color: "black",
            }}
          >
            Next Tool
          </button>
        </div>
      )}
    </div>
  );
}