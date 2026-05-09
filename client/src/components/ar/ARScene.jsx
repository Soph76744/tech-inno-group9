// Main AR scene
export default function ARScene({
    arReady,
    mode,
    tool,
    fault,
    showDetails,
    toolColours,
    toolLabels,
  }) {
    // Loading screen until AR is ready
    if (!arReady) {
      return <div>Loading AR...</div>;
    }
  
    return (
      <a-scene
        embedded
        renderer="logarithmicDepthBuffer: true;"
        arjs="sourceType: webcam; debugUIEnabled:false;"
      >
        {/* Marker used for AR tracking is Hiro in prototype */}
        <a-marker preset="hiro" id="mainMarker" emitevents="true">
          {/* Tool mode - displays tool overlay */}
          {mode === "tool" && tool && (
            <>
              <a-box
                id="toolBox"
                position="0 0.4 0"
                scale="0.95 0.95 0.95"
                rotation="0 45 0"
                animation="
                  property: rotation;
                  to: 360 405 360;
                  loop: true;
                  dur: 9000;
                  easing: linear;
                "
              />
              <a-ring
                position="0 -0.3 0"
                rotation="-90 0 0"
                radius-inner="0.8"
                radius-outer="0.95"
                color={toolColours[tool.status]}
                opacity="0.55"
              />
              <a-text
                value="TOOL INTELLIGENCE SYSTEM"
                position="0 2.1 0"
                align="center"
                color="#00ffd0"
                width="4"
              />
              <a-plane
                color="#101820"
                opacity="0.82"
                width="2.6"
                height="1.7"
                position="0 1.25 0"
                material="shader: flat"
              >
                <a-text
                  value={`
  ${tool.name || "Unknown Tool"}
          {*/ Shows details of Tool*/}
  Status:
  ${toolLabels[tool.status] || "UNKNOWN"}
  ID: ${tool.id || "N/A"}
  Location:
  ${tool.location || "Storage Bay"}
  Condition:
  ${tool.condition || "Operational"}
  Assigned:
  ${tool.assignedTo || "None"}
  Last Used:
  ${tool.lastUsed || "N/A"}
                  `}
                  align="center"
                  color="#ffffff"
                  width="2"
                  wrap-count="24"
                  line-height="52"
                  position="0 0 0.01"
                />
              </a-plane>
            </>
          )}
  {/* Fault mode - displays fault overlay */}
          {mode === "fault" && (
            <>
              <a-text
                value="FAULT ANALYSIS"
                position="0 2 0"
                align="center"
                color="#ff8855"
                width="4"
              />
              <a-sphere
                id="faultSphere"
                position="0 0.35 0"
                radius="0.38"
                material="color:red; opacity:0.55; wireframe:true"
              />
              {!showDetails ? (
                <a-plane
                  id="faultBox"
                  color="#1b1b1b"
                  opacity="0.82"
                  width="2.2"
                  height="1"
                  position="0 1.2 0"
                >
                  {/* Fault details text */}
                  <a-text
                    value={`
  ${fault.FaultName || "FAULT LOADING"}  
  Severity:
  ${fault.Severity || "UNKNOWN"}
  Service:
  ${fault.ServiceType || "Inspection"}
                    `}
                    color="#ffffff"
                    align="center"
                    width="1.8"
                    wrap-count="20"
                    line-height="50"
                    position="0 0 0.01"
                  />
                </a-plane>
              ) : (
                <a-plane
                  color="#121212"
                  opacity="0.88"
                  width="2.8"
                  height="1.9"
                  position="0 1.25 0"
                >
                  <a-text
                    value={`
  FAULT:
  ${fault.FaultName || ""}
  SEVERITY:
  ${fault.Severity || ""}
  DESCRIPTION:
  ${fault.Description || "No description available"}
  TOOLS REQUIRED:
  ${fault.ToolsNeeded || "Standard toolkit"}
  SERVICE TYPE:
  ${fault.ServiceType || "Inspection"}
                    `}
                    color="#ffffff"
                    align="center"
                    width="2.2"
                    wrap-count="26"
                    line-height="48"
                    position="0 0 0.01"
                  />
                </a-plane>
              )}
            </>
          )}
        </a-marker>
        {/* AR camera */}
        <a-entity camera />
      </a-scene>
    );
  }