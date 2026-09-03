"use client";

import { Modal, Spin, Tag, Avatar, Descriptions, Empty } from "antd";
import { useGetTopUpTransQuery } from "@/redux/api/topuptransapi";
import dayjs from "dayjs";

const statusColors = {
  paid: "green",
  pending: "orange",
  failed: "red",
  cancelled: "default",
};

export default function TopUpDetailsModal({ open, setOpen, transactionId }) {
  const { data, isLoading, isFetching } = useGetTopUpTransQuery(transactionId, {
    skip: !transactionId || !open,
  });

  const txn = data?.data;

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold">Top-Up Details</span>
          {txn?.id && (
            <Tag color="blue" className="!m-0">
              {txn.id}
            </Tag>
          )}
        </div>
      }
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      centered
      width={640}
      destroyOnClose
    >
      {isLoading || isFetching ? (
        <div className="flex h-56 items-center justify-center">
          <Spin size="large" />
        </div>
      ) : !txn ? (
        <Empty description="Transaction not found" />
      ) : (
        <div className="space-y-5">
          {/* User + Amount */}
          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <Avatar size={52} src={txn.user?.profileAvatar}>
                {txn.user?.name?.[0]}
              </Avatar>
              <div>
                <p className="font-semibold">{txn.user?.name || "N/A"}</p>
                <p className="text-sm text-slate-500">User</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-emerald-600">
                ${txn.amount}
              </p>
              <Tag
                color={statusColors[txn.status] || "default"}
                className="capitalize"
              >
                {txn.status}
              </Tag>
            </div>
          </div>

          {/* Details */}
          <Descriptions bordered size="small" column={1}>
            <Descriptions.Item label="Transaction ID">
              {txn.id}
            </Descriptions.Item>
            <Descriptions.Item label="Gateway Txn ID">
              <span className="font-mono">{txn.transactionId || "—"}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Payment Intent ID">
              <span className="font-mono">{txn.paymentIntentId || "—"}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Payment Method">
              <span className="capitalize">{txn.paymentMethod || "N/A"}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Is Paid">
              {txn.isPaid ? (
                <Tag color="green">Yes</Tag>
              ) : (
                <Tag color="red">No</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Save Card Requested">
              {txn.saveCardRequested ? "Yes" : "No"}
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {txn.createdAt
                ? dayjs(txn.createdAt).format("DD MMM YYYY, hh:mm A")
                : "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Balance Applied At">
              {txn.balanceAppliedAt
                ? dayjs(txn.balanceAppliedAt).format("DD MMM YYYY, hh:mm A")
                : "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {txn.updatedAt
                ? dayjs(txn.updatedAt).format("DD MMM YYYY, hh:mm A")
                : "—"}
            </Descriptions.Item>
          </Descriptions>

          {/* Saved Card (if any) */}
          {txn.savedCard && (
            <div className="rounded-xl border bg-slate-50 p-4">
              <p className="mb-2 text-sm font-semibold text-slate-500">
                Saved Card
              </p>
              <pre className="text-sm">
                {JSON.stringify(txn.savedCard, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
