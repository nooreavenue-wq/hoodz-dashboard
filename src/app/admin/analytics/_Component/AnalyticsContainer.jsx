"use client";

import { useState, useMemo } from "react";
import { Card, Statistic, Spin, DatePicker, Empty, ConfigProvider } from "antd";
import {
  Users,
  Store,
  Bike,
  Headphones,
  ShoppingBag,
  DollarSign,
} from "lucide-react";
import { useGetanalyticsQuery } from "@/redux/api/dashboardApi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import dayjs from "dayjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
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

const sortByMonth = (arr, valueKey) => {
  const sorted = [...(arr || [])].sort(
    (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month),
  );
  return {
    labels: sorted.map(
      (i) => monthLabels[monthOrder.indexOf(i.month)] || i.month,
    ),
    values: sorted.map((i) => i[valueKey] ?? 0),
  };
};

export default function AnalyticsContainer() {
  const [year, setYear] = useState(new Date().getFullYear());

  // API expects these filter params — year used for all
  const { data, isLoading } = useGetanalyticsQuery({
    revenueFilter: year,
    orderFilter: year,
    categoryFilter: year,
    performenceFilter: year,
  });

  const analytics = data?.data;

  const revenueChart = useMemo(() => {
    const { labels, values } = sortByMonth(
      analytics?.revenueAnalysis,
      "amount",
    );
    return {
      labels,
      datasets: [
        {
          label: "Revenue ($)",
          data: values,
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.15)",
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }, [analytics?.revenueAnalysis]);

  const orderChart = useMemo(() => {
    const { labels, values } = sortByMonth(analytics?.orderAnalysis, "count");
    return {
      labels,
      datasets: [
        {
          label: "Orders",
          data: values,
          backgroundColor: "#3b82f6",
          borderRadius: 6,
        },
      ],
    };
  }, [analytics?.orderAnalysis]);

  const performanceChart = useMemo(() => {
    const sorted = [...(analytics?.ordersPerformance || [])].sort(
      (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month),
    );
    return {
      labels: sorted.map(
        (i) => monthLabels[monthOrder.indexOf(i.month)] || i.month,
      ),
      datasets: [
        {
          label: "Completed",
          data: sorted.map((i) => i.completeOrders ?? 0),
          backgroundColor: "#10b981",
          borderRadius: 4,
        },
        {
          label: "Cancelled",
          data: sorted.map((i) => i.cancelOrders ?? 0),
          backgroundColor: "#ef4444",
          borderRadius: 4,
        },
      ],
    };
  }, [analytics?.ordersPerformance]);

  const categoryChart = useMemo(() => {
    const cats = analytics?.categoryAnalysis || [];
    const colors = [
      "#3b82f6",
      "#10b981",
      "#f59e0b",
      "#8b5cf6",
      "#ef4444",
      "#06b6d4",
      "#ec4899",
    ];
    return {
      labels: cats.map((c) => c.category),
      datasets: [
        {
          data: cats.map((c) => c.percentage),
          backgroundColor: cats.map((_, i) => colors[i % colors.length]),
          borderWidth: 0,
        },
      ],
    };
  }, [analytics?.categoryAnalysis]);

  const stats = [
    {
      title: "Total Users",
      value: analytics?.totalUsers ?? 0,
      icon: <Users className="text-blue-600" size={28} />,
      bg: "from-blue-50 to-blue-100/50",
    },
    {
      title: "Total Vendors",
      value: analytics?.totalVendors ?? 0,
      icon: <Store className="text-green-600" size={28} />,
      bg: "from-green-50 to-green-100/50",
    },
    {
      title: "Total Riders",
      value: analytics?.totalRiders ?? 0,
      icon: <Bike className="text-purple-600" size={28} />,
      bg: "from-purple-50 to-purple-100/50",
    },
    {
      title: "Total Agents",
      value: analytics?.totalAgents ?? 0,
      icon: <Headphones className="text-orange-600" size={28} />,
      bg: "from-orange-50 to-orange-100/50",
    },
    {
      title: "Total Orders",
      value: analytics?.totalOrders ?? 0,
      icon: <ShoppingBag className="text-cyan-600" size={28} />,
      bg: "from-cyan-50 to-cyan-100/50",
    },
    {
      title: "Total Revenue",
      value: analytics?.revenue ?? 0,
      prefix: "$",
      icon: <DollarSign className="text-emerald-600" size={28} />,
      bg: "from-emerald-50 to-emerald-100/50",
    },
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "right" },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.raw}%`,
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="py-20">
        <Empty description="No analytics data" />
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: "#1B70A6" },
      }}
    >
      <div className="space-y-8">
        {/* Header + Year */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Analytics Overview</h2>
          <DatePicker
            picker="year"
            value={dayjs().year(year)}
            allowClear={false}
            onChange={(date) => {
              if (date) setYear(date.year());
            }}
            className="w-32"
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {stats.map((stat) => (
            <Card
              key={stat.title}
              className={`border-0 bg-gradient-to-br ${stat.bg} shadow-sm`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    {stat.title}
                  </p>
                  <Statistic
                    value={stat.value}
                    prefix={stat.prefix}
                    valueStyle={{ fontSize: 22, fontWeight: 700 }}
                  />
                </div>
                <div className="rounded-xl bg-white/80 p-2.5 shadow-sm">
                  {stat.icon}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Revenue + Orders */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Card title="Revenue Analysis" className="shadow-sm">
            <div style={{ height: 300 }}>
              <Line data={revenueChart} options={chartOptions} />
            </div>
          </Card>

          <Card title="Order Analysis" className="shadow-sm">
            <div style={{ height: 300 }}>
              <Bar data={orderChart} options={chartOptions} />
            </div>
          </Card>
        </div>

        {/* Performance + Category */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Card title="Orders Performance" className="shadow-sm">
            <div style={{ height: 300 }}>
              <Bar
                data={performanceChart}
                options={{
                  ...chartOptions,
                  scales: {
                    x: { stacked: false },
                    y: { beginAtZero: true },
                  },
                }}
              />
            </div>
          </Card>

          <Card title="Category Distribution" className="shadow-sm">
            {(analytics?.categoryAnalysis || []).length === 0 ? (
              <div className="flex h-[300px] items-center justify-center">
                <Empty description="No category data" />
              </div>
            ) : (
              <div style={{ height: 300 }}>
                <Doughnut data={categoryChart} options={pieOptions} />
              </div>
            )}
          </Card>
        </div>
      </div>
    </ConfigProvider>
  );
}
