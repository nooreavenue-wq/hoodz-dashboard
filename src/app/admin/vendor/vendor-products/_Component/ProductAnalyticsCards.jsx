"use client";

import { Card, Empty } from "antd";
import { FolderOpen, CircleDollarSign, Boxes } from "lucide-react";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
);

const COLORS = [
  "#1B70A6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
];

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        boxWidth: 12,
        padding: 12,
        font: { size: 11 },
      },
    },
  },
};

export default function ProductAnalyticsCards({ analytics }) {
  if (!analytics) return null;

  const topCategories = analytics.topCategories || [];
  const priceDistribution = analytics.priceDistribution || [];
  const stockInsights = analytics.stockInsights || [];

  const categoryData = {
    labels: topCategories.map((c) => c.title),
    datasets: [
      {
        data: topCategories.map((c) => c.count),
        backgroundColor: COLORS.slice(0, topCategories.length),
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  const priceData = {
    labels: priceDistribution.map((p) => p.label),
    datasets: [
      {
        data: priceDistribution.map((p) => p.count),
        backgroundColor: ["#10b981", "#1B70A6", "#f59e0b"],
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  const stockData = {
    labels: stockInsights.map((s) => s.label),
    datasets: [
      {
        label: "Products",
        data: stockInsights.map((s) => s.count),
        backgroundColor: stockInsights.map((s) => {
          const l = s.label?.toLowerCase() || "";
          if (l.includes("high")) return "#10b981";
          if (l.includes("low")) return "#f59e0b";
          return "#1B70A6";
        }),
        borderRadius: 8,
        barThickness: 28,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 } },
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, font: { size: 11 } },
        grid: { color: "#f1f5f9" },
      },
    },
  };

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* Top Categories — Doughnut */}
      <Card
        className="border-0 shadow-sm"
        title={
          <span className="flex items-center gap-2 text-sm font-semibold">
            <FolderOpen size={16} className="text-[#1B70A6]" />
            Top Categories
          </span>
        }
      >
        {topCategories.length === 0 ? (
          <Empty description="No data" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <div className="h-[240px]">
            <Doughnut data={categoryData} options={chartOptions} />
          </div>
        )}
      </Card>

      {/* Price Distribution — Doughnut */}
      <Card
        className="border-0 shadow-sm"
        title={
          <span className="flex items-center gap-2 text-sm font-semibold">
            <CircleDollarSign size={16} className="text-emerald-600" />
            Price Distribution
          </span>
        }
      >
        {priceDistribution.length === 0 ? (
          <Empty description="No data" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <div className="h-[240px]">
            <Doughnut data={priceData} options={chartOptions} />
          </div>
        )}
      </Card>

      {/* Stock Insights — Bar */}
      <Card
        className="border-0 shadow-sm"
        title={
          <span className="flex items-center gap-2 text-sm font-semibold">
            <Boxes size={16} className="text-orange-500" />
            Stock Insights
          </span>
        }
      >
        {stockInsights.length === 0 ? (
          <Empty description="No data" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <div className="h-[240px]">
            <Bar data={stockData} options={barOptions} />
          </div>
        )}
      </Card>
    </div>
  );
}
