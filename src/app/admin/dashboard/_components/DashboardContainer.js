"use client";

import { useGetDashboardDataQuery } from "@/redux/api/dashboardApi";
import DashboardStats from "./DashboardStats";
import RecentJoinedUsers from "./RecentJoinedUsers";
import RecentOrdersTable from "./RecentOrdersTable";
import UserGrowthChart from "./UserGrowthChart";
import { useState } from "react";
import { Spin } from "antd";

export default function DashboardPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const { data, isLoading } = useGetDashboardDataQuery({ year });

  const dashboardData = data?.data;

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <DashboardStats stats={dashboardData?.stats} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <UserGrowthChart
            year={year}
            onYearChange={setYear}
            userGrowth={dashboardData?.userGrowth || []}
          />
        </div>
        <div className="xl:col-span-4">
          <RecentJoinedUsers users={dashboardData?.joinedUsers || []} />
        </div>
      </div>
      <RecentOrdersTable orders={dashboardData?.recentOrders || []} />
    </div>
  );
}
