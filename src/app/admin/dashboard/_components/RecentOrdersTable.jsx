"use client";

import { Table, Tag, Button } from "antd";

const statusColor = {
  delivered: "green",
  rider_assigned: "blue",
  pending: "orange",
  processing: "processing",
};

export default function RecentOrdersTable({ orders }) {
  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Product",
      key: "product",
      render: (_, record) => record.items?.product?.title || "N/A",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `$${amount}`,
    },
    {
      title: "Payment",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method) => method || "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColor[status] || "default"}>
          {status?.replace("_", " ")}
        </Tag>
      ),
    },
  ];

  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-semibold">Recent Orders</h3>
        <Button type="primary">{orders.length} Orders</Button>
      </div>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="_id"
        pagination={false}
      />
    </div>
  );
}
