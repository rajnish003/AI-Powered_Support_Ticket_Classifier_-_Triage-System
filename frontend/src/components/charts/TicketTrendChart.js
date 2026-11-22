"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDateKey(dateStr) {
  const d = new Date(dateStr);
  // Group by YYYY-MM-DD
  return d.toISOString().slice(0, 10);
}

export default function TicketTrendChart({ tickets }) {
  // Group tickets by day using created_at from real data
  const countsByDay = {};
  tickets.forEach((t) => {
    if (!t.created_at) return;
    const key = formatDateKey(t.created_at);
    countsByDay[key] = (countsByDay[key] || 0) + 1;
  });

  // Sort by date and build chart data
  const data = Object.entries(countsByDay)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .slice(-14) // show last 14 days max
    .map(([date, count]) => ({
      date: formatDate(date),
      tickets: count,
    }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-slate-400">
        No trend data available yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          formatter={(value) => [value, "Tickets"]}
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            fontSize: "13px",
          }}
        />
        <Line
          type="monotone"
          dataKey="tickets"
          stroke="#6366f1"
          strokeWidth={2.5}
          dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
          activeDot={{ r: 6, fill: "#4f46e5" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

