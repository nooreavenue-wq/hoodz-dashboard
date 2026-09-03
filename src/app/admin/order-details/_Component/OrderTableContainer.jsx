"use client";

import { useEffect, useState } from "react";
import {
  Table,
  Input,
  Image,
  Tag,
  Dropdown,
  ConfigProvider,
  Tooltip,
} from "antd";
import { Search, Eye, MoreVertical, Filter } from "lucide-react";
import {
  useGetOrdersQuery,
  useOrderStatusMutation,
} from "@/redux/api/orderApi";
import dayjs from "dayjs";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import toast from "react-hot-toast";
import OrderDetailsModal from "./OrderDetailsModal";
import { useSocket } from "@/context/SocketContextApi";

const STATUS_FLOW = [
  "pending",
  "confirmed",
  "processing",
  "rider_assigned",
  "picked_up",
  "on_the_way",
  "delivered",
];

const statusColors = {
  pending: "orange",
  confirmed: "blue",
  processing: "cyan",
  rider_assigned: "purple",
  picked_up: "geekblue",
  on_the_way: "gold",
  delivered: "green",
  cancelled: "red",
};

const formatStatus = (status) => {
  if (status === "processing") return "Prepared";
  return status?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

export default function OrderTableContainer({ limit = 10 }) {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const { socket } = useSocket();

  const { data, isLoading, refetch } = useGetOrdersQuery({
    page: currentPage,
    limit,
    searchText,
  });

  const [orderStatus] = useOrderStatusMutation();

  // 🔔 Realtime order update → refetch
  useEffect(() => {
    if (!socket) return;

    const onOrderUpdated = () => {
      refetch();
    };

    socket.on("order:updated", onOrderUpdated);
    return () => {
      socket.off("order:updated", onOrderUpdated);
    };
  }, [socket, refetch]);

  const handleStatusChange = async (id, status) => {
    try {
      const res = await orderStatus({ id, status }).unwrap();
      toast.success(res?.message || "Order status updated");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  const getNextStatus = (current) => {
    if (current === "cancelled" || current === "delivered") return null;
    const idx = STATUS_FLOW.indexOf(current);
    if (idx === -1 || idx === STATUS_FLOW.length - 1) return null;
    return STATUS_FLOW[idx + 1];
  };

  const getStatusMenuItems = (record) => {
    const items = [];
    const next = getNextStatus(
      record.status === "Processing" ? "prepered" : record.status,
    );

    if (next) {
      items.push({
        key: next,
        label: (
          <CustomConfirm
            title="Update Status"
            description={`Change status to "${formatStatus(next)}"?`}
            onConfirm={() => handleStatusChange(record.id, next)}
          >
            <span className="block w-full">Mark as {formatStatus(next)}</span>
          </CustomConfirm>
        ),
      });
    }

    if (record.status !== "delivered" && record.status !== "cancelled") {
      items.push({
        key: "cancelled",
        danger: true,
        label: (
          <CustomConfirm
            title="Cancel Order"
            description="Are you sure you want to cancel this order?"
            onConfirm={() => handleStatusChange(record.id, "cancelled")}
          >
            <span className="block w-full text-red-500">Cancel Order</span>
          </CustomConfirm>
        ),
      });
    }

    return items;
  };

  const tableData = data?.data?.map((order, index) => ({
    key: order._id || index,
    id: order._id,
    orderId: order.id,
    product: order.items?.[0]?.product?.title || "N/A",
    banner: order.items?.[0]?.product?.banner,
    color: order.items?.[0]?.color,
    totalItem: order.totalItem,
    totalAmount: order.totalAmount,
    deliveryCharge: order.deliveryCharge,
    status: order.status,
    paymentStatus: order.paymentStatus,
    transactionId: order.transactionId,
    deliveryType: order.deliveryType,
    createdAt: order.createdAt,
  }));

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      render: (value) => (
        <span className="font-medium text-[#1B70A6]">{value}</span>
      ),
    },
    {
      title: "Product",
      dataIndex: "product",
      render: (value, record) => (
        <div className="flex items-center gap-3">
          {record.banner ? (
            <Image
              src={record.banner}
              alt="product"
              width={48}
              height={48}
              className="rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
              N/A
            </div>
          )}
          <div>
            <p className="max-w-[220px] truncate font-medium">{value}</p>
            {record.color && (
              <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                <span
                  className="inline-block h-3 w-3 rounded-full border"
                  style={{ backgroundColor: record.color.code }}
                />
                {record.color.name}
              </div>
            )}
            {record.totalItem > 1 && (
              <p className="text-xs text-gray-400">
                +{record.totalItem - 1} more item(s)
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Amount",
      dataIndex: "totalAmount",
      render: (value, record) => (
        <div>
          <p className="font-semibold">${value}</p>
          <p className="text-xs text-gray-400">
            Delivery: ${record.deliveryCharge}
          </p>
        </div>
      ),
    },
    {
      title: "Payment",
      dataIndex: "paymentStatus",
      render: (value) => (
        <Tag color={value === "paid" ? "green" : "orange"}>
          {value?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      filters: [
        { text: "Pending", value: "pending" },
        { text: "Confirmed", value: "confirmed" },
        { text: "Prepared", value: "processing" },
        { text: "Rider Assigned", value: "rider_assigned" },
        { text: "Picked Up", value: "picked_up" },
        { text: "On The Way", value: "on_the_way" },
        { text: "Delivered", value: "delivered" },
        { text: "Cancelled", value: "cancelled" },
      ],
      filterIcon: (filtered) => (
        <Filter size={16} color={filtered ? "#1B70A6" : "#000"} />
      ),
      onFilter: (value, record) => record.status === value,
      render: (value) => (
        <Tag color={statusColors[value] || "default"}>
          {formatStatus(value === "processing" ? "Prepared" : value)}
        </Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (value) =>
        value ? dayjs(value).format("DD MMM YYYY, hh:mm A") : "N/A",
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 100,
      render: (_, record) => {
        const menuItems = getStatusMenuItems(record);

        return (
          <div className="flex items-center gap-3">
            <Tooltip title="View Details">
              <button
                onClick={() => {
                  setSelectedOrderId(record.id);
                  setDetailsOpen(true);
                }}
              >
                <Eye size={20} color="#1B70A6" />
              </button>
            </Tooltip>

            {menuItems.length > 0 && (
              <Dropdown
                menu={{ items: menuItems }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <button>
                  <MoreVertical size={20} color="#64748b" />
                </button>
              </Dropdown>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1B70A6",
        },
      }}
    >
      <div className="mb-4 ml-auto w-full max-w-sm">
        <Input
          placeholder="Search by order id or product..."
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
          showTotal: (total) => `Total ${total} orders`,
        }}
      />

      <OrderDetailsModal
        open={detailsOpen}
        setOpen={setDetailsOpen}
        orderId={selectedOrderId}
      />
    </ConfigProvider>
  );
}
