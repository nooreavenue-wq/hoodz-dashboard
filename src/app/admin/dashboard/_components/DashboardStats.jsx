"use client";

import { Card, Statistic } from "antd";
import {
  ShoppingCartOutlined,
  DollarOutlined,
  ShoppingOutlined,
  RiseOutlined,
  WarningOutlined,
  AppstoreAddOutlined,
  CreditCardOutlined,
  PercentageOutlined,
} from "@ant-design/icons";

export default function DashboardStats({ stats }) {
  const items = [
    {
      title: "Total Orders",
      value: stats?.orders ?? 0,
      icon: <ShoppingCartOutlined className="text-4xl text-blue-600" />,
    },
    {
      title: "Avg. Order Price",
      value: stats?.ordersAveragePrice ?? 0,
      icon: <PercentageOutlined className="text-4xl text-cyan-600" />,
      prefix: "$",
      precision: 2,
    },
    {
      title: "Total Sales",
      value: stats?.totalSales ?? 0,
      icon: <DollarOutlined className="text-4xl text-green-600" />,
      prefix: "$",
    },
    {
      title: "Net Revenue",
      value: stats?.netRevenue ?? 0,
      icon: <RiseOutlined className="text-4xl text-purple-600" />,
      prefix: "$",
    },
    {
      title: "Add to Cart",
      value: stats?.addToCartCount ?? 0,
      icon: <AppstoreAddOutlined className="text-4xl text-indigo-600" />,
    },
    {
      title: "Initiate Checkout",
      value: stats?.initiateCheckoutCount ?? 0,
      icon: <CreditCardOutlined className="text-4xl text-teal-600" />,
    },
    {
      title: "Unread Orders",
      value: stats?.unreadOrders ?? 0,
      icon: <ShoppingOutlined className="text-4xl text-orange-600" />,
    },
    {
      title: "Missed Orders",
      value: stats?.missedOrder ?? 0,
      icon: <WarningOutlined className="text-4xl text-red-600" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((stat, index) => (
        <Card
          key={index}
          className="border-0 bg-gradient-to-br from-white to-slate-50 shadow-lg transition-all duration-300 hover:shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>
              <Statistic
                value={stat.value}
                prefix={stat.prefix}
                precision={stat.precision}
                className="mt-1 text-3xl font-bold text-slate-800"
              />
            </div>
            <div className="rounded-2xl bg-white p-3 shadow-sm">
              {stat.icon}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
