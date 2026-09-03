"use client";

import { useState } from "react";
import {
  Table,
  Input,
  Tag,
  Image,
  Button,
  Tooltip,
  ConfigProvider,
} from "antd";
import { Search, MapPin, Eye } from "lucide-react";
import { useGetUnassignedOrdersQuery } from "@/redux/api/orderApi";
import FindRiderModal from "./FindRiderModal";
import dayjs from "dayjs";

const statusColors = {
  pending: "orange",
  confirmed: "blue",
  processing: "cyan",
  cancelled: "red",
};

export default function UnassignedOrdersContainer({ limit = 10 }) {
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [findOpen, setFindOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { data, isLoading, isFetching, refetch } = useGetUnassignedOrdersQuery({
    page,
    limit,
    searchText,
  });

  const orders = data?.data || [];

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      render: (v) => (
        <span className="font-mono font-medium text-[#1B70A6]">{v}</span>
      ),
    },
    {
      title: "Items",
      dataIndex: "items",
      render: (items) => (
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {(items || []).slice(0, 3).map((it, i) => (
              <Image
                key={i}
                alt="product"
                src={it.product?.banner}
                width={36}
                height={36}
                className="rounded-lg border-2 border-white object-cover"
                preview={false}
              />
            ))}
          </div>
          <span className="text-xs text-slate-500">
            {items?.[0]?.product?.title
              ? items[0].product.title.slice(0, 28) +
                (items[0].product.title.length > 28 ? "…" : "")
              : "—"}
            {(items?.length || 0) > 1 ? ` +${items.length - 1}` : ""}
          </span>
        </div>
      ),
    },
    {
      title: "Qty",
      dataIndex: "totalItem",
    },
    {
      title: "Total",
      dataIndex: "totalAmount",
      render: (v) => (
        <span className="font-semibold">${Number(v ?? 0).toFixed(2)}</span>
      ),
    },
    {
      title: "Payment",
      dataIndex: "paymentStatus",
      render: (v) => (
        <Tag color={v === "paid" ? "green" : "orange"} className="capitalize">
          {v}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (v) => (
        <Tag color={statusColors[v] || "default"} className="capitalize">
          {v}
        </Tag>
      ),
    },
    {
      title: "Type",
      dataIndex: "deliveryType",
      render: (v) => <span className="capitalize">{v || "—"}</span>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (v) => (v ? dayjs(v).format("DD MMM, hh:mm A") : "—"),
    },
    {
      title: "Action",
      width: 180,
      fixed: "right",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<MapPin size={14} />}
          onClick={() => {
            setSelectedOrder(record);
            setFindOpen(true);
          }}
          className="h-9"
        >
          Find Nearby Rider
        </Button>
      ),
    },
  ];

  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#1B70A6" } }}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Unassigned Orders</h2>
          <p className="text-sm text-slate-500">
            Orders waiting for rider assignment
          </p>
        </div>
        <Input
          placeholder="Search orders..."
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
        dataSource={orders}
        loading={isLoading || isFetching}
        scroll={{ x: "max-content" }}
        pagination={{
          current: page,
          pageSize: limit,
          total: data?.meta?.total || 0,
          onChange: setPage,
          showTotal: (t) => `Total ${t} orders`,
        }}
      />

      <FindRiderModal
        open={findOpen}
        setOpen={setFindOpen}
        order={selectedOrder}
        onAssigned={() => {
          refetch();
          setFindOpen(false);
        }}
      />
    </ConfigProvider>
  );
}
