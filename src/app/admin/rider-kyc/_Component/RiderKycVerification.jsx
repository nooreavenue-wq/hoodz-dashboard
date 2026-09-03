"use client";

import { useState } from "react";
import {
  Table,
  Input,
  Image,
  Tag,
  ConfigProvider,
  Tooltip,
  Avatar,
} from "antd";
import { Search, Eye, Filter } from "lucide-react";
import { useGetRiderKycListQuery } from "@/redux/api/riderkycApi";
import dayjs from "dayjs";
import RiderKycDetailsModal from "./RiderKycDetailsModal";

const statusColors = {
  pending: "orange",
  approved: "green",
  rejected: "red",
};

export default function RiderKycVerification({ limit = 10 }) {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedKycId, setSelectedKycId] = useState(null);

  const { data, isLoading } = useGetRiderKycListQuery({
    page: currentPage,
    limit,
    searchText,
  });

  const tableData = data?.data?.map((item, index) => ({
    key: item._id || index,
    id: item._id,
    name: item.user?.name || "N/A",
    email: item.user?.email || "N/A",
    phone: item.user?.phone
      ? `${item.user?.countryCode || ""} ${item.user.phone}`
      : "N/A",
    avatar: item.user?.profileAvatar,
    vehicle: item.vehicle || "N/A",
    status: item.status,
    createdAt: item.createdAt,
    license: item.license?.[0],
    nationalId: item.nationalId?.[0],
  }));

  const columns = [
    {
      title: "Rider",
      dataIndex: "name",
      render: (value, record) => (
        <div className="flex items-center gap-3">
          <Avatar size={44} src={record.avatar}>
            {value?.[0]}
          </Avatar>
          <div>
            <p className="font-medium">{value}</p>
            <p className="text-xs text-gray-400">{record.email}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Vehicle",
      dataIndex: "vehicle",
      render: (value) => <span className="capitalize">{value}</span>,
    },
    {
      title: "Documents",
      key: "docs",
      render: (_, record) => (
        <div className="flex gap-2">
          {record.license && (
            <Image
              src={record.license}
              width={40}
              height={40}
              alt="image"
              className="rounded object-cover"
              fallback="https://via.placeholder.com/40?text=Lic"
            />
          )}
          {record.nationalId && (
            <Image
              src={record.nationalId}
              width={40}
              height={40}
              alt="image"
              className="rounded object-cover"
              fallback="https://via.placeholder.com/40?text=NID"
            />
          )}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      filters: [
        { text: "Pending", value: "pending" },
        { text: "Approved", value: "approved" },
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
      title: "Submitted",
      dataIndex: "createdAt",
      render: (value) =>
        value ? dayjs(value).format("DD MMM YYYY, hh:mm A") : "N/A",
    },
    {
      title: "Action",
      key: "action",
      width: 80,
      render: (_, record) => (
        <Tooltip title="View & Review">
          <button
            onClick={() => {
              setSelectedKycId(record.id);
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
          placeholder="Search by name or email..."
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
          showTotal: (total) => `Total ${total} KYC requests`,
        }}
      />

      <RiderKycDetailsModal
        open={modalOpen}
        setOpen={setModalOpen}
        kycId={selectedKycId}
      />
    </ConfigProvider>
  );
}
