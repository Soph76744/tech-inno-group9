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
          }}
        >
          AR MAINTENANCE SYSTEM
        </h2>
  
        <p
          style={{
            marginTop: 8,
            color: "#cfcfcf",
            fontSize: 14,
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
              padding: "10px 16px",
              borderRadius: 10,
              border: "none",
              marginRight: 8,
              background: "#00c896",
              color: "white",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Tool Mode
          </button>
  
          <button
            onClick={() => setMode("fault")}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "none",
              background: "#ff7a00",
              color: "white",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Fault Mode
          </button>
        </div>
  
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
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                background: "#ffc400",
                color: "black",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Use
            </button>
  
            <button
              onClick={() => updateTool("available")}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                background: "#00d084",
                color: "white",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Return
            </button>
  
            <button
              onClick={() => updateTool("missing")}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                background: "#ff4d4d",
                color: "white",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Missing
            </button>
  
            <button
              onClick={previousTool}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                background: "#374151",
                color: "white",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Previous Tool
            </button>
  
            <button
              onClick={nextTool}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                background: "#374151",
                color: "white",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Next Tool
            </button>
          </div>
        )}
      </div>
    );
  }