import {
    BarChart as ReBarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
  } from "recharts";
  
  export default function BarChart({ faults }) {
    const counts = {};
  
    faults.forEach((f) => {
      counts[f.type] = (counts[f.type] || 0) + 1;
    });
  
    const data = Object.keys(counts).map((key) => ({
      type: key,
      count: counts[key],
    }));
  
    return (
      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <ReBarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
  
            <XAxis dataKey="type" />
            <YAxis />
  
            <Tooltip />
  
            <Bar dataKey="count" fill="#3b82f6" />
          </ReBarChart>
        </ResponsiveContainer>
      </div>
    );
  }
  