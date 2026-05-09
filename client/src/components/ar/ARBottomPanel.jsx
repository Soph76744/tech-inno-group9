export default function ARBottomPanel({
    markerVisible,
    mode,
    showDetails,
    setShowDetails,
    today,
    fault,
    logs,
  }) {
    return (
      <>
        {markerVisible && mode === "fault" && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              position: "fixed",
              bottom: "145px",
              left: "50%",
              transform: "translateX(-50%)",
              padding: "14px 24px",
              borderRadius: "12px",
              border: "none",
              background: "rgba(20,20,20,0.85)",
              color: "white",
              backdropFilter: "blur(10px)",
              cursor: "pointer",
              zIndex: 9999,
              fontWeight: 600,
            }}
          >
            {showDetails
              ? "Hide Details"
              : "Open Fault Details"}
          </button>
        )}
  
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "rgba(5,5,5,0.9)",
            backdropFilter: "blur(10px)",
            color: "#e5e5e5",
            fontFamily: "Consolas, monospace",
            fontSize: 12,
            padding: "10px 14px",
            maxHeight: 115,
            overflowY: "auto",
            zIndex: 9999,
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              marginBottom: 6,
              color: "#8f8f8f",
            }}
          >
            {markerVisible
              ? `${today} | Technician: Marang | Service: ${
                  fault.ServiceType || "Inspection"
                }`
              : today}
          </div>
  
          {logs.map((l, i) => (
            <div
              key={i}
              style={{
                color:
                  l.type === "warn"
                    ? "#ff8080"
                    : l.type === "tool"
                    ? "#6fffd2"
                    : "#d7d7d7",
                marginBottom: 3,
              }}
            >
              {l.text}
            </div>
          ))}
        </div>
      </>
    );
  }