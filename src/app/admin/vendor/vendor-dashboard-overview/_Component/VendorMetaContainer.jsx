"use client";

import { useState, useMemo } from "react";
import { Card, Statistic, Spin, DatePicker, Empty, ConfigProvider } from "antd";
import {
  ShoppingCart,
  DollarSign,
  ShoppingBag,
  CreditCard,
  Mail,
  AlertTriangle,
  TrendingUp,
  Percent,
} from "lucide-react";
import { useGetVendorMetaQuery } from "@/redux/api/vendorMetaApi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import dayjs from "dayjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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

export default function VendorMetaContainer() {
  const [year, setYear] = useState(new Date().getFullYear());

  const { data, isLoading } = useGetVendorMetaQuery({
    ordersEarninigFilter: year,
    ordersCountFilter: year,
  });

  const meta = data?.data;
  const stats = meta?.stats;

  const earningChart = useMemo(() => {
    const { labels, values } = sortByMonth(
      meta?.orderEarningAnalysis,
      "amount",
    );
    return {
      labels,
      datasets: [
        {
          label: "Earnings ($)",
          data: values,
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.12)",
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }, [meta?.orderEarningAnalysis]);

  const countChart = useMemo(() => {
    const { labels, values } = sortByMonth(meta?.orderCountAnalysis, "count");
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
  }, [meta?.orderCountAnalysis]);

  const statCards = [
    {
      title: "Total Orders",
      value: stats?.orders ?? 0,
      icon: <ShoppingCart className="text-blue-600" size={26} />,
      bg: "from-blue-50 to-blue-100/40",
    },
    {
      title: "Avg. Order Price",
      value: stats?.ordersAveragePrice ?? 0,
      prefix: "$",
      precision: 2,
      icon: <Percent className="text-cyan-600" size={26} />,
      bg: "from-cyan-50 to-cyan-100/40",
    },
    {
      title: "Total Sales",
      value: stats?.totalSales ?? 0,
      prefix: "$",
      icon: <DollarSign className="text-green-600" size={26} />,
      bg: "from-green-50 to-green-100/40",
    },
    {
      title: "Net Revenue",
      value: stats?.netRevenue ?? 0,
      prefix: "$",
      icon: <TrendingUp className="text-purple-600" size={26} />,
      bg: "from-purple-50 to-purple-100/40",
    },
    {
      title: "Add to Cart",
      value: stats?.addToCartCount ?? 0,
      icon: <ShoppingBag className="text-indigo-600" size={26} />,
      bg: "from-indigo-50 to-indigo-100/40",
    },
    {
      title: "Initiate Checkout",
      value: stats?.initiateCheckoutCount ?? 0,
      icon: <CreditCard className="text-teal-600" size={26} />,
      bg: "from-teal-50 to-teal-100/40",
    },
    {
      title: "Unread Orders",
      value: stats?.unreadOrders ?? 0,
      icon: <Mail className="text-orange-600" size={26} />,
      bg: "from-orange-50 to-orange-100/40",
    },
    {
      title: "Missed Orders",
      value: stats?.missedOrder ?? 0,
      icon: <AlertTriangle className="text-red-600" size={26} />,
      bg: "from-red-50 to-red-100/40",
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

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!meta) {
    return (
      <div className="py-20">
        <Empty description="No vendor meta data" />
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
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Vendor Dashboard</h2>
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

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
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
                    precision={stat.precision}
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

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Card title="Order Earnings Analysis" className="shadow-sm">
            <div style={{ height: 320 }}>
              <Line data={earningChart} options={chartOptions} />
            </div>
          </Card>

          <Card title="Order Count Analysis" className="shadow-sm">
            <div style={{ height: 320 }}>
              <Bar data={countChart} options={chartOptions} />
            </div>
          </Card>
        </div>
      </div>
    </ConfigProvider>
  );
}
