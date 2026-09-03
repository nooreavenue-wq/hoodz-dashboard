"use client";

import { useState } from "react";
import {
  Table,
  Input,
  Card,
  Statistic,
  Image,
  Tag,
  Tooltip,
  Modal,
  Spin,
  Descriptions,
  Empty,
} from "antd";
import { Search, Eye, Trash2 } from "lucide-react";

import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import {
  useDeletePostOrderMutation,
  useGetPosQuery,
  useViewSingleOrderDetailsQuery,
} from "@/redux/api/posApi";

export default function PosOrdersTab() {
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const { data, isLoading } = useGetPosQuery({
    page,
    limit: 10,
    searchText,
  });
  const [deleteOrder] = useDeletePostOrderMutation();

  const summary = data?.data;
  const orders = summary?.posOrders || [];

  const handleDelete = async (id) => {
    try {
      const res = await deleteOrder(id).unwrap();
      toast.success(res?.message || "Order deleted");
    } catch (e) {
      toast.error(e?.data?.message || "Delete failed");
    }
  };

  const columns = [
    {
      title: "Order",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <p className="font-mono text-xs text-slate-500">
            {id?.slice(-8)?.toUpperCase()}
          </p>
          <p className="text-xs text-slate-400">
            {record.createdAt
              ? dayjs(record.createdAt).format("DD MMM, hh:mm A")
              : "—"}
          </p>
        </div>
      ),
    },
    {
      title: "Items",
      dataIndex: "items",
      render: (items) => (
        <div className="flex -space-x-2">
          {(items || []).slice(0, 4).map((it, i) => (
            <Image
              key={i}
              src={it.product?.banner}
              alt={it.product?.name}
              width={36}
              height={36}
              className="rounded-lg border-2 border-white object-cover"
              preview={false}
            />
          ))}
          {(items || []).length > 4 && (
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-xs">
              +{items.length - 4}
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Qty",
      render: (_, r) =>
        (r.items || []).reduce((s, i) => s + (i.quantity || 0), 0),
    },
    {
      title: "Subtotal",
      dataIndex: "subTotal",
      render: (v) => `$${Number(v || 0).toFixed(2)}`,
    },
    {
      title: "Disc / Tax",
      render: (_, r) => (
        <span className="text-sm">
          <span className="text-red-500">-{r.discount}%</span>
          {" / "}
          <span>{r.tax}%</span>
        </span>
      ),
    },
    {
      title: "Total",
      dataIndex: "totalAmount",
      render: (v) => (
        <span className="font-semibold text-[#F75908]">
          ${Number(v || 0).toFixed(2)}
        </span>
      ),
    },
    {
      title: "Action",
      width: 100,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Tooltip title="View">
            <button
              onClick={() => {
                setSelectedId(record._id);
                setDetailsOpen(true);
              }}
            >
              <Eye size={18} color="#1B70A6" />
            </button>
          </Tooltip>
          <CustomConfirm
            title="Delete POS Order"
            description="Are you sure you want to delete this order?"
            onConfirm={() => handleDelete(record._id)}
          >
            <button>
              <Trash2 size={18} color="#ef4444" />
            </button>
          </CustomConfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border-0 shadow-sm">
          <Statistic title="All Products" value={summary?.allProducts ?? 0} />
        </Card>
        <Card className="border-0 shadow-sm">
          <Statistic
            title="Today Earning"
            value={summary?.todayEarning ?? 0}
            prefix="$"
            precision={2}
          />
        </Card>
        <Card className="border-0 shadow-sm">
          <Statistic
            title="Total Earning"
            value={summary?.totalEarning ?? 0}
            prefix="$"
            precision={2}
          />
        </Card>
        <Card className="border-0 shadow-sm">
          <Statistic title="Total Orders" value={summary?.totalOrders ?? 0} />
        </Card>
      </div>

      <div className="ml-auto max-w-sm">
        <Input
          placeholder="Search orders..."
          prefix={<Search size={16} className="text-slate-400" />}
          className="h-10 !rounded-lg"
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
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: 10,
          total: data?.meta?.total || 0,
          onChange: setPage,
        }}
      />

      <PosOrderDetailsModal
        open={detailsOpen}
        setOpen={setDetailsOpen}
        orderId={selectedId}
      />
    </div>
  );
}

function PosOrderDetailsModal({ open, setOpen, orderId }) {
  const { data, isLoading } = useViewSingleOrderDetailsQuery(orderId, {
    skip: !orderId || !open,
  });
  const order = data?.data;

  return (
    <Modal
      title="POS Order Details"
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      width={720}
      centered
      destroyOnClose
    >
      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Spin size="large" />
        </div>
      ) : !order ? (
        <Empty />
      ) : (
        <div className="space-y-4">
          <Descriptions bordered size="small" column={2}>
            <Descriptions.Item label="Order ID">
              <span className="font-mono">{order._id?.slice(-10)}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Date">
              {order.createdAt
                ? dayjs(order.createdAt).format("DD MMM YYYY, hh:mm A")
                : "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Subtotal">
              ${Number(order.subTotal || 0).toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="Discount">
              {order.discount}%
            </Descriptions.Item>
            <Descriptions.Item label="Tax">{order.tax}%</Descriptions.Item>
            <Descriptions.Item label="Total">
              <span className="font-bold text-[#F75908]">
                ${Number(order.totalAmount || 0).toFixed(2)}
              </span>
            </Descriptions.Item>
            {order.shop && (
              <Descriptions.Item label="Shop" span={2}>
                {order.shop.name} · {order.shop.phone}
              </Descriptions.Item>
            )}
          </Descriptions>

          <h4 className="font-semibold">Items</h4>
          <div className="space-y-2">
            {(order.items || []).map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border p-3"
              >
                <Image
                  alt={item.product?.title}
                  src={item.product?.banner}
                  width={56}
                  height={56}
                  className="rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.product?.title}</p>
                  <p className="text-xs text-slate-500">
                    SKU: {item.product?.sku || "—"}
                    {item.variant?.size && ` · Size: ${item.variant.size}`}
                    {item.variant?.color && (
                      <>
                        {" · "}
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-full align-middle"
                          style={{
                            backgroundColor: item.variant.color.code,
                          }}
                        />{" "}
                        {item.variant.color.name}
                      </>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <Tag>Qty: {item.quantity}</Tag>
                  <p className="mt-1 text-sm font-semibold">
                    $
                    {(
                      (item.product?.discountPrice ??
                        item.product?.price ??
                        0) * item.quantity
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}
