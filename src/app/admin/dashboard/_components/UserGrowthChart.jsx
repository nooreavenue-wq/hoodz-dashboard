"use client";

import { Card, DatePicker } from "antd";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import dayjs from "dayjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const monthOrder = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function UserGrowthChart({ year, onYearChange, userGrowth }) {
  const sorted = [...userGrowth].sort(
    (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month),
  );

  const labels = sorted.map(
    (item) => monthLabels[monthOrder.indexOf(item.month)] || item.month,
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "Users",
        data: sorted.map((item) => item.user),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Vendors",
        data: sorted.map((item) => item.vendor),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Riders",
        data: sorted.map((item) => item.rider),
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Agents",
        data: sorted.map((item) => item.agent),
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <Card
      className="h-full border-0 shadow-xl"
      title="User Growth"
      extra={
        <DatePicker
          picker="year"
          value={dayjs().year(year)}
          onChange={(date) => {
            if (date) onYearChange(date.year());
          }}
          allowClear={false}
          className="w-28"
        />
      }
    >
      <div style={{ height: 380 }}>
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "top" },
              tooltip: { mode: "index", intersect: false },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: (v) =>
                    Number(v) >= 1000 ? `${Number(v) / 1000}k` : v,
                },
              },
            },
          }}
        />
      </div>
    </Card>
  );
}
