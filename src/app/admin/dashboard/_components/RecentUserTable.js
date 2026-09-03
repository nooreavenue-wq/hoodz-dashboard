"use client";

import { ConfigProvider } from "antd";
import { Table } from "antd";

import Image from "next/image";
import userImage from "@/assets/images/user-avatar.png";
import { Tag } from "antd";
import { useState } from "react";
import ProfileModal from "@/components/SharedModals/ProfileModal";

// Dummy Data
const data = Array.from({ length: 4 }).map((_, inx) => ({
  key: inx + 1,
  name: "Moazzem Hossain",
  userImg: userImage,
  email: "booxos@gmail.com",
  contact: "+1234567890",
  date: "11 oct 24, 11:10 PM",
  accountType: "Admin",
  gender: "Male",
  rank: "1",
  FleetTrained: "Yes",
  Subscription: "Basic",
  status: "Active",
}));

const RecentUserTable = () => {
  const [showProfileModal, setShowProfileModal] = useState(false);

  // =============== Table columns ===============
  const columns = [
    {
      title: "User ID",
      dataIndex: "key",
    },
    {
      title: "Nickname",
      dataIndex: "name",
      render: (value, record) => (
        <div className="flex-center-start gap-x-2">
          <Image
            src={record.userImg}
            alt="User avatar"
            width={52}
            height={52}
            className="aspect-square rounded-full"
          />
          <p className="font-medium">{value}</p>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Gender",
      dataIndex: "gender",
    },
    {
      title: "Rank",
      dataIndex: "rank",
    },
    {
      title: "Fleet Trained",
      dataIndex: "FleetTrained",
    },
    {
      title: "Subscription Plan",
      dataIndex: "Subscription",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (value) => (
        <Tag color="green" className="!text-base font-semibold">
          {value}
        </Tag>
      ),
    },

    {
      title: "Date",
      dataIndex: "date",
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
      <div className="">
        <h1 className="text-xl font-semibold">Recent Users</h1>
        <p className="mb-5 text-sm text-gray-500">
          Here are the latest users who joined the platform.
        </p>
        <Table
          style={{ overflowX: "auto", width: "100%" }}
          columns={columns}
          dataSource={data}
          scroll={{ x: "100%" }}
          pagination={false}
        ></Table>
      </div>

      {/* Profile Modal */}
      <ProfileModal open={showProfileModal} setOpen={setShowProfileModal} />
    </ConfigProvider>
  );
};

export default RecentUserTable;
