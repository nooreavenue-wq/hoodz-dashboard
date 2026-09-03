"use client";

import { useState } from "react";
import {
  List,
  Button,
  Empty,
  Spin,
  Badge,
  Pagination,
  Tooltip,
  Popconfirm,
} from "antd";
import {
  Bell,
  CheckCheck,
  Trash2,
  Coins,
  ShoppingBag,
  Info,
  Package,
} from "lucide-react";
import {
  useGetMyNotificationQuery,
  useMarkAsReadMutation,
  useDeleteNotificationMutation,
  useDeleteSingleNotificationMutation,
} from "@/redux/api/notificationApi";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const iconByType = {
  Coin: <Coins size={18} className="text-amber-500" />,
  Order: <ShoppingBag size={18} className="text-blue-500" />,
  Product: <Package size={18} className="text-emerald-500" />,
  default: <Info size={18} className="text-slate-500" />,
};

export default function NotificationContainer() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isFetching } = useGetMyNotificationQuery({
    page,
    limit,
  });

  const [markAsRead, { isLoading: marking }] = useMarkAsReadMutation();
  const [deleteAll, { isLoading: deletingAll }] =
    useDeleteNotificationMutation();
  const [deleteSingle] = useDeleteSingleNotificationMutation();

  const notifications = data?.data || [];
  const meta = data?.meta;
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = async () => {
    try {
      const res = await markAsRead().unwrap();
      toast.success(res?.message || "All marked as read");
    } catch (e) {
      toast.error(e?.data?.message || "Failed");
    }
  };

  const handleDeleteAll = async () => {
    try {
      const res = await deleteAll().unwrap();
      toast.success(res?.message || "All notifications deleted");
    } catch (e) {
      toast.error(e?.data?.message || "Failed to delete");
    }
  };

  const handleDeleteOne = async (id) => {
    try {
      const res = await deleteSingle(id).unwrap();
      toast.success(res?.message || "Deleted");
    } catch (e) {
      toast.error(e?.data?.message || "Failed to delete");
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50">
            <Bell className="text-[#1B70A6]" size={22} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              Notifications
            </h2>
            <p className="text-sm text-slate-500">
              {unreadCount > 0
                ? `${unreadCount} unread`
                : "You're all caught up"}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            icon={<CheckCheck size={16} />}
            loading={marking}
            onClick={handleMarkAllRead}
            disabled={!unreadCount}
          >
            Mark all read
          </Button>
          <Popconfirm
            title="Delete all notifications?"
            description="This cannot be undone."
            onConfirm={handleDeleteAll}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<Trash2 size={16} />} loading={deletingAll}>
              Clear all
            </Button>
          </Popconfirm>
        </div>
      </div>

      {/* List */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <Spin size="large" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-16">
            <Empty description="No notifications yet" />
          </div>
        ) : (
          <List
            loading={isFetching}
            dataSource={notifications}
            renderItem={(item) => (
              <List.Item
                className={`!px-4 !py-4 transition hover:bg-slate-50 ${
                  !item.read ? "bg-blue-50/40" : ""
                }`}
                actions={[
                  <Tooltip title="Delete" key="del">
                    <button
                      onClick={() => handleDeleteOne(item._id)}
                      className="rounded-lg p-2 text-slate-300 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </Tooltip>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
                      {iconByType[item.modelType] || iconByType.default}
                      {!item.read && (
                        <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-[#1B70A6] ring-2 ring-white" />
                      )}
                    </div>
                  }
                  title={
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-sm ${
                          !item.read
                            ? "font-semibold text-slate-900"
                            : "font-medium text-slate-700"
                        }`}
                      >
                        {item.message}
                      </span>
                      {item.modelType && (
                        <Badge
                          count={item.modelType}
                          style={{
                            backgroundColor: "#f1f5f9",
                            color: "#64748b",
                            fontSize: 10,
                            boxShadow: "none",
                          }}
                        />
                      )}
                    </div>
                  }
                  description={
                    <div>
                      {item.description && (
                        <p className="mb-1 text-sm text-slate-500">
                          {item.description}
                        </p>
                      )}
                      <p className="text-xs text-slate-400">
                        {item.date ? dayjs(item.date).fromNow() : "—"}
                        {" · "}
                        {item.date
                          ? dayjs(item.date).format("DD MMM YYYY, hh:mm A")
                          : ""}
                      </p>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </div>

      {meta?.totalPage > 1 && (
        <div className="mt-4 flex justify-end">
          <Pagination
            current={page}
            total={meta?.total || 0}
            pageSize={limit}
            onChange={setPage}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
}
