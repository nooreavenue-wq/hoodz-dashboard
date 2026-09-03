"use client";

import { useState } from "react";
import {
  Table,
  Input,
  Tag,
  ConfigProvider,
  Tooltip,
  Avatar,
  Card,
  Statistic,
} from "antd";
import { Search, Eye, DollarSign } from "lucide-react";
import { useGetTopUpTransListQuery } from "@/redux/api/topuptransapi";
import dayjs from "dayjs";
import TopUpDetailsModal from "./TopUpDetailsModal";

const statusColors = {
  paid: "green",
  pending: "orange",
  failed: "red",
  cancelled: "default",
};

export default function TopUpTransactionContainer({ limit = 10 }) {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const { data, isLoading } = useGetTopUpTransListQuery({
    page: currentPage,
    limit,
    searchText,
  });

  const summary = data?.data;
  const transactions = summary?.topUpTransctions || [];
  const totalReceived = summary?.totalTopUpReceived ?? 0;

  const tableData = transactions.map((item, index) => ({
    key: item._id || index,
    id: item._id,
    orderId: item.id,
    name: item.user?.name || "N/A",
    avatar: item.user?.profileAvatar,
    amount: item.amount,
    paymentMethod: item.paymentMethod,
    status: item.status,
    transactionId: item.transactionId,
    isPaid: item.isPaid,
    createdAt: item.createdAt,
    balanceAppliedAt: item.balanceAppliedAt,
  }));

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "orderId",
      render: (value) => (
        <span className="font-medium text-[#1B70A6]">{value}</span>
      ),
    },
    {
      title: "User",
      dataIndex: "name",
      render: (value, record) => (
        <div className="flex items-center gap-3">
          <Avatar size={40} src={record.avatar}>
            {value?.[0]}
          </Avatar>
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (value) => (
        <span className="font-semibold text-green-600">${value}</span>
      ),
    },
    {
      title: "Method",
      dataIndex: "paymentMethod",
      render: (value) => <Tag className="capitalize">{value || "N/A"}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (value) => (
        <Tag color={statusColors[value] || "default"} className="capitalize">
          {value}
        </Tag>
      ),
    },
    {
      title: "Gateway Txn ID",
      dataIndex: "transactionId",
      render: (value) => (
        <span className="font-mono text-sm text-slate-600">{value || "—"}</span>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (value) =>
        value ? dayjs(value).format("DD MMM YYYY, hh:mm A") : "N/A",
    },
    {
      title: "Action",
      key: "action",
      width: 80,
      render: (_, record) => (
        <Tooltip title="View Details">
          <button
            onClick={() => {
              setSelectedId(record.id);
              setModalOpen(true);
            }}
          >
            <Eye size={20} color="#1B70A6" />
          </button>
        </Tooltip>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: "#1B70A6" },
      }}
    >
      {/* Summary Card */}
      <div className="mb-6">
        <Card className="border-0 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-md">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
              <DollarSign size={28} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Top-Up Received
              </p>
              <Statistic
                value={totalReceived}
                prefix="$"
                valueStyle={{
                  color: "#059669",
                  fontWeight: 700,
                  fontSize: 28,
                }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-4 ml-auto w-full max-w-sm">
        <Input
          placeholder="Search by user or transaction id..."
          prefix={<Search size={18} className="mr-1 text-gray-400" />}
          className="h-11 !rounded-lg"
          allowClear
          onChange={(e) => {
            setSearchText(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={tableData}
        loading={isLoading}
        scroll={{ x: "max-content" }}
        pagination={{
          current: currentPage,
          pageSize: limit,
          total: data?.meta?.total || 0,
          onChange: (page) => setCurrentPage(page),
          showTotal: (total) => `Total ${total} transactions`,
        }}
      />

      <TopUpDetailsModal
        open={modalOpen}
        setOpen={setModalOpen}
        transactionId={selectedId}
      />
    </ConfigProvider>
  );
}
