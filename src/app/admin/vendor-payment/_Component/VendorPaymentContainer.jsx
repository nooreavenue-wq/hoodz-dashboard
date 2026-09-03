"use client";

import { useState } from "react";
import {
  Table,
  Input,
  Tag,
  Avatar,
  Button,
  Tooltip,
  ConfigProvider,
} from "antd";
import { Search, Eye, Wallet } from "lucide-react";
import { useGetAllVendorsQuery } from "@/redux/api/userApi";
import VendorDetailsModal from "./VendorDetailsModal";
import VendorPaymentModal from "./VendorPaymentModal";
import dayjs from "dayjs";

export default function VendorPaymentContainer() {
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, isFetching } = useGetAllVendorsQuery({
    page,
    limit,
    searchText,
  });

  const vendors = data?.data || [];

  const columns = [
    {
      title: "Vendor",
      dataIndex: "name",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar size={42} src={record.profileAvatar}>
            {record.name?.[0]}
          </Avatar>
          <div>
            <p className="font-medium">{record.name}</p>
            <p className="text-xs text-slate-400">{record.email}</p>
          </div>
        </div>
      ),
    },
    {
      title: "ID",
      dataIndex: "id",
      render: (v) => (
        <span className="font-mono text-sm text-[#1B70A6]">{v}</span>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      render: (v) => (
        <span className="block max-w-[180px] truncate text-sm text-slate-600">
          {v || "—"}
        </span>
      ),
    },
    {
      title: "Balance",
      dataIndex: "balance",
      render: (v) => (
        <span
          className={`font-semibold ${
            (v ?? 0) > 0 ? "text-emerald-600" : "text-slate-400"
          }`}
        >
          ${Number(v ?? 0).toFixed(2)}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (v) => (
        <Tag
          color={v === "active" ? "green" : "default"}
          className="capitalize"
        >
          {v}
        </Tag>
      ),
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      render: (v) => (v ? dayjs(v).format("DD MMM YYYY") : "—"),
    },
    {
      title: "Action",
      width: 160,
      render: (_, record) => {
        const balance = Number(record.balance ?? 0);
        return (
          <div className="flex items-center gap-2">
            <Tooltip title="View details">
              <button
                onClick={() => {
                  setSelectedVendor(record);
                  setDetailsOpen(true);
                }}
              >
                <Eye size={18} color="#1B70A6" />
              </button>
            </Tooltip>
            <Button
              type="primary"
              size="small"
              icon={<Wallet size={14} />}
              disabled={balance <= 0}
              onClick={() => {
                setSelectedVendor(record);
                setPaymentOpen(true);
              }}
            >
              Pay
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#1B70A6" } }}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Vendor Payments</h2>
          <p className="text-sm text-slate-500">Settle vendor balances</p>
        </div>
        <Input
          placeholder="Search vendors..."
          prefix={<Search size={16} className="text-slate-400" />}
          className="h-11 max-w-sm !rounded-lg"
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
        dataSource={vendors}
        loading={isLoading || isFetching}
        scroll={{ x: "max-content" }}
        pagination={{
          current: page,
          pageSize: limit,
          total: data?.meta?.total || 0,
          onChange: setPage,
          showTotal: (t) => `Total ${t} vendors`,
        }}
      />

      <VendorDetailsModal
        open={detailsOpen}
        setOpen={setDetailsOpen}
        vendor={selectedVendor}
      />

      <VendorPaymentModal
        open={paymentOpen}
        setOpen={setPaymentOpen}
        vendor={selectedVendor}
      />
    </ConfigProvider>
  );
}
