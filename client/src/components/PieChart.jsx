import { Chart } from "react-google-charts";

// Faults chart
export default function PieChart({ faults }) {

  // For fault severities
  const high = faults.filter(f => f.severity === "HIGH").length;
  const medium = faults.filter(f => f.severity === "MEDIUM").length;
  const low = faults.filter(f => f.severity === "LOW").length;

  // Chart data
  const data = [
    ["Severity", "Count"],
    ["High", high],
    ["Medium", medium],
    ["Low", low],
  ];

  // Styling options
  const options = {
    pieHole: 0.4,
    colors: ["#C2472F", "#E6B44E", "#90D938"],
    backgroundColor: "#737D9E",
    legend: {
      textStyle: {
        color: "black",
        fontName: "Consolas",
      },
    },
  };

  // Display chart
  return (
    <Chart
      chartType="PieChart"
      data={data}
      options={options}
      width={"100%"}
      height={"300px"}
    />
  );
}