"use client";

import { Select } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  defs,
  linearGradient,
  stop,
} from "recharts";
import { useState } from "react";

// dummy data
const data = [
  { month: "Jan", user: 120 },
  { month: "Feb", user: 140 },
  { month: "Mar", user: 15 },
  { month: "Apr", user: 12 },
  { month: "May", user: 153 },
  { month: "Jun", user: 64 },
  { month: "Jul", user: 193 },
  { month: "Aug", user: 34 },
  { month: "Sep", user: 84 },
  { month: "Oct", user: 26 },
  { month: "Nov", user: 64 },
  { month: "Dec", user: 10 },
];

const EarningSummary = () => {
  const [selectedYear, setSelectedYear] = useState("2024");

  const handleChange = (value) => {
    setSelectedYear(value);
  };

  return (
    <div className="max-w-8xl mx-auto w-full rounded-lg bg-white p-6 shadow-lg">
      <div className="mb-10 flex items-center justify-between gap-2 lg:flex-wrap xl:flex-nowrap">
        <h1 className="text-xl font-bold">Earning summary</h1>

        <div className="space-x-3">
          <Select
            value={selectedYear}
            style={{ width: 120 }}
            onChange={handleChange}
            options={[
              { value: "2024", label: "2024" },
              { value: "2023", label: "2023" },
              { value: "2022", label: "2022" },
              { value: "2021", label: "2021" },
            ]}
          />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={375}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
          barSize={20}
        >
          {/* Define Gradient */}
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#41839E" stopOpacity={1} />
              <stop offset="100%" stopColor="#0B607E" stopOpacity={1} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="month"
            scale="point"
            padding={{ left: 10, right: 10 }}
            tickMargin={10}
            tickLine={false}
            axisLine={false}
          />
          <YAxis axisLine={false} tickLine={false} tickMargin={20} />

          <Tooltip
            formatter={(value) => [`Monthly Earnings: ${value}`]}
            contentStyle={{
              color: "var(--primary-green)",
              fontWeight: "500",
              borderRadius: "5px",
              border: "0",
            }}
          />

          <CartesianGrid
            opacity={0.2}
            horizontal={true}
            vertical={false}
            stroke="#080E0E"
            strokeDasharray="3 3"
          />

          <Bar
            barSize={35}
            radius={5}
            background={false}
            dataKey="user"
            fill="url(#colorGradient)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EarningSummary;
