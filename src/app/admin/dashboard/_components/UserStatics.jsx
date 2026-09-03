"use client";
import { DatePicker } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-full bg-black px-3 py-2 text-sm font-medium text-white">
        {Math.round(payload[0].value)} users
      </div>
    );
  }
  return null;
};

export default function UserStatistics() {
  const data = [
    { month: "Jan", user: 12 },
    { month: "Feb", user: 40 },
    { month: "Mar", user: 52 },
    { month: "Apr", user: 22 },
    { month: "May", user: 53 },
    { month: "Jun", user: 10 },
    { month: "Jul", user: 193 },
    { month: "Aug", user: 134 },
    { month: "Sep", user: 84 },
    { month: "Oct", user: 26 },
    { month: "Nov", user: 164 },
    { month: "Dec", user: 11 },
  ];

  return (
    <div className="max-w-8xl mx-auto w-full rounded-lg bg-white p-6 shadow-lg">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">
          Users statistic
        </h2>
        <div>
          <DatePicker
            // value={selectedYear ? moment(selectedYear, "YYYY") : null}
            // onChange={handleChange}
            picker="year"
            placeholder="Select Year"
            style={{ width: 120 }}
          />
        </div>
      </div>

      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 6"
              stroke="#0B607E"
              horizontal={false}
              vertical={true}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 14, fill: "#000000" }}
              dy={10}
            />
            <YAxis
              domain={[0, 12]}
              ticks={[0, 2, 4, 6, 8, 10, 12]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 14, fill: "#0B607E" }}
              dx={-10}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "transparent" }}
              position={{ y: -10 }}
            />
            <Line
              type="monotone"
              dataKey="user"
              stroke="#0B607E"
              strokeWidth={3}
              dot={{ fill: "black", strokeWidth: 0, r: 8 }}
              activeDot={{ r: 6, fill: "#ffffff", strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
