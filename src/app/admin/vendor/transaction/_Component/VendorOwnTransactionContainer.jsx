"use client";

import { useState } from "react";
import {
  Table,
  Input,
  Card,
  Statistic,
  Avatar,
  Tooltip,
  ConfigProvider,
  Tag,
} from "antd";
import { Search, Eye } from "lucide-react";
import { useGetVendorOwntransctionQuery } from "@/redux/api/transactionApi";
import VendorOwnTxnDetailsModal from "./VendorOwnTxnDetailsModal";
import dayjs from "dayjs";

export default function VendorOwnTransactionContainer({ limit = 10 }) {
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);

  const { data, isLoading, isFetching } = useGetVendorOwntransctionQuery({
    page,
    limit,
    searchText,
  });

  const summary = data?.data;
  const transactions = summary?.transction || [];

  const columns = [
    {
      title: "Txn ID",
      dataIndex: "id",
      render: (v) => (
        <span className="font-mono text-sm font-medium text-[#1B70A6]">
          {v}
        </span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (v) => (
        <span className="font-semibold text-emerald-600">
          ${Number(v ?? 0).toFixed(2)}
        </span>
      ),
    },
    {
      title: "Note",
      dataIndex: "note",
      render: (v) => (
        <span className="block max-w-[160px] truncate text-sm text-slate-600">
          {v || "—"}
        </span>
      ),
    },
    {
      title: "Paid By",
      dataIndex: "paidBy",
      render: (paidBy) =>
        paidBy ? (
          <div className="flex items-center gap-2">
            <Avatar size={32} src={paidBy.profileAvatar}>
              {paidBy.name?.[0]}
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-tight">{paidBy.name}</p>
              <p className="text-[11px] capitalize text-slate-400">
                {paidBy.role}
              </p>
            </div>
          </div>
        ) : (
          "—"
        ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (v) => (v ? dayjs(v).format("DD MMM YYYY, hh:mm A") : "—"),
    },
    {
      title: "Action",
      width: 70,
      render: (_, record) => (
        <Tooltip title="View details">
          <button
            onClick={() => {
              setSelectedTxn(record);
              setDetailsOpen(true);
            }}
          >
            <Eye size={18} color="#1B70A6" />
          </button>
        </Tooltip>
      ),
    },
  ];

  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#1B70A6" } }}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">My Payment History</h2>
        <p className="text-sm text-slate-500">
          Settlements received from admin
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="!border-0 !bg-emerald-50 shadow-sm">
          <Statistic
            title="Current Balance"
            value={summary?.balance ?? 0}
            prefix="$"
            precision={2}
            valueStyle={{ color: "#059669", fontWeight: 700 }}
          />
        </Card>
        <Card className="!border-0 !bg-blue-50 shadow-sm">
          <Statistic
            title="This Month"
            value={summary?.thisMonthTransction ?? 0}
            prefix="$"
            precision={2}
            valueStyle={{ color: "#1B70A6", fontWeight: 700 }}
          />
        </Card>
        <Card className="!border-0 !bg-slate-50 shadow-sm">
          <Statistic
            title="Total Received"
            value={summary?.totalTransction ?? 0}
            prefix="$"
            precision={2}
            valueStyle={{ fontWeight: 700 }}
          />
        </Card>
      </div>

      <div className="mb-4 ml-auto max-w-sm">
        <Input
          placeholder="Search transactions..."
          prefix={<Search size={16} className="text-slate-400" />}
          className="h-11 !rounded-lg"
          allowClear
          onChange={(e) => {
            setSearchText(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={transactions}
        loading={isLoading || isFetching}
        scroll={{ x: "max-content" }}
        pagination={{
          current: page,
          pageSize: limit,
          total: data?.meta?.total || 0,
          onChange: setPage,
          showTotal: (t) => `Total ${t} transactions`,
        }}
      />

      <VendorOwnTxnDetailsModal
        open={detailsOpen}
        setOpen={setDetailsOpen}
        transaction={selectedTxn}
      />
    </ConfigProvider>
  );
}
