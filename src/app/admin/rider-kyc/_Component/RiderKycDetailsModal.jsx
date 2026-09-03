"use client";

import { useState } from "react";
import {
  Modal,
  Spin,
  Tag,
  Avatar,
  Image,
  Descriptions,
  Button,
  Input,
  message,
  Empty,
  Divider,
} from "antd";
import {
  useGetRiderKycQuery,
  useUpdateRiderKycMutation,
} from "@/redux/api/riderkycApi";
import dayjs from "dayjs";
import { CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";

const { TextArea } = Input;

const statusColors = {
  pending: "orange",
  approved: "green",
  rejected: "red",
};

export default function RiderKycDetailsModal({ open, setOpen, kycId }) {
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const { data, isLoading, isFetching } = useGetRiderKycQuery(kycId, {
    skip: !kycId || !open,
  });

  const [updateKyc, { isLoading: updating }] = useUpdateRiderKycMutation();

  const kyc = data?.data;

  const handleApprove = async () => {
    try {
      const res = await updateKyc({
        id: kycId,
        data: { status: "approved" },
      }).unwrap();
      toast.success(res?.message || "KYC approved successfully");
      setOpen(false);
      resetReject();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to approve KYC");
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.warning("Please provide a rejection reason");
      return;
    }
    try {
      const res = await updateKyc({
        id: kycId,
        data: {
          status: "rejected",
          rejectedReason: rejectReason.trim(),
        },
      }).unwrap();
      toast.success(res?.message || "KYC rejected");
      setOpen(false);
      resetReject();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to reject KYC");
    }
  };

  const resetReject = () => {
    setRejectMode(false);
    setRejectReason("");
  };

  const handleClose = () => {
    setOpen(false);
    resetReject();
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold">KYC Verification</span>
          {kyc?.status && (
            <Tag color={statusColors[kyc.status]} className="!m-0 capitalize">
              {kyc.status}
            </Tag>
          )}
        </div>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      centered
      width={780}
      destroyOnClose
      styles={{ body: { maxHeight: "75vh", overflowY: "auto" } }}
    >
      {isLoading || isFetching ? (
        <div className="flex h-64 items-center justify-center">
          <Spin size="large" />
        </div>
      ) : !kyc ? (
        <Empty description="KYC data not found" />
      ) : (
        <div className="space-y-5">
          {/* Rider Info */}
          <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
            <Avatar size={64} src={kyc.user?.profileAvatar}>
              {kyc.user?.name?.[0]}
            </Avatar>
            <div>
              <p className="text-lg font-semibold">{kyc.user?.name || "N/A"}</p>
              <p className="text-sm text-slate-500">{kyc.user?.email}</p>
              <p className="text-sm text-slate-500">
                {kyc.user?.phone
                  ? `${kyc.user?.countryCode || ""} ${kyc.user.phone}`
                  : "No phone"}
              </p>
            </div>
          </div>

          {/* Basic Info */}
          <Descriptions bordered size="small" column={2}>
            <Descriptions.Item label="Vehicle">
              <span className="capitalize">{kyc.vehicle || "N/A"}</span>
            </Descriptions.Item>
            <Descriptions.Item label="User Status">
              <Tag color={kyc.user?.status === "active" ? "green" : "default"}>
                {kyc.user?.status || "N/A"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Submitted">
              {kyc.createdAt
                ? dayjs(kyc.createdAt).format("DD MMM YYYY, hh:mm A")
                : "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Last Updated">
              {kyc.updatedAt
                ? dayjs(kyc.updatedAt).format("DD MMM YYYY, hh:mm A")
                : "—"}
            </Descriptions.Item>
            {kyc.rejectedReason && (
              <Descriptions.Item label="Rejection Reason" span={2}>
                <span className="text-red-500">{kyc.rejectedReason}</span>
              </Descriptions.Item>
            )}
          </Descriptions>

          {/* License Images */}
          <div>
            <h4 className="mb-2 font-semibold">Driving License</h4>
            <div className="flex flex-wrap gap-3">
              {kyc.license?.length > 0 ? (
                kyc.license.map((img, i) => (
                  <Image
                    key={i}
                    src={img}
                    width={180}
                    alt="image"
                    height={120}
                    className="rounded-lg object-cover"
                    fallback="https://via.placeholder.com/180x120?text=License"
                  />
                ))
              ) : (
                <p className="text-sm text-slate-400">No license uploaded</p>
              )}
            </div>
          </div>

          {/* National ID Images */}
          <div>
            <h4 className="mb-2 font-semibold">National ID</h4>
            <div className="flex flex-wrap gap-3">
              {kyc.nationalId?.length > 0 ? (
                kyc.nationalId.map((img, i) => (
                  <Image
                    key={i}
                    src={img}
                    width={180}
                    alt="image"
                    height={120}
                    className="rounded-lg object-cover"
                    fallback="https://via.placeholder.com/180x120?text=NID"
                  />
                ))
              ) : (
                <p className="text-sm text-slate-400">
                  No national ID uploaded
                </p>
              )}
            </div>
          </div>

          {/* Wallets (if any) */}
          {kyc.wallets?.length > 0 && (
            <div>
              <h4 className="mb-2 font-semibold">Payment Wallets</h4>
              <div className="space-y-2">
                {kyc.wallets.map((w) => (
                  <div
                    key={w._id}
                    className="rounded-lg border bg-slate-50 px-4 py-3 text-sm"
                  >
                    <p className="font-medium capitalize">{w.type}</p>
                    {w.details?.accountHolderName && (
                      <p className="text-slate-600">
                        Holder: {w.details.accountHolderName}
                      </p>
                    )}
                    {w.details?.instaPayAddress && (
                      <p className="text-slate-600">
                        InstaPay: {w.details.instaPayAddress}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions — only when pending */}
          {kyc.status === "pending" && (
            <>
              <Divider className="!my-2" />

              {!rejectMode ? (
                <div className="flex justify-end gap-3">
                  <Button
                    danger
                    size="large"
                    icon={<XCircle size={18} />}
                    onClick={() => setRejectMode(true)}
                    className="!flex items-center gap-2"
                  >
                    Reject
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    loading={updating}
                    icon={<CheckCircle size={18} />}
                    onClick={handleApprove}
                    className="!flex items-center gap-2 !bg-green-600 hover:!bg-green-700"
                  >
                    Approve
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 rounded-xl border border-red-100 bg-red-50 p-4">
                  <p className="font-medium text-red-700">
                    Rejection Reason <span className="text-red-500">*</span>
                  </p>
                  <TextArea
                    rows={3}
                    placeholder="Explain why this KYC is being rejected..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    maxLength={300}
                    showCount
                  />
                  <div className="flex justify-end gap-3">
                    <Button onClick={resetReject}>Cancel</Button>
                    <Button
                      danger
                      type="primary"
                      loading={updating}
                      onClick={handleReject}
                    >
                      Confirm Reject
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
