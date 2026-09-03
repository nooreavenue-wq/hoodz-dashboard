"use client";

import { useState } from "react";
import { Table, Input, Tag, Tooltip, ConfigProvider } from "antd";
import { Search, Eye, Filter } from "lucide-react";
import GrievanceDetailsModal from "./GrievanceDetailsModal";
import dayjs from "dayjs";
import { useGetGriavanceQuery } from "@/redux/api/grieavenceApi";

const statusColors = {
  pending: "orange",
  resolved: "green",
  rejected: "red",
  processing: "blue",
};

const issueLabels = {
  delay_delivery: "Delay Delivery",
  damaged_product: "Damaged Product",
  wrong_item: "Wrong Item",
  missing_item: "Missing Item",
  other: "Other",
};

export default function GrievanceContainer({ limit = 10 }) {
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const { data, isLoading } = useGetGriavanceQuery({
    page,
    limit,
    searchText,
  });

  const rows = (data?.data || []).map((item, i) => ({
    key: item._id || i,
    id: item._id,
    userName: item.user?.name || "N/A",
    orderId: item.order?.id || "—",
    issueType: item.issueType,
    description: item.description,
    status: item.status,
    filesCount: item.files?.length || 0,
    createdAt: item.createdAt,
  }));

  const columns = [
    {
      title: "User",
      dataIndex: "userName",
      render: (v) => <span className="font-medium">{v}</span>,
    },
    {
      title: "Order",
      dataIndex: "orderId",
      render: (v) => (
        <span className="font-mono text-sm text-[#1B70A6]">{v}</span>
      ),
    },
    {
      title: "Issue",
      dataIndex: "issueType",
      filters: Object.entries(issueLabels).map(([value, text]) => ({
        text,
        value,
      })),
      filterIcon: (filtered) => (
        <Filter size={16} color={filtered ? "#1B70A6" : "#000"} />
      ),
      onFilter: (value, record) => record.issueType === value,
      render: (v) => (
        <Tag className="capitalize">
          {issueLabels[v] || v?.replace(/_/g, " ")}
        </Tag>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (v) => (
        <span className="block max-w-[220px] truncate text-sm text-slate-600">
          {v || "—"}
        </span>
      ),
    },
    // {
    //   title: "Files",
    //   dataIndex: "filesCount",
    //   render: (v) => (v ? `${v} file(s)` : "—"),
    // },
    {
      title: "Status",
      dataIndex: "status",
      filters: [
        { text: "under_review", value: "under_review" },
        { text: "Resolved", value: "resolved" },
        { text: "Rejected", value: "rejected" },
      ],
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
    <ConfigProvider theme={{ token: { colorPrimary: "#1B70A6" } }}>
      <div className="mb-4 ml-auto w-full max-w-sm">
        <Input
          placeholder="Search grievances..."
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
          showTotal: (t) => `Total ${t} grievances`,
        }}
      />

      <GrievanceDetailsModal
        open={modalOpen}
        setOpen={setModalOpen}
        grievanceId={selectedId}
      />
    </ConfigProvider>
  );
}
