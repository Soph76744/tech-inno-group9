import { Chart } from "react-google-charts";
// Number of fault types bar chart using React Google Charts
export default function BarChart({ faults = [] }) {
  // Count faults 
  const counts = faults.reduce((acc, fault) => {
    acc[fault.faultName] =
      (acc[fault.faultName] || 0) + 1;
    return acc;
  }, {});

  // Convert to chart format
  const data = [
    ["Fault Type", "Number"],
    ...Object.entries(counts)
  ];

  // Styling options
  const options = {
    backgroundColor: "#737D9E",
    bars: "vertical",
    colors: ["#E5F2FF"],
    legend: {
      textStyle: {
        color: "black",
        fontName: "Consolas",
      },
    },
    hAxis: {
      textStyle: {
        color: "black",
        fontName: "Consolas",
      },
    },
    vAxis: {
      textStyle: {
        color: "black",
        fontName: "Consolas",
      },
    },
    chartArea: {
      width: "80%",
      height: "70%",
    },
  };

  // Display chart
  return (
    <Chart
      chartType="BarChart"
      width="100%"
      height="300px"
      data={data}
      options={options}
    />
  );
}