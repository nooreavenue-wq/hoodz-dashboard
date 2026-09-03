"use client";

import { Image, Input, Table, ConfigProvider, Tooltip, Button } from "antd";
import { Filter, Search, Eye, UserX, CheckCircle } from "lucide-react";
import { useState } from "react";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import ProfileModal from "@/components/SharedModals/ProfileModal";
import {
  useChangeUserStatusMutation,
  useGetAllusersQuery,
} from "@/redux/api/userApi";
import AddAgentVendorModal from "./AddAgentVendorModal";
import toast from "react-hot-toast";

export default function AccDetailsTable({ limit }) {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState("vendor");

  const { data: users, isLoading } = useGetAllusersQuery({
    limit: limit || 10,
    page: currentPage,
    searchText,
  });

  const data = users?.data?.map((user, index) => ({
    key: user?._id || index + 1,
    id: user?._id,
    customId: user?.id || "N/A",
    name: user?.name || "N/A",
    userImg: user?.profileAvatar,
    email: user?.email || "N/A",
    contact: user?.phone || "N/A",
    address: user?.address || "N/A",
    date: user?.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A",
    status: user?.status || "N/A",
    role: user?.role || "N/A",
    balance: user?.balance ?? 0,
    isProfileSetUp: user?.isProfileSetUp,
  }));

  const [changeUserStatus] = useChangeUserStatusMutation();

  const handleStatusChange = async (id, status) => {
    try {
      const res = await changeUserStatus({
        id,
        status,
      }).unwrap();

      if (res?.success) {
        toast.success(res?.message || "User status updated successfully");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update user status");
    }
  };

  const renderActions = (record) => {
    const { status, role } = record;

    return (
      <div className="flex-center-start gap-x-3">
        {/* View Profile */}
        <Tooltip title="Show Details">
          <button
            onClick={() => {
              setSelectedUserId(record.id);
              setSelectedRole(role);
              setProfileModalOpen(true);
            }}
          >
            <Eye color="#1B70A6" size={22} />
          </button>
        </Tooltip>

        {/* Pending → Approve */}
        {status === "pending" && (
          <Tooltip title="Approve User">
            <CustomConfirm
              title="Approve User"
              description="Are you sure you want to approve this user?"
              onConfirm={() => handleStatusChange(record.id, "active")}
            >
              <button>
                <CheckCircle color="#52C41A" size={22} />
              </button>
            </CustomConfirm>
          </Tooltip>
        )}

        {/* Active → Block */}
        {status === "active" && (
          <Tooltip title="Block User">
            <CustomConfirm
              title="Block User"
              description="Are you sure you want to block this user?"
              onConfirm={() => handleStatusChange(record.id, "blocked")}
            >
              <button>
                <UserX color="#F16365" size={22} />
              </button>
            </CustomConfirm>
          </Tooltip>
        )}

        {/* Blocked → Unblock */}
        {status === "blocked" && (
          <Tooltip title="Unblock User">
            <CustomConfirm
              title="Unblock User"
              description="Are you sure you want to unblock this user?"
              onConfirm={() => handleStatusChange(record.id, "active")}
            >
              <button>
                <UserX color="gray" size={22} />
              </button>
            </CustomConfirm>
          </Tooltip>
        )}
      </div>
    );
  };

  const columns = [
    {
      title: "User Name",
      dataIndex: "name",
      render: (value, record) => (
        <div className="flex-center-start gap-x-2">
          {record?.userImg ? (
            <Image
              src={record.userImg}
              alt="User avatar"
              width={48}
              height={48}
              className="aspect-square rounded-full object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
              <UserX size={22} color="#9CA3AF" />
            </div>
          )}
          <div>
            <p className="font-medium">{value}</p>
            <p className="text-xs text-gray-400">{record.customId}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      filters: [
        { text: "User", value: "user" },
        { text: "Vendor", value: "vendor" },
        { text: "Rider", value: "rider" },
        { text: "Agent", value: "agent" },
      ],
      filterIcon: (filtered) => (
        <Filter
          size={16}
          color={filtered ? "#1B70A6" : "#000000"}
          style={{ cursor: "pointer" }}
        />
      ),
      onFilter: (value, record) => record.role === value,
      render: (value) => {
        const colors = {
          user: "bg-blue-100 text-blue-600 border-blue-200",
          vendor: "bg-green-100 text-green-600 border-green-200",
          rider: "bg-purple-100 text-purple-600 border-purple-200",
          agent: "bg-orange-100 text-orange-600 border-orange-200",
        };
        return (
          <span
            className={`rounded-full border px-3 py-1 text-sm font-semibold capitalize ${
              colors[value] || "bg-gray-100 text-gray-600"
            }`}
          >
            {value}
          </span>
        );
      },
    },
    {
      title: "Joining Date",
      dataIndex: "date",
    },
    {
      title: "Status",
      dataIndex: "status",
      filters: [
        { text: "Active", value: "active" },
        { text: "Blocked", value: "blocked" },
        { text: "Pending", value: "pending" },
      ],
      filterIcon: (filtered) => (
        <Filter
          size={16}
          color={filtered ? "#1B70A6" : "#000000"}
          style={{ cursor: "pointer" }}
        />
      ),
      onFilter: (value, record) => record.status === value,
      render: (value) => {
        const colors = {
          active: "bg-green-100 text-green-600 border-green-200",
          blocked: "bg-red-100 text-red-600 border-red-200",
          pending: "bg-yellow-100 text-yellow-600 border-yellow-200",
        };
        return (
          <span
            className={`rounded-full border px-3 py-1 text-sm font-semibold capitalize ${
              colors[value] || "bg-gray-100 text-gray-600"
            }`}
          >
            {value}
          </span>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => renderActions(record),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1B70A6",
          colorInfo: "#1B70A6",
        },
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex w-full gap-10">
          <Button
            type="primary"
            onClick={() => {
              setOpen(true);
              setModalType("vendor");
            }}
            className="h-11 w-1/3"
          >
            {" "}
            Add Vendor
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setOpen(true);
              setModalType("agent");
            }}
            className="h-11 w-1/3"
          >
            {" "}
            Add Agent
          </Button>
        </div>

        <div className="mb-3 ml-auto w-1/3">
          <Input
            placeholder="Search by name or email"
            prefix={<Search className="mr-2 text-black" size={20} />}
            className="h-11 !rounded-lg !border !text-base"
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
            allowClear
          />
        </div>
      </div>

      <Table
        style={{ overflowX: "auto", marginTop: "20px" }}
        columns={columns}
        dataSource={data}
        scroll={{ x: "max-content" }}
        loading={isLoading}
        pagination={{
          current: currentPage,
          pageSize: limit || 10,
          total: users?.meta?.total || 0,
          onChange: (page) => setCurrentPage(page),
          showTotal: (total) => `Total ${total} items`,
        }}
      />

      <ProfileModal
        open={profileModalOpen}
        setOpen={setProfileModalOpen}
        userId={selectedUserId}
        role={selectedRole}
      />
      <AddAgentVendorModal open={open} setOpen={setOpen} type={modalType} />
    </ConfigProvider>
  );
}
