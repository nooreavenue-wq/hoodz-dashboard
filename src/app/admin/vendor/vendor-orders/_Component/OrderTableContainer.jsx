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
  useGetVendorOrdersQuery,
  useMakeOrderConfirmMutation,
  useMakeOrderProccessMutation,
  useOrderStatusMutation,
} from "@/redux/api/orderApi";
import dayjs from "dayjs";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import toast from "react-hot-toast";
import OrderDetailsModal from "./OrderDetailsModal";
import { useSocket } from "@/context/SocketContextApi";

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

  const { data, isLoading, refetch } = useGetVendorOrdersQuery({
    page: currentPage,
    limit,
    searchText,
  });

  const [makeConfirm, { isLoading: confirming }] =
    useMakeOrderConfirmMutation();
  const [makeProcess, { isLoading: processing }] =
    useMakeOrderProccessMutation();
  const [orderStatus] = useOrderStatusMutation();

  // 🔔 Realtime: order update → refetch list
  useEffect(() => {
    if (!socket) return;

    const onOrderUpdated = () => {
      refetch();
    };

    socket.on("order:updated", onOrderUpdated);
    console.log("sdfsdf");
    return () => {
      socket.off("order:updated", onOrderUpdated);
    };
  }, [socket, refetch]);

  const handleConfirm = async (id) => {
    try {
      const res = await makeConfirm({ id }).unwrap();
      toast.success(res?.message || "Order confirmed");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to confirm order");
    }
  };

  const handleProcess = async (id) => {
    try {
      const res = await makeProcess({ id }).unwrap();
      toast.success(res?.message || "Order moved to processing");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to process order");
    }
  };

  const handleCancel = async (id) => {
    try {
      const res = await orderStatus({ id, status: "cancelled" }).unwrap();
      toast.success(res?.message || "Order cancelled");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to cancel order");
    }
  };

  const getStatusMenuItems = (record) => {
    const items = [];
    const { status, id } = record;

    if (status === "pending") {
      items.push({
        key: "confirmed",
        label: (
          <CustomConfirm
            title="Confirm Order"
            description="Mark this order as confirmed?"
            onConfirm={() => handleConfirm(id)}
          >
            <span className="block w-full">Mark as Confirmed</span>
          </CustomConfirm>
        ),
      });
    }

    if (status === "confirmed") {
      items.push({
        key: "processing",
        label: (
          <CustomConfirm
            title="Process Order"
            description="Move this order to processing?"
            onConfirm={() => handleProcess(id)}
          >
            <span className="block w-full">Mark as Processing</span>
          </CustomConfirm>
        ),
      });
    }

    if (status !== "delivered" && status !== "cancelled") {
      items.push({
        key: "cancelled",
        danger: true,
        label: (
          <CustomConfirm
            title="Cancel Order"
            description="Are you sure you want to cancel this order?"
            onConfirm={() => handleCancel(id)}
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
    size: order.items?.[0]?.size,
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
            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-gray-500">
              {record.size && <span>Size: {record.size}</span>}
              {record.color && (
                <span className="flex items-center gap-1">
                  <span
                    className="inline-block h-3 w-3 rounded-full border"
                    style={{ backgroundColor: record.color.code }}
                  />
                  {record.color.name}
                </span>
              )}
            </div>
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
        { text: "Processing", value: "processing" },
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
          {formatStatus(value)}
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
        loading={isLoading || confirming || processing}
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
