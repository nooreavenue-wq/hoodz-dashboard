"use client";

import { useState } from "react";
import { Table, Input, Tag, Avatar, ConfigProvider, Tooltip } from "antd";
import { Search, Eye, Filter } from "lucide-react";
import dayjs from "dayjs";
import { useGetWithdrawalsQuery } from "@/redux/api/withdrawApi";
import WithdrawalDetailsModal from "./WithdrawalDetailsModal";

const statusColors = {
  pending: "orange",
  completed: "green",
  rejected: "red",
  processing: "blue",
};

export default function WithdrawalContainer({ limit = 10 }) {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const { data, isLoading } = useGetWithdrawalsQuery({
    page: currentPage,
    limit,
    searchTerm: searchText,
  });

  const tableData = data?.data?.map((item, index) => ({
    key: item._id || index,
    id: item._id,
    requestId: item.id,
    name: item.author?.name || "N/A",
    avatar: item.author?.profileAvatar,
    amount: item.amount,
    status: item.status,
    note: item.note,
    createdAt: item.createdAt,
  }));

  const columns = [
    {
      title: "Request ID",
      dataIndex: "requestId",
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
        <span className="font-semibold text-emerald-600">${value}</span>
      ),
    },
    {
      title: "Note",
      dataIndex: "note",
      render: (value) => (
        <span className="max-w-[200px] truncate text-sm text-slate-500">
          {value || "—"}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      filters: [
        { text: "Pending", value: "pending" },
        { text: "Completed", value: "completed" },
        { text: "Rejected", value: "rejected" },
      ],
      filterIcon: (filtered) => (
        <Filter size={16} color={filtered ? "#1B70A6" : "#000"} />
      ),
      onFilter: (value, record) => record.status === value,
      render: (value) => (
        <Tag color={statusColors[value] || "default"} className="capitalize">
          {value}
        </Tag>
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
        <Tooltip title="View & Manage">
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
      <div className="mb-4 ml-auto w-full max-w-sm">
        <Input
          placeholder="Search by user or request id..."
          prefix={<Search size={18} className="mr-1 text-gray-400" />}
          className="h-11 !rounded-lg"
          allowClear
          onChange={(e) => {
            setSearchText(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

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
          showTotal: (total) => `Total ${total} requests`,
        }}
      />

      <WithdrawalDetailsModal
        open={modalOpen}
        setOpen={setModalOpen}
        withdrawalId={selectedId}
      />
    </ConfigProvider>
  );
}
