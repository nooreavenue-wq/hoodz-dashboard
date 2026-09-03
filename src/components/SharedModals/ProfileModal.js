"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  Descriptions,
  Avatar,
  Tag,
  Spin,
  Image,
  Button,
  TimePicker,
  Form,
} from "antd";
import {
  useGetSingleUserQuery,
  useChangeagentScheduleMutation,
} from "@/redux/api/userApi";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { Clock, Pencil, Save } from "lucide-react";

export default function ProfileModal({ open, setOpen, userId, role }) {
  const [editSchedule, setEditSchedule] = useState(false);
  const [form] = Form.useForm();

  const { data, isLoading, isFetching } = useGetSingleUserQuery(userId, {
    skip: !userId || !open,
  });

  const [changeSchedule, { isLoading: saving }] =
    useChangeagentScheduleMutation();

  const user = data?.data;

  useEffect(() => {
    if (!open) {
      setEditSchedule(false);
      form.resetFields();
    }
  }, [open, form]);

  useEffect(() => {
    if (user?.agentSchedule && editSchedule) {
      form.setFieldsValue({
        startTime: user.agentSchedule.startTime
          ? dayjs(user.agentSchedule.startTime, "HH:mm")
          : null,
        endTime: user.agentSchedule.endTime
          ? dayjs(user.agentSchedule.endTime, "HH:mm")
          : null,
      });
    }
  }, [user, editSchedule, form]);

  const handleSaveSchedule = async (values) => {
    try {
      const payload = {
        startTime: dayjs(values.startTime).format("HH:mm"),
        endTime: dayjs(values.endTime).format("HH:mm"),
      };

      const res = await changeSchedule({
        id: userId,
        data: payload,
      }).unwrap();

      toast.success(res?.message || "Schedule updated");
      setEditSchedule(false);
    } catch (e) {
      toast.error(e?.data?.message || "Failed to update schedule");
    }
  };

  const titleMap = {
    user: "User Profile",
    vendor: "Vendor Profile",
    rider: "Rider Profile",
    agent: "Agent Profile",
  };

  const roleColor = {
    user: "blue",
    vendor: "green",
    rider: "purple",
    agent: "orange",
  };

  if (!open) return null;

  return (
    <Modal
      title={titleMap[role] || "Profile Details"}
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      centered
      width={980}
      destroyOnClose
    >
      {isLoading || isFetching ? (
        <div className="flex h-64 items-center justify-center">
          <Spin size="large" />
        </div>
      ) : !user ? (
        <div className="py-16 text-center text-gray-500">
          No user data found
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col items-center border-b pb-6">
            <Avatar
              size={110}
              src={user.profileAvatar || undefined}
              className="border-4 border-slate-200"
            >
              {user.name?.[0]?.toUpperCase()}
            </Avatar>
            <h2 className="mt-4 text-2xl font-bold">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <div className="mt-2 flex gap-2">
              <Tag color={roleColor[user.role] || "default"}>
                {user.role?.toUpperCase()}
              </Tag>
              <Tag color={user.status === "active" ? "green" : "red"}>
                {user.status?.toUpperCase()}
              </Tag>
              {user.id && <Tag color="default">{user.id}</Tag>}
            </div>
          </div>

          {/* Common Info */}
          <Descriptions
            bordered
            column={2}
            size="middle"
            className="mt-6"
            labelStyle={{ fontWeight: 600, width: 160 }}
          >
            <Descriptions.Item label="Phone">
              {user.phone || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {user.email || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Gender">
              {user.gender || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Date of Birth">
              {user.dob ? dayjs(user.dob).format("DD MMM YYYY") : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Address" span={2}>
              {user.address || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Joined">
              {user.createdAt
                ? dayjs(user.createdAt).format("DD MMM YYYY, hh:mm A")
                : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Profile Setup">
              {user.isProfileSetUp ? (
                <Tag color="green">Completed</Tag>
              ) : (
                <Tag color="orange">Incomplete</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Balance">
              ${user.balance ?? 0}
            </Descriptions.Item>
            <Descriptions.Item label="Coins">
              {user.coins ?? 0}
            </Descriptions.Item>
          </Descriptions>

          {/* VENDOR */}
          {user.role === "vendor" && (
            <div className="mt-6">
              <h3 className="mb-3 text-lg font-semibold">Vendor Details</h3>
              {user.coverPhoto && (
                <Image
                  src={user.coverPhoto}
                  alt="Cover"
                  className="mb-4 max-h-40 w-full rounded-lg object-cover"
                />
              )}
              <Descriptions bordered column={2} size="middle">
                <Descriptions.Item label="Description" span={2}>
                  {user.description || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Avg Rating">
                  {user.avgRating ?? 0} ({user.ratingCount ?? 0} reviews)
                </Descriptions.Item>
                <Descriptions.Item label="Followers">
                  {user.followers ?? 0}
                </Descriptions.Item>
                <Descriptions.Item label="Referral Code">
                  {user.referralCode || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Wallet Balance">
                  ${user.walletBalance ?? 0}
                </Descriptions.Item>
              </Descriptions>
            </div>
          )}

          {/* RIDER */}
          {user.role === "rider" && (
            <div className="mt-6">
              <h3 className="mb-3 text-lg font-semibold">Rider Details</h3>
              <Descriptions bordered column={2} size="middle">
                <Descriptions.Item label="Completed Deliveries">
                  {user.completedDeliveries ?? 0}
                </Descriptions.Item>
                <Descriptions.Item label="Online Status">
                  <Tag color={user.isOnline ? "green" : "default"}>
                    {user.isOnline ? "Online" : "Offline"}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Activate Mode">
                  {user.hasRiderActivateMode ? "Yes" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Security Code Set">
                  {user.hasSetSecurityCode ? "Yes" : "No"}
                </Descriptions.Item>
                {user.kyc && (
                  <>
                    <Descriptions.Item label="KYC Status">
                      <Tag
                        color={
                          user.kyc.status === "approved" ? "green" : "orange"
                        }
                      >
                        {user.kyc.status}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Vehicle">
                      {user.kyc.vehicle || "N/A"}
                    </Descriptions.Item>
                  </>
                )}
              </Descriptions>

              {user.kyc && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {user.kyc.license?.length > 0 && (
                    <div>
                      <p className="mb-2 font-medium">License</p>
                      <div className="flex flex-wrap gap-2">
                        {user.kyc.license.map((img, i) => (
                          <Image
                            key={i}
                            src={img}
                            width={120}
                            height={80}
                            alt="License"
                            className="rounded object-cover"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {user.kyc.nationalId?.length > 0 && (
                    <div>
                      <p className="mb-2 font-medium">National ID</p>
                      <div className="flex flex-wrap gap-2">
                        {user.kyc.nationalId.map((img, i) => (
                          <Image
                            key={i}
                            src={img}
                            width={120}
                            height={80}
                            alt="National ID"
                            className="rounded object-cover"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* USER */}
          {user.role === "user" && user.deliveryAddress && (
            <div className="mt-6">
              <h3 className="mb-3 text-lg font-semibold">Delivery Address</h3>
              <Descriptions bordered column={2} size="middle">
                <Descriptions.Item label="Name">
                  {user.deliveryAddress.name || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="City">
                  {user.deliveryAddress.city || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Building No">
                  {user.deliveryAddress.buildingNo || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Floor">
                  {user.deliveryAddress.floorNo || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Apartment">
                  {user.deliveryAddress.apartment || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Country">
                  {user.deliveryAddress.country || "N/A"}
                </Descriptions.Item>
              </Descriptions>
            </div>
          )}

          {/* AGENT */}
          {user.role === "agent" && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">Agent Details</h3>
              <Descriptions bordered column={2} size="middle">
                <Descriptions.Item label="Customer Support">
                  {user.hasCustomerSupport ? (
                    <Tag color="green">Yes</Tag>
                  ) : (
                    <Tag>No</Tag>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Staff Support">
                  {user.hasStaffSupport ? (
                    <Tag color="green">Yes</Tag>
                  ) : (
                    <Tag>No</Tag>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Needs Password Change">
                  {user.needsPasswordChange ? "Yes" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Unread Chats">
                  {user.unreadChatCount ?? 0}
                </Descriptions.Item>
              </Descriptions>

              {/* Schedule */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="flex items-center gap-2 font-semibold text-slate-700">
                    <Clock size={18} className="text-[#1B70A6]" />
                    Work Schedule
                  </h4>
                  {!editSchedule && (
                    <Button
                      type="link"
                      icon={<Pencil size={14} />}
                      onClick={() => setEditSchedule(true)}
                    >
                      Edit
                    </Button>
                  )}
                </div>

                {!editSchedule ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-400">Start Time</p>
                      <p className="text-lg font-semibold text-slate-800">
                        {user.agentSchedule?.startTime || "—"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-400">End Time</p>
                      <p className="text-lg font-semibold text-slate-800">
                        {user.agentSchedule?.endTime || "—"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSaveSchedule}
                    className="mt-1"
                  >
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <Form.Item
                        name="startTime"
                        label="Start Time"
                        rules={[
                          { required: true, message: "Select start time" },
                        ]}
                      >
                        <TimePicker
                          format="HH:mm"
                          className="!w-full"
                          minuteStep={15}
                          needConfirm={false}
                          size="large"
                        />
                      </Form.Item>
                      <Form.Item
                        name="endTime"
                        label="End Time"
                        rules={[{ required: true, message: "Select end time" }]}
                      >
                        <TimePicker
                          format="HH:mm"
                          className="!w-full"
                          minuteStep={15}
                          needConfirm={false}
                          size="large"
                        />
                      </Form.Item>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button onClick={() => setEditSchedule(false)}>
                        Cancel
                      </Button>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={saving}
                        icon={<Save size={14} />}
                      >
                        Save Schedule
                      </Button>
                    </div>
                  </Form>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </Modal>
  );
}
