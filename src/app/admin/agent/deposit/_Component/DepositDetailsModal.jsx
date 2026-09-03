"use client";

import { useState } from "react";
import {
  Modal,
  Spin,
  Tag,
  Avatar,
  Descriptions,
  Image,
  Button,
  Input,
  Empty,
  Divider,
} from "antd";
import {
  useGetSingleDepositQuery,
  useChangeDepositStatusMutation,
} from "@/redux/api/depositApi";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { CheckCircle, XCircle } from "lucide-react";

const { TextArea } = Input;

const statusColors = {
  pending: "orange",
  completed: "green",
  rejected: "red",
};

export default function DepositDetailsModal({ open, setOpen, depositId }) {
  const [actionMode, setActionMode] = useState(null); // completed | rejected
  const [note, setNote] = useState("");

  const { data, isLoading, isFetching } = useGetSingleDepositQuery(depositId, {
    skip: !depositId || !open,
  });

  const [changeStatus, { isLoading: updating }] =
    useChangeDepositStatusMutation();

  const item = data?.data;
  const author = item?.author;
  const jobs = item?.jobIds || [];

  const reset = () => {
    setActionMode(null);
    setNote("");
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const handleSubmit = async () => {
    if (!note.trim()) {
      toast.error("Please enter a note");
      return;
    }

    try {
      const res = await changeStatus({
        id: depositId,
        payload: {
          status: actionMode,
          note: note.trim(),
        },
      }).unwrap();

      toast.success(
        res?.message ||
          `Deposit ${actionMode === "completed" ? "approved" : "rejected"}`,
      );
      handleClose();
    } catch (e) {
      toast.error(e?.data?.message || "Failed to update status");
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <span>Deposit Details</span>
          {item?.id && (
            <Tag color="blue" className="!m-0 font-mono">
              {item.id}
            </Tag>
          )}
        </div>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      centered
      width={680}
      destroyOnClose
      styles={{ body: { maxHeight: "78vh", overflowY: "auto" } }}
    >
      {isLoading || isFetching ? (
        <div className="flex h-56 items-center justify-center">
          <Spin size="large" />
        </div>
      ) : !item ? (
        <Empty description="Deposit not found" />
      ) : (
        <div className="space-y-5">
          {/* Amount + Status */}
          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
            <div>
              <p className="text-sm text-slate-500">Deposit Amount</p>
              <p className="text-2xl font-bold text-emerald-600">
                ${item.amount}
              </p>
            </div>
            <Tag
              color={statusColors[item.status] || "default"}
              className="!text-sm capitalize"
            >
              {item.status}
            </Tag>
          </div>

          {/* Rider */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-slate-500">
              Submitted By
            </h4>
            <div className="flex items-center gap-3 rounded-xl border p-3">
              <Avatar size={48} src={author?.profileAvatar}>
                {author?.name?.[0]}
              </Avatar>
              <div>
                <p className="font-semibold">{author?.name || "N/A"}</p>
                <p className="text-sm text-slate-500">{author?.email || "—"}</p>
                <p className="text-sm text-slate-500">
                  {author?.phone || "No phone"}
                </p>
              </div>
            </div>
          </div>

          {/* Deposit info */}
          <Descriptions bordered size="small" column={2}>
            <Descriptions.Item label="Deposit ID">{item.id}</Descriptions.Item>
            <Descriptions.Item label="Fawry Ref">
              <span className="font-mono">{item.fawryRefNo || "—"}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Amount">${item.amount}</Descriptions.Item>
            <Descriptions.Item label="Created">
              {item.createdAt
                ? dayjs(item.createdAt).format("DD MMM YYYY, hh:mm A")
                : "—"}
            </Descriptions.Item>
            {item.note && (
              <Descriptions.Item label="Note" span={2}>
                {item.note}
              </Descriptions.Item>
            )}
          </Descriptions>

          {/* Receipts */}
          {item.receiptFiles?.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-semibold">Receipt Files</h4>
              <Image.PreviewGroup>
                <div className="flex flex-wrap gap-2">
                  {item.receiptFiles.map((f, i) => (
                    <Image
                      key={i}
                      src={f}
                      alt={f}
                      width={120}
                      height={90}
                      className="rounded-lg object-cover"
                    />
                  ))}
                </div>
              </Image.PreviewGroup>
            </div>
          )}

          {/* Jobs */}
          {jobs.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-semibold">
                Linked Jobs ({jobs.length})
              </h4>
              <div className="space-y-2">
                {jobs.map((job, i) => {
                  // list may return string ids; single returns objects
                  if (typeof job === "string") {
                    return (
                      <div
                        key={i}
                        className="rounded-lg border px-3 py-2 font-mono text-sm"
                      >
                        {job}
                      </div>
                    );
                  }
                  return (
                    <div
                      key={job._id || i}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3"
                    >
                      <div>
                        <p className="font-mono text-sm text-[#1B70A6]">
                          {job.id}
                        </p>
                        <p className="text-xs text-slate-500">
                          Method: {job.paymentMethod || "—"} · Status:{" "}
                          <span className="capitalize">{job.status}</span>
                        </p>
                      </div>
                      <div className="text-right text-sm">
                        <p>
                          Collected:{" "}
                          <span className="font-semibold">
                            ${job.collectedMoney ?? 0}
                          </span>
                        </p>
                        <p className="text-emerald-600">
                          Earning: ${job.earning ?? 0}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions — pending only */}
          {item.status === "pending" && (
            <>
              <Divider className="!my-2" />

              {!actionMode ? (
                <div className="flex justify-end gap-3">
                  <Button
                    danger
                    size="large"
                    icon={<XCircle size={18} />}
                    onClick={() => setActionMode("rejected")}
                  >
                    Reject
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    icon={<CheckCircle size={18} />}
                    className="!bg-green-600 hover:!bg-green-700"
                    onClick={() => setActionMode("completed")}
                  >
                    Approve
                  </Button>
                </div>
              ) : (
                <div
                  className={`space-y-3 rounded-xl border p-4 ${
                    actionMode === "rejected"
                      ? "border-red-100 bg-red-50"
                      : "border-green-100 bg-green-50"
                  }`}
                >
                  <p className="font-medium">
                    {actionMode === "completed"
                      ? "Approval Note"
                      : "Rejection Note"}{" "}
                    <span className="text-red-500">*</span>
                  </p>
                  <TextArea
                    rows={3}
                    placeholder={
                      actionMode === "completed"
                        ? "Your deposit approved successfully"
                        : "Reason for rejection..."
                    }
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    maxLength={300}
                    showCount
                  />
                  <div className="flex justify-end gap-3">
                    <Button onClick={reset}>Cancel</Button>
                    <Button
                      type="primary"
                      danger={actionMode === "rejected"}
                      loading={updating}
                      onClick={handleSubmit}
                      className={
                        actionMode === "completed"
                          ? "!bg-green-600 hover:!bg-green-700"
                          : ""
                      }
                    >
                      Confirm{" "}
                      {actionMode === "completed" ? "Approve" : "Reject"}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </Modal>
  );
}
