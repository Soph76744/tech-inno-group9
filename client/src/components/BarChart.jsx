import { Chart } from "react-google-charts";

// for number of types of faults 
export default function BarChart({faults = []}) {
    // count faults by type 
    const counts = faults.reduce((acc, fault) => {
        acc[fault.type] = (acc[fault.type] || 0) + 1;
        return acc;
      }, {});
    
  // convert to chart format
  const data = [
    ["Fault Type", "Number"],
    ...Object.entries(counts)
  ];

  const options = {
    chart: {
    },
    backgroundColor: "#737D9E",
    bars: "vertical",
    colors: ["#E5F2FF"],
  };

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