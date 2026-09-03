"use client";

import { ConfigProvider, Input, Table } from "antd";
import { Tooltip } from "antd";
import { Check, Eye, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { Tag } from "antd";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import { Righteous } from "next/font/google";

// Dummy table data
const data = Array.from({ length: 7 }).map((_, inx) => ({
  key: inx + 1,
  name: "Moazzem Hossain",
  requestedDate: "11 oct 24, 11.10PM",
  amount: 22,
}));

export default function WithdrawalRequestTables() {
  const [showEarningModal, setShowEarningModal] = useState(false);

  // ================== Table Columns ================
  const columns = [
    {
      title: "ID",
      dataIndex: "key",
      render: (value) => `#${value}`,
    },
    {
      title: "User Name",
      dataIndex: "name",
    },
    {
      title: "Requested Date",
      dataIndex: "requestedDate",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (value) => (
        <Tag color="blue" className="!text-base font-semibold">
          ${value}
        </Tag>
      ),
    },

    {
      title: "Action",
      render: () => (
        <div className="flex-center-start gap-x-3">
          <CustomConfirm
            title="Approve"
            content="Are you sure to approve this withdrawal request?"
          >
            <span className="cursor-pointer">
              <Check color="#1B70A6" size={20} />
            </span>
          </CustomConfirm>
          <Tooltip title="Show Details">
            <span
              onClick={() => setShowEarningModal(true)}
              className="cursor-pointer"
            >
              <Eye size={20} />
            </span>
          </Tooltip>
          <CustomConfirm
            title="Dined"
            content="Are you sure to dined this withdrawal request?"
          >
            <span className="cursor-pointer">
              <Trash2 color="#F16365" size={20} />
            </span>
          </CustomConfirm>
        </div>
      ),
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
      <div className="mb-3 ml-auto w-1/3 gap-x-5">
        <Input
          placeholder="Search by name "
          prefix={<Search className="mr-2 text-black" size={20} />}
          className="h-11 !rounded-lg !border !text-base"
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      {/* Show table */}
      <section className="my-10">
        <Table
          style={{ overflowX: "auto" }}
          columns={columns}
          dataSource={data}
          scroll={{ x: "100%" }}
          pagination
        ></Table>
      </section>

      {/* Show earning modal */}
    </ConfigProvider>
  );
}
