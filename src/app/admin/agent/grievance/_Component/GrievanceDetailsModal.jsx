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
  Select,
  Empty,
  Divider,
} from "antd";
import useFileUpload from "@/hooks/useFileUpload";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { CheckCircle, XCircle, Gift } from "lucide-react";
import { Upload } from "antd";
import { useAddVoucherMutation } from "@/redux/api/voucherApi";
import {
  useGetSingleGriavanceQuery,
  useUpdateGriavanceMutation,
} from "@/redux/api/grieavenceApi";

const { TextArea } = Input;

const statusColors = {
  pending: "orange",
  resolved: "green",
  rejected: "red",
};

export default function GrievanceDetailsModal({ open, setOpen, grievanceId }) {
  const [actionMode, setActionMode] = useState(null); // resolved | rejected
  const [resolutionType, setResolutionType] = useState("none");
  const [note, setNote] = useState("");

  // Compensation voucher fields
  const [showVoucherForm, setShowVoucherForm] = useState(false);
  const [voucherForm, setVoucherForm] = useState({
    code: "",
    title: "Special Gift",
    giftName: "Free Hoodie",
    giftDescription: "Compensation gift voucher",
    expiryDate: null,
  });
  const [giftImages, setGiftImages] = useState([]);

  const { data, isLoading, isFetching } = useGetSingleGriavanceQuery(
    grievanceId,
    { skip: !grievanceId || !open },
  );

  const [updateStatus, { isLoading: updating }] = useUpdateGriavanceMutation();
  const [addVoucher, { isLoading: creatingVoucher }] = useAddVoucherMutation();
  const { uploadFiles, uploading } = useFileUpload();

  const item = data?.data;
  const user = item?.user;
  const order = item?.order;
  const billing = order?.billingDetails;

  const reset = () => {
    setActionMode(null);
    setResolutionType("none");
    setNote("");
    setShowVoucherForm(false);
    setGiftImages([]);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const handleSubmitStatus = async () => {
    if (!note.trim()) {
      toast.error("Please enter a note");
      return;
    }

    try {
      // If resolved with voucher — create compensation voucher first
      if (
        actionMode === "resolved" &&
        resolutionType === "voucher" &&
        user?._id
      ) {
        let bannerImage = [];
        if (giftImages.length) {
          bannerImage = await uploadFiles(giftImages);
        }

        const voucherPayload = {
          code:
            voucherForm.code?.trim()?.toUpperCase() ||
            `COMP${Date.now().toString(36).toUpperCase()}`,
          title: voucherForm.title || "Special Gift",
          voucherType: "compensation",
          user: user._id,
          discountType: "gift",
          discountValue: 0,
          giftDetails: {
            name: voucherForm.giftName || "Compensation Gift",
            bannerImage,
            description: voucherForm.giftDescription || "",
          },
          expiryDate: voucherForm.expiryDate
            ? new Date(voucherForm.expiryDate).toISOString()
            : new Date(
                new Date().setFullYear(new Date().getFullYear() + 1),
              ).toISOString(),
        };

        await addVoucher(voucherPayload).unwrap();
        toast.success("Compensation voucher created");
      }

      const payload = {
        status: actionMode,
        resolutionType: actionMode === "resolved" ? resolutionType : "none",
        note: note.trim(),
      };

      const res = await updateStatus({
        id: grievanceId,
        payload,
      }).unwrap();

      toast.success(res?.message || `Grievance ${actionMode}`);
      handleClose();
    } catch (e) {
      toast.error(e?.data?.message || "Failed to update");
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <span>Grievance Details</span>
          {item?.status && (
            <Tag
              color={statusColors[item.status] || "default"}
              className="!m-0 capitalize"
            >
              {item.status}
            </Tag>
          )}
        </div>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      centered
      width={720}
      destroyOnClose
      styles={{ body: { maxHeight: "78vh", overflowY: "auto" } }}
    >
      {isLoading || isFetching ? (
        <div className="flex h-56 items-center justify-center">
          <Spin size="large" />
        </div>
      ) : !item ? (
        <Empty description="Not found" />
      ) : (
        <div className="space-y-5">
          {/* User */}
          <div className="flex items-center gap-3 rounded-xl border p-3">
            <Avatar size={48} src={user?.profileAvatar}>
              {user?.name?.[0]}
            </Avatar>
            <div>
              <p className="font-semibold">{user?.name || "N/A"}</p>
              <p className="text-sm text-slate-500">{user?.email || "—"}</p>
              <p className="text-sm text-slate-500">
                {user?.phone || "No phone"}
              </p>
            </div>
          </div>

          {/* Issue */}
          <Descriptions bordered size="small" column={2}>
            <Descriptions.Item label="Issue Type">
              <span className="capitalize">
                {item.issueType?.replace(/_/g, " ")}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Order">
              {order?.id || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Description" span={2}>
              {item.description || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Created">
              {item.createdAt
                ? dayjs(item.createdAt).format("DD MMM YYYY, hh:mm A")
                : "—"}
            </Descriptions.Item>
            {item.resolvedAt && (
              <Descriptions.Item label="Resolved At">
                {dayjs(item.resolvedAt).format("DD MMM YYYY, hh:mm A")}
              </Descriptions.Item>
            )}
            {item.note && (
              <Descriptions.Item label="Resolution Note" span={2}>
                {item.note}
              </Descriptions.Item>
            )}
            {item.resolutionType && (
              <Descriptions.Item label="Resolution Type">
                <Tag className="capitalize">{item.resolutionType}</Tag>
              </Descriptions.Item>
            )}
          </Descriptions>

          {/* Proof files */}
          {item.files?.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-semibold">Attachments</h4>
              <div className="flex flex-wrap gap-2">
                {item.files.map((f, i) => (
                  <Image
                    key={i}
                    alt={f}
                    src={f}
                    width={100}
                    height={80}
                    className="rounded object-cover"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Order summary */}
          {order && (
            <div>
              <h4 className="mb-2 text-sm font-semibold">Order Info</h4>
              <Descriptions bordered size="small" column={2}>
                <Descriptions.Item label="Order ID">
                  {order.id}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag className="capitalize">{order.status}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Payment">
                  {order.paymentStatus}
                </Descriptions.Item>
                <Descriptions.Item label="Total">
                  ${order.totalAmount}
                </Descriptions.Item>
                {billing && (
                  <>
                    <Descriptions.Item label="Customer">
                      {billing.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Phone">
                      {billing.phoneNumber}
                    </Descriptions.Item>
                    <Descriptions.Item label="Address" span={2}>
                      {billing.address}, {billing.city}, {billing.country}
                    </Descriptions.Item>
                  </>
                )}
              </Descriptions>
            </div>
          )}

          {/* Actions — only if pending */}
          {item.status === "under_review" && (
            <>
              <Divider className="!my-2" />

              {!actionMode ? (
                <div className="flex justify-end gap-3">
                  <Button
                    danger
                    size="large"
                    icon={<XCircle size={18} />}
                    onClick={() => {
                      setActionMode("rejected");
                      setResolutionType("none");
                    }}
                  >
                    Reject
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    icon={<CheckCircle size={18} />}
                    className="!bg-green-600 hover:!bg-green-700"
                    onClick={() => setActionMode("resolved")}
                  >
                    Resolve
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
                  <p className="font-medium capitalize">
                    {actionMode} grievance
                  </p>

                  {actionMode === "resolved" && (
                    <div>
                      <p className="mb-1 text-sm">Resolution Type</p>
                      <Select
                        className="w-full"
                        value={resolutionType}
                        onChange={(v) => {
                          setResolutionType(v);
                          setShowVoucherForm(v === "voucher");
                        }}
                        options={[
                          { label: "None", value: "none" },
                          { label: "Compensation Voucher", value: "voucher" },
                        ]}
                      />
                    </div>
                  )}

                  {/* Compensation voucher form */}
                  {actionMode === "resolved" &&
                    resolutionType === "voucher" && (
                      <div className="space-y-2 rounded-lg border border-dashed border-amber-300 bg-white p-3">
                        <p className="flex items-center gap-2 text-sm font-semibold text-amber-700">
                          <Gift size={16} /> Compensation Voucher for{" "}
                          {user?.name}
                        </p>
                        <Input
                          placeholder="Code (optional — auto if empty)"
                          value={voucherForm.code}
                          onChange={(e) =>
                            setVoucherForm((p) => ({
                              ...p,
                              code: e.target.value,
                            }))
                          }
                        />
                        <Input
                          placeholder="Title"
                          value={voucherForm.title}
                          onChange={(e) =>
                            setVoucherForm((p) => ({
                              ...p,
                              title: e.target.value,
                            }))
                          }
                        />
                        <Input
                          placeholder="Gift name"
                          value={voucherForm.giftName}
                          onChange={(e) =>
                            setVoucherForm((p) => ({
                              ...p,
                              giftName: e.target.value,
                            }))
                          }
                        />
                        <TextArea
                          rows={2}
                          placeholder="Gift description"
                          value={voucherForm.giftDescription}
                          onChange={(e) =>
                            setVoucherForm((p) => ({
                              ...p,
                              giftDescription: e.target.value,
                            }))
                          }
                        />
                        <Upload
                          multiple
                          fileList={giftImages}
                          beforeUpload={() => false}
                          accept="image/*"
                          listType="picture-card"
                          onChange={({ fileList }) => setGiftImages(fileList)}
                        >
                          {giftImages.length < 3 && "+ Image"}
                        </Upload>
                      </div>
                    )}

                  <div>
                    <p className="mb-1 text-sm">
                      Note <span className="text-red-500">*</span>
                    </p>
                    <TextArea
                      rows={3}
                      placeholder="Write resolution / rejection note..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      maxLength={500}
                      showCount
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button onClick={reset}>Cancel</Button>
                    <Button
                      type="primary"
                      danger={actionMode === "rejected"}
                      loading={updating || creatingVoucher || uploading}
                      onClick={handleSubmitStatus}
                      className={
                        actionMode === "resolved"
                          ? "!bg-green-600 hover:!bg-green-700"
                          : ""
                      }
                    >
                      Confirm {actionMode === "resolved" ? "Resolve" : "Reject"}
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
