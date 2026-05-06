import { Chart } from "react-google-charts";

// faults chart 
export default function PieChart({faults}) {
    // for fault severities 
    const high = faults.filter(f => f.severity === "high").length;
    const medium = faults.filter(f => f.severity === "medium").length;
    const low = faults.filter(f => f.severity === "low").length;

    // dummy chart data - will be imported from backend
    const data = [
        ["Severity", "Count"],
        ["High", high],
        ["Medium", medium],
        ["Low", low],
      ];

    const options = {
        pieHole: 0.4,
        colors: ["#C2472F", "#F7E83B", "#90D938"],
        backgroundColor: "#737D9E",
    };


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