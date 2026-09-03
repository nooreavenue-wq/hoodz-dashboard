"use client";

import { useState } from "react";
import {
  Modal,
  Spin,
  Tag,
  Avatar,
  Descriptions,
  Button,
  Input,
  Empty,
  Divider,
  Upload,
  Image,
} from "antd";
import dayjs from "dayjs";
import { CheckCircle, XCircle, Wallet, X } from "lucide-react";
import {
  useChnageWithdrawalStatusMutation,
  useGetWithdrawalByIdQuery,
} from "@/redux/api/withdrawApi";
import useFileUpload from "@/hooks/useFileUpload";
import toast from "react-hot-toast";

const { TextArea } = Input;

const statusColors = {
  pending: "orange",
  completed: "green",
  rejected: "red",
  processing: "blue",
};

const walletTypeLabel = {
  mobile_wallet: "Mobile Wallet",
  bank: "Bank Account",
  instapay: "InstaPay",
};

export default function WithdrawalDetailsModal({
  open,
  setOpen,
  withdrawalId,
}) {
  const [actionMode, setActionMode] = useState(null);
  const [note, setNote] = useState("");
  const [fileList, setFileList] = useState([]);
  const [previews, setPreviews] = useState([]);

  const { data, isLoading, isFetching } = useGetWithdrawalByIdQuery(
    withdrawalId,
    { skip: !withdrawalId || !open },
  );

  const [changeStatus, { isLoading: updating }] =
    useChnageWithdrawalStatusMutation();
  const { uploadFiles, uploading } = useFileUpload();

  const item = data?.data;
  const author = item?.author;
  const processedBy = item?.processedBy;
  const wallets = item?.riderWallet || [];

  const resetAction = () => {
    setActionMode(null);
    setNote("");
    setFileList([]);
    setPreviews([]);
  };

  const handleClose = () => {
    setOpen(false);
    resetAction();
  };

  const handleSubmitStatus = async () => {
    if (!note.trim()) {
      toast.error("Please enter a note");
      return;
    }

    try {
      let files = [];
      if (fileList.length) {
        files = await uploadFiles(fileList);
      }

      const body = {
        status: actionMode,
        note: note.trim(),
      };

      if (files.length) {
        body.files = files;
      }

      const res = await changeStatus({
        id: withdrawalId,
        data: body,
      }).unwrap();

      toast.success(
        res?.message ||
          `Withdrawal ${actionMode === "completed" ? "completed" : "rejected"}`,
      );
      handleClose();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold">Withdrawal Details</span>
          {item?.id && (
            <Tag color="blue" className="!m-0">
              {item.id}
            </Tag>
          )}
        </div>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      centered
      width={640}
      destroyOnClose
      styles={{ body: { maxHeight: "78vh", overflowY: "auto" } }}
    >
      {isLoading || isFetching ? (
        <div className="flex h-56 items-center justify-center">
          <Spin size="large" />
        </div>
      ) : !item ? (
        <Empty description="Withdrawal not found" />
      ) : (
        <div className="space-y-5">
          {/* Amount + Status */}
          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
            <div>
              <p className="text-sm text-slate-500">Amount</p>
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

          {/* Author */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-slate-500">
              Requested By
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
                <div className="mt-1 flex flex-wrap gap-2">
                  {author?.role && (
                    <Tag className="capitalize">{author.role}</Tag>
                  )}
                  {author?.status && (
                    <Tag
                      color={author.status === "active" ? "green" : "default"}
                      className="capitalize"
                    >
                      {author.status}
                    </Tag>
                  )}
                  {author?.balance != null && (
                    <Tag color="green">Balance: ${author.balance}</Tag>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Rider Wallet */}
          <div>
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-500">
              <Wallet size={16} />
              Payout Wallet
            </h4>
            {wallets.length === 0 ? (
              <p className="rounded-xl border border-dashed px-4 py-6 text-center text-sm text-slate-400">
                No wallet on file
              </p>
            ) : (
              <div className="space-y-3">
                {wallets.map((w) => {
                  const d = w.details || {};
                  return (
                    <div
                      key={w._id}
                      className="rounded-xl border border-slate-200 bg-white p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <Tag color="blue" className="!m-0 capitalize">
                          {walletTypeLabel[w.type] ||
                            w.type?.replace(/_/g, " ")}
                        </Tag>
                        {w.createdAt && (
                          <span className="text-xs text-slate-400">
                            Added {dayjs(w.createdAt).format("DD MMM YYYY")}
                          </span>
                        )}
                      </div>

                      {w.type === "mobile_wallet" && (
                        <Descriptions bordered size="small" column={1}>
                          <Descriptions.Item label="Provider">
                            <span className="capitalize">
                              {d.walletProvider?.replace(/_/g, " ") || "—"}
                            </span>
                          </Descriptions.Item>
                          <Descriptions.Item label="Phone Number">
                            <span className="font-mono">
                              {d.walletPhoneNumber || "—"}
                            </span>
                          </Descriptions.Item>
                          <Descriptions.Item label="Holder Name">
                            {d.walletHolderName || "—"}
                          </Descriptions.Item>
                        </Descriptions>
                      )}

                      {w.type === "instapay" && (
                        <Descriptions bordered size="small" column={1}>
                          <Descriptions.Item label="InstaPay Address">
                            {d.instaPayAddress || "—"}
                          </Descriptions.Item>
                          <Descriptions.Item label="Account Holder">
                            {d.accountHolderName || "—"}
                          </Descriptions.Item>
                        </Descriptions>
                      )}

                      {w.type === "bank" && (
                        <Descriptions bordered size="small" column={1}>
                          <Descriptions.Item label="Bank Name">
                            {d.bankName || "—"}
                          </Descriptions.Item>
                          <Descriptions.Item label="Account Number">
                            <span className="font-mono">
                              {d.accountNumber || "—"}
                            </span>
                          </Descriptions.Item>
                          <Descriptions.Item label="Account Holder">
                            {d.accountHolderName || "—"}
                          </Descriptions.Item>
                          <Descriptions.Item label="IBAN">
                            {d.iban || "—"}
                          </Descriptions.Item>
                        </Descriptions>
                      )}

                      {!["mobile_wallet", "instapay", "bank"].includes(
                        w.type,
                      ) && (
                        <Descriptions bordered size="small" column={1}>
                          {Object.entries(d).map(([key, val]) => (
                            <Descriptions.Item
                              key={key}
                              label={key.replace(/([A-Z])/g, " $1")}
                            >
                              {String(val ?? "—")}
                            </Descriptions.Item>
                          ))}
                        </Descriptions>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Request details */}
          <Descriptions bordered size="small" column={1}>
            <Descriptions.Item label="Request ID">{item.id}</Descriptions.Item>
            <Descriptions.Item label="Note">
              {item.note || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Created">
              {item.createdAt
                ? dayjs(item.createdAt).format("DD MMM YYYY, hh:mm A")
                : "—"}
            </Descriptions.Item>
            {item.completedAt && (
              <Descriptions.Item label="Completed At">
                {dayjs(item.completedAt).format("DD MMM YYYY, hh:mm A")}
              </Descriptions.Item>
            )}
            {item.rejectedAt && (
              <Descriptions.Item label="Rejected At">
                {dayjs(item.rejectedAt).format("DD MMM YYYY, hh:mm A")}
              </Descriptions.Item>
            )}
          </Descriptions>

          {processedBy && (
            <div>
              <h4 className="mb-2 text-sm font-semibold text-slate-500">
                Processed By
              </h4>
              <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                <Avatar size={36} src={processedBy.profileAvatar}>
                  {processedBy.name?.[0]}
                </Avatar>
                <div>
                  <p className="font-medium">{processedBy.name}</p>
                  <p className="text-xs text-slate-500">
                    {processedBy.email} · {processedBy.role}
                  </p>
                </div>
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
                    className="!flex items-center gap-2"
                  >
                    Reject
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    icon={<CheckCircle size={18} />}
                    onClick={() => setActionMode("completed")}
                    className="!flex items-center gap-2 !bg-green-600 hover:!bg-green-700"
                  >
                    Complete
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
                      ? "Completion Note"
                      : "Rejection Note"}{" "}
                    <span className="text-red-500">*</span>
                  </p>
                  <TextArea
                    rows={3}
                    placeholder={
                      actionMode === "completed"
                        ? "Add a note for this withdrawal..."
                        : "Reason for rejection..."
                    }
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    maxLength={300}
                    showCount
                  />

                  {/* Optional files */}
                  <div>
                    <p className="mb-2 text-sm font-medium text-slate-600">
                      Attachments (optional)
                    </p>
                    {previews.length > 0 && (
                      <div className="mb-2 flex flex-wrap gap-2">
                        {previews.map((url, i) => (
                          <div key={i} className="relative">
                            <Image
                              src={url}
                              width={64}
                              height={64}
                              className="rounded-lg object-cover"
                              alt="file"
                            />
                            <button
                              type="button"
                              className="absolute -right-1 -top-1 rounded-full bg-red-500 p-0.5 text-white"
                              onClick={() => {
                                setFileList((p) =>
                                  p.filter((_, idx) => idx !== i),
                                );
                                setPreviews((p) =>
                                  p.filter((_, idx) => idx !== i),
                                );
                              }}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <Upload
                      multiple
                      fileList={fileList}
                      beforeUpload={() => false}
                      accept="image/*,.pdf"
                      listType="picture-card"
                      showUploadList={false}
                      onChange={({ fileList: fl }) => {
                        setFileList(fl);
                        setPreviews(
                          fl
                            .filter((f) => f.originFileObj)
                            .map((f) =>
                              f.originFileObj.type?.startsWith("image/")
                                ? URL.createObjectURL(f.originFileObj)
                                : null,
                            )
                            .filter(Boolean),
                        );
                      }}
                    >
                      {fileList.length < 5 && "+ Upload"}
                    </Upload>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button onClick={resetAction}>Cancel</Button>
                    <Button
                      type="primary"
                      danger={actionMode === "rejected"}
                      loading={updating || uploading}
                      onClick={handleSubmitStatus}
                      className={
                        actionMode === "completed"
                          ? "!bg-green-600 hover:!bg-green-700"
                          : ""
                      }
                    >
                      Confirm{" "}
                      {actionMode === "completed" ? "Complete" : "Reject"}
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
