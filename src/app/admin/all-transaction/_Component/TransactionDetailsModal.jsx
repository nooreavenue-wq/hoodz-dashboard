"use client";

import { Modal, Spin, Tag, Avatar, Descriptions, Empty, Divider } from "antd";
import { useGetSingleTransQuery } from "@/redux/api/transactionApi";
import dayjs from "dayjs";

const statusColors = {
  paid: "green",
  pending: "orange",
  failed: "red",
  cancelled: "default",
  refunded: "purple",
};

const formatStatus = (s) =>
  s?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "N/A";

export default function TransactionDetailsModal({
  open,
  setOpen,
  transactionId,
}) {
  const { data, isLoading, isFetching } = useGetSingleTransQuery(
    transactionId,
    { skip: !transactionId || !open },
  );

  const txn = data?.data;
  const order = txn?.order;
  const account = txn?.account;
  const billing = order?.billingDetails;

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold">Transaction Details</span>
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
      width={1520}
      destroyOnClose
      styles={{ body: { maxHeight: "78vh", overflowY: "auto" } }}
    >
      {isLoading || isFetching ? (
        <div className="flex h-64 items-center justify-center">
          <Spin size="large" />
        </div>
      ) : !txn ? (
        <Empty description="Transaction not found" />
      ) : (
        <div className="space-y-6">
          {/* Top summary */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-slate-50 p-4">
            <div className="flex flex-wrap gap-2">
              <Tag
                color={statusColors[txn.status] || "default"}
                className="!text-sm"
              >
                {formatStatus(txn.status)}
              </Tag>
              <Tag color="blue" className="uppercase">
                {txn.paymentMethod || "N/A"}
              </Tag>
              <Tag color={txn.isPaid ? "green" : "orange"}>
                {txn.isPaid ? "Paid" : "Unpaid"}
              </Tag>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-emerald-600">
                ${txn.amount}
              </p>
              <p className="text-xs text-slate-500">
                Sub ${txn.subtotalAmount} + Del ${txn.deliveryCharge}
                {txn.coinDiscount > 0 && ` − Coin $${txn.coinDiscount}`}
              </p>
            </div>
          </div>

          {/* User */}
          <div>
            <h3 className="mb-3 text-base font-semibold">Customer</h3>
            <div className="flex items-center gap-3 rounded-xl border p-4">
              <Avatar size={52} src={account?.profileAvatar}>
                {account?.name?.[0]}
              </Avatar>
              <div>
                <p className="font-semibold">{account?.name || "N/A"}</p>
                <p className="text-sm text-slate-500">{account?.email}</p>
                <p className="text-sm text-slate-500">
                  {account?.phone || "No phone"}
                </p>
              </div>
            </div>
          </div>

          {/* Payment info */}
          <div>
            <h3 className="mb-3 text-base font-semibold">Payment Info</h3>
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="Payment ID">{txn.id}</Descriptions.Item>
              <Descriptions.Item label="Transaction ID">
                <span className="font-mono text-sm">
                  {txn.transactionId || "—"}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Payment Intent">
                <span className="font-mono text-sm">
                  {txn.paymentIntentId || "—"}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Method">
                <span className="uppercase">{txn.paymentMethod || "N/A"}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Subtotal">
                ${txn.subtotalAmount}
              </Descriptions.Item>
              <Descriptions.Item label="Delivery Charge">
                ${txn.deliveryCharge}
              </Descriptions.Item>
              <Descriptions.Item label="Coin Discount">
                ${txn.coinDiscount || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount">
                <span className="font-semibold text-emerald-600">
                  ${txn.amount}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Save Card Requested">
                {txn.saveCardRequested ? "Yes" : "No"}
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {txn.createdAt
                  ? dayjs(txn.createdAt).format("DD MMM YYYY, hh:mm A")
                  : "—"}
              </Descriptions.Item>
            </Descriptions>
          </div>

          {/* Order */}
          {order && (
            <div>
              <h3 className="mb-3 text-base font-semibold">Linked Order</h3>
              <Descriptions bordered size="small" column={2}>
                <Descriptions.Item label="Order ID">
                  {order.id}
                </Descriptions.Item>
                <Descriptions.Item label="Order Status">
                  <Tag>{formatStatus(order.status)}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Payment Status">
                  <Tag
                    color={order.paymentStatus === "paid" ? "green" : "orange"}
                  >
                    {order.paymentStatus}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Order Total">
                  ${order.totalAmount}
                </Descriptions.Item>
                <Descriptions.Item label="Items Amount">
                  ${order.amount}
                </Descriptions.Item>
                <Descriptions.Item label="Delivery">
                  ${order.deliveryCharge}
                </Descriptions.Item>
              </Descriptions>
            </div>
          )}

          {/* Billing */}
          {billing && (
            <div>
              <h3 className="mb-3 text-base font-semibold">
                Billing / Delivery Address
              </h3>
              <Descriptions bordered size="small" column={2}>
                <Descriptions.Item label="Name">
                  {billing.name || "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  {billing.phoneNumber || "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {billing.email || "—"}
                </Descriptions.Item>
                <Descriptions.Item label="City">
                  {billing.city}, {billing.country}
                </Descriptions.Item>
                <Descriptions.Item label="Address" span={2}>
                  {billing.address || "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Building">
                  {billing.buildingNo ?? "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Floor / Apt">
                  {billing.floorNo ?? "—"} / {billing.apartment ?? "—"}
                </Descriptions.Item>
                {billing.note && (
                  <Descriptions.Item label="Note" span={2}>
                    {billing.note}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </div>
          )}

          {/* Saved card if any */}
          {txn.savedCard && (
            <>
              <Divider className="!my-2" />
              <div>
                <h3 className="mb-2 text-base font-semibold">Saved Card</h3>
                <pre className="rounded-lg bg-slate-50 p-3 text-sm">
                  {JSON.stringify(txn.savedCard, null, 2)}
                </pre>
              </div>
            </>
          )}
        </div>
      )}
    </Modal>
  );
}
