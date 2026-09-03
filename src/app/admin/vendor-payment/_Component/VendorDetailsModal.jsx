"use client";

import { useState } from "react";
import {
  Modal,
  Avatar,
  Tag,
  Descriptions,
  Table,
  Empty,
  Spin,
  Card,
  Statistic,
} from "antd";
import { useVendortransctionQuery } from "@/redux/api/transactionApi";
import dayjs from "dayjs";

export default function VendorDetailsModal({ open, setOpen, vendor }) {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isFetching } = useVendortransctionQuery(
    {
      id: vendor?._id,
      page,
      limit,
      searchText: "",
    },
    { skip: !vendor?._id || !open },
  );

  const summary = data?.data;
  const transactions = summary?.transction || [];
  const meta = data?.meta;

  const columns = [
    {
      title: "Txn ID",
      dataIndex: "id",
      render: (v) => (
        <span className="font-mono text-xs font-medium text-[#1B70A6]">
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
      render: (v) => <span className="text-sm text-slate-600">{v || "—"}</span>,
    },
    {
      title: "Paid By",
      dataIndex: "paidBy",
      render: (paidBy) =>
        paidBy ? (
          <div className="flex items-center gap-2">
            <Avatar size={28} src={paidBy.profileAvatar}>
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
  ];

  return (
    <Modal
      title="Vendor Details"
      open={open}
      onCancel={() => {
        setOpen(false);
        setPage(1);
      }}
      footer={null}
      centered
      width={800}
      destroyOnClose
      styles={{ body: { maxHeight: "80vh", overflowY: "auto" } }}
    >
      {!vendor ? (
        <Empty />
      ) : (
        <div className="space-y-5">
          {/* Profile header */}
          <div className="flex flex-wrap items-center gap-4 rounded-xl border p-4">
            <Avatar size={64} src={vendor.profileAvatar}>
              {vendor.name?.[0]}
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-semibold">{vendor.name}</p>
              <p className="text-sm text-slate-500">{vendor.email}</p>
              <div className="mt-1 flex flex-wrap gap-2">
                <Tag color="blue">{vendor.id}</Tag>
                <Tag
                  color={vendor.status === "active" ? "green" : "default"}
                  className="capitalize"
                >
                  {vendor.status}
                </Tag>
                {vendor.isProfileSetUp != null && (
                  <Tag color={vendor.isProfileSetUp ? "cyan" : "orange"}>
                    {vendor.isProfileSetUp
                      ? "Profile complete"
                      : "Setup pending"}
                  </Tag>
                )}
              </div>
            </div>
          </div>

          {/* Stats from transaction API */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Card size="small" className="!border-0 !bg-emerald-50 shadow-sm">
              <Statistic
                title="Current Balance"
                value={summary?.balance ?? vendor.balance ?? 0}
                prefix="$"
                precision={2}
                valueStyle={{ color: "#059669", fontWeight: 700 }}
              />
            </Card>
            <Card size="small" className="!border-0 !bg-blue-50 shadow-sm">
              <Statistic
                title="This Month"
                value={summary?.thisMonthTransction ?? 0}
                prefix="$"
                precision={2}
                valueStyle={{ color: "#1B70A6", fontWeight: 700 }}
              />
            </Card>
            <Card size="small" className="!border-0 !bg-slate-50 shadow-sm">
              <Statistic
                title="Total Paid"
                value={summary?.totalTransction ?? 0}
                prefix="$"
                precision={2}
                valueStyle={{ fontWeight: 700 }}
              />
            </Card>
          </div>

          {/* Info */}
          <Descriptions bordered size="small" column={2}>
            <Descriptions.Item label="Vendor ID">{vendor.id}</Descriptions.Item>
            <Descriptions.Item label="Role">
              <span className="capitalize">{vendor.role || "vendor"}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Address" span={2}>
              {vendor.address || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Joined">
              {vendor.createdAt
                ? dayjs(vendor.createdAt).format("DD MMM YYYY, hh:mm A")
                : "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {vendor.email || "—"}
            </Descriptions.Item>
          </Descriptions>

          {/* Transaction history */}
          <div>
            <h4 className="mb-3 font-semibold">Payment History</h4>
            {isLoading || isFetching ? (
              <div className="flex h-40 items-center justify-center">
                <Spin size="large" />
              </div>
            ) : transactions.length === 0 ? (
              <Empty description="No payments yet" />
            ) : (
              <Table
                rowKey="_id"
                columns={columns}
                dataSource={transactions}
                size="small"
                scroll={{ x: "max-content" }}
                pagination={{
                  current: page,
                  pageSize: limit,
                  total: meta?.total || 0,
                  onChange: setPage,
                  showTotal: (t) => `Total ${t} transactions`,
                  size: "small",
                }}
              />
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
