"use client";

import { useState } from "react";
import {
  Table,
  Input,
  Tag,
  Avatar,
  Tooltip,
  ConfigProvider,
  Image,
} from "antd";
import { Search, Eye, Filter } from "lucide-react";
import { useGetDepositsQuery } from "@/redux/api/depositApi";
import DepositDetailsModal from "./DepositDetailsModal";
import dayjs from "dayjs";

const statusColors = {
  pending: "orange",
  completed: "green",
  rejected: "red",
};

export default function DepositContainer({ limit = 10 }) {
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const { data, isLoading } = useGetDepositsQuery({
    page,
    limit,
    searchText,
  });

  const rows = (data?.data || []).map((item, i) => ({
    key: item._id || i,
    id: item._id,
    depositId: item.id,
    name: item.author?.name || "N/A",
    avatar: item.author?.profileAvatar,
    amount: item.amount,
    fawryRefNo: item.fawryRefNo,
    receiptFiles: item.receiptFiles || [],
    status: item.status,
    note: item.note,
    jobsCount: item.jobIds?.length || 0,
    createdAt: item.createdAt,
  }));

  const columns = [
    {
      title: "Deposit ID",
      dataIndex: "depositId",
      render: (v) => (
        <span className="font-mono font-medium text-[#1B70A6]">{v}</span>
      ),
    },
    {
      title: "Rider",
      dataIndex: "name",
      render: (v, r) => (
        <div className="flex items-center gap-3">
          <Avatar size={40} src={r.avatar}>
            {v?.[0]}
          </Avatar>
          <span className="font-medium">{v}</span>
        </div>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (v) => (
        <span className="font-semibold text-emerald-600">${v}</span>
      ),
    },
    {
      title: "Fawry Ref",
      dataIndex: "fawryRefNo",
      render: (v) => <span className="font-mono text-sm">{v || "—"}</span>,
    },
    {
      title: "Receipt",
      dataIndex: "receiptFiles",
      render: (files) =>
        files?.length ? (
          <Image.PreviewGroup>
            <div className="flex gap-1">
              {files.slice(0, 2).map((f, i) => (
                <Image
                  key={i}
                  src={f}
                  alt="receipt"
                  width={36}
                  height={36}
                  className="rounded object-cover"
                />
              ))}
              {files.length > 2 && (
                <span className="text-xs text-slate-400">
                  +{files.length - 2}
                </span>
              )}
            </div>
          </Image.PreviewGroup>
        ) : (
          "—"
        ),
    },
    {
      title: "Jobs",
      dataIndex: "jobsCount",
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
      render: (v) => (
        <Tag color={statusColors[v] || "default"} className="capitalize">
          {v}
        </Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (v) => (v ? dayjs(v).format("DD MMM YYYY, hh:mm A") : "—"),
    },
    {
      title: "Action",
      width: 80,
      render: (_, record) => (
        <Tooltip title="View & Verify">
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
    <ConfigProvider theme={{ token: { colorPrimary: "#1B70A6" } }}>
      <div className="mb-4 ml-auto w-full max-w-sm">
        <Input
          placeholder="Search deposits..."
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
        columns={columns}
        dataSource={rows}
        loading={isLoading}
        scroll={{ x: "max-content" }}
        pagination={{
          current: page,
          pageSize: limit,
          total: data?.meta?.total || 0,
          onChange: setPage,
          showTotal: (t) => `Total ${t} deposits`,
        }}
      />

      <DepositDetailsModal
        open={modalOpen}
        setOpen={setModalOpen}
        depositId={selectedId}
      />
    </ConfigProvider>
  );
}
