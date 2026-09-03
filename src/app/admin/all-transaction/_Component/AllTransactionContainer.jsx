"use client";

import { useState } from "react";
import { Table, Input, Tag, Avatar, ConfigProvider, Tooltip } from "antd";
import { Search, Eye, Filter } from "lucide-react";
import { useGetTransactionsQuery } from "@/redux/api/transactionApi";
import dayjs from "dayjs";
import TransactionDetailsModal from "./TransactionDetailsModal";

const statusColors = {
  paid: "green",
  pending: "orange",
  failed: "red",
  cancelled: "default",
  refunded: "purple",
};

const methodColors = {
  wallet: "blue",
  card: "cyan",
  cod: "gold",
  fawry: "purple",
};

export default function AllTransactionContainer({ limit = 10 }) {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const { data, isLoading } = useGetTransactionsQuery({
    page: currentPage,
    limit,
    searchText,
  });

  const tableData = data?.data?.map((item, index) => ({
    key: item._id || index,
    id: item._id,
    txnId: item.id,
    transactionId: item.transactionId,
    paymentIntentId: item.paymentIntentId,
    userName: item.account?.name || "N/A",
    userEmail: item.account?.email,
    userAvatar: item.account?.profileAvatar,
    orderId: item.order?.id,
    orderStatus: item.order?.status,
    amount: item.amount,
    subtotal: item.subtotalAmount,
    deliveryCharge: item.deliveryCharge,
    coinDiscount: item.coinDiscount,
    status: item.status,
    paymentMethod: item.paymentMethod,
    isPaid: item.isPaid,
    createdAt: item.createdAt,
  }));

  const columns = [
    {
      title: "Txn ID",
      dataIndex: "txnId",
      render: (value) => (
        <span className="font-medium text-[#1B70A6]">{value}</span>
      ),
    },
    {
      title: "User",
      dataIndex: "userName",
      render: (value, record) => (
        <div className="flex items-center gap-3">
          <Avatar size={40} src={record.userAvatar}>
            {value?.[0]}
          </Avatar>
          <div>
            <p className="font-medium">{value}</p>
            <p className="text-xs text-slate-400">{record.userEmail}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Order",
      dataIndex: "orderId",
      render: (value, record) => (
        <div>
          <p className="font-medium">{value || "—"}</p>
          {record.orderStatus && (
            <Tag className="mt-1 capitalize">
              {record.orderStatus?.replace(/_/g, " ")}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (value, record) => (
        <div>
          <p className="font-semibold text-emerald-600">${value}</p>
          <p className="text-xs text-slate-400">
            Sub ${record.subtotal} + Del ${record.deliveryCharge}
          </p>
        </div>
      ),
    },
    {
      title: "Method",
      dataIndex: "paymentMethod",
      filters: [
        { text: "Wallet", value: "wallet" },
        { text: "Card", value: "card" },
        { text: "COD", value: "cod" },
        { text: "Fawry", value: "fawry" },
      ],
      filterIcon: (filtered) => (
        <Filter size={16} color={filtered ? "#1B70A6" : "#000"} />
      ),
      onFilter: (value, record) => record.paymentMethod === value,
      render: (value) => (
        <Tag color={methodColors[value] || "default"} className="uppercase">
          {value || "N/A"}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      filters: [
        { text: "Paid", value: "paid" },
        { text: "Pending", value: "pending" },
        { text: "Failed", value: "failed" },
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
      fixed: "right",
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
      <div className="mb-4 ml-auto w-full max-w-sm">
        <Input
          placeholder="Search by user, order or txn id..."
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
          showTotal: (total) => `Total ${total} transactions`,
        }}
      />

      <TransactionDetailsModal
        open={modalOpen}
        setOpen={setModalOpen}
        transactionId={selectedId}
      />
    </ConfigProvider>
  );
}
