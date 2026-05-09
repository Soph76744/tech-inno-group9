import {
    PieChart as RePieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from "recharts";
  
  export default function PieChart({ faults }) {
    const high = faults.filter((f) => f.severity === "high").length;
    const medium = faults.filter((f) => f.severity === "medium").length;
    const low = faults.filter((f) => f.severity === "low").length;
  
    const data = [
      { name: "High", value: high },
      { name: "Medium", value: medium },
      { name: "Low", value: low },
    ];
  
    const COLORS = ["#ef4444", "#f59e0b", "#22c55e"];
  
    return (
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <RePieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={85}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
  
            <Tooltip />
            <Legend />
          </RePieChart>
        </ResponsiveContainer>
      </div>
    );
  }
  