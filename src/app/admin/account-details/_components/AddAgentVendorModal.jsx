"use client";

import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  ConfigProvider,
  TimePicker,
} from "antd";
import { useAddAgentMutation, useAddVendorMutation } from "@/redux/api/userApi";
import toast from "react-hot-toast";
import dayjs from "dayjs";

const countryOptions = [
  { label: "Bangladesh (+880)", value: "BN", dial: "+880" },
  { label: "India (+91)", value: "IN", dial: "+91" },
  { label: "United States (+1)", value: "US", dial: "+1" },
  { label: "United Kingdom (+44)", value: "GB", dial: "+44" },
  { label: "Saudi Arabia (+966)", value: "SA", dial: "+966" },
  { label: "UAE (+971)", value: "AE", dial: "+971" },
  { label: "Pakistan (+92)", value: "PK", dial: "+92" },
  { label: "Malaysia (+60)", value: "MY", dial: "+60" },
  { label: "Egypt (+20)", value: "EG", dial: "+20" },
];

export default function AddAgentVendorModal({
  open,
  setOpen,
  type = "vendor", // "vendor" | "agent"
}) {
  const [form] = Form.useForm();
  const [addVendor, { isLoading: vendorLoading }] = useAddVendorMutation();
  const [addAgent, { isLoading: agentLoading }] = useAddAgentMutation();

  const isLoading = vendorLoading || agentLoading;
  const isAgent = type === "agent";
  const title = isAgent ? "Add New Agent" : "Add New Vendor";

  const handleSubmit = async (values) => {
    try {
      const selectedCountry = countryOptions.find(
        (c) => c.value === values.countryCode,
      );

      const payload = {
        name: values.name?.trim(),
        email: values.email?.trim(),
        countryCode: values.countryCode,
        phone: `${selectedCountry?.dial || ""}${values.phone}`,
      };

      // Agent only — schedule
      if (isAgent) {
        payload.agentSchedule = {
          startTime: values.startTime
            ? dayjs(values.startTime).format("HH:mm")
            : "09:00",
          endTime: values.endTime
            ? dayjs(values.endTime).format("HH:mm")
            : "17:00",
        };
      }

      let res;
      if (isAgent) {
        res = await addAgent(payload).unwrap();
      } else {
        res = await addVendor(payload).unwrap();
      }

      toast.success(
        res?.message || `${isAgent ? "Agent" : "Vendor"} added successfully`,
      );
      form.resetFields();
      setOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || `Failed to add ${type}`);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#F75908",
        },
        components: {
          Button: {
            colorPrimary: "#F75908",
            colorPrimaryHover: "#F75908",
          },
        },
      }}
    >
      <Modal
        title={<span className="text-xl font-semibold">{title}</span>}
        open={open}
        onCancel={handleCancel}
        footer={null}
        centered
        destroyOnClose
        width={640}
        styles={{
          body: { paddingTop: 20 },
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          initialValues={{
            countryCode: "BN",
            startTime: dayjs("09:00", "HH:mm"),
            endTime: dayjs("15:00", "HH:mm"),
          }}
          size="large"
        >
          <Form.Item
            label="Full Name"
            name="name"
            rules={[
              { required: true, message: "Please enter name" },
              { min: 2, message: "Name must be at least 2 characters" },
            ]}
          >
            <Input placeholder="Enter full name" className="!rounded-lg" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Enter email address" className="!rounded-lg" />
          </Form.Item>

          <Form.Item label="Phone Number" required className="mb-0">
            <div className="flex w-full items-start gap-3">
              <Form.Item
                name="countryCode"
                rules={[{ required: true, message: "Select country" }]}
                className="mb-0 w-[220px] shrink-0"
              >
                <Select
                  options={countryOptions.map((c) => ({
                    label: c.label,
                    value: c.value,
                  }))}
                  placeholder="Country"
                  className="w-full"
                  popupMatchSelectWidth={false}
                />
              </Form.Item>

              <Form.Item
                name="phone"
                rules={[
                  { required: true, message: "Please enter phone number" },
                  {
                    pattern: /^[0-9]{6,15}$/,
                    message: "Enter a valid phone number (6-15 digits)",
                  },
                ]}
                className="mb-0 flex-1"
              >
                <Input
                  placeholder="1XXXXXXXXX"
                  className="!rounded-lg"
                  maxLength={15}
                />
              </Form.Item>
            </div>
          </Form.Item>

          {/* Agent schedule only */}
          {isAgent && (
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Form.Item
                label="Shift Start"
                name="startTime"
                rules={[{ required: true, message: "Select start time" }]}
              >
                <TimePicker
                  format="HH:mm"
                  className="!w-full !rounded-lg"
                  minuteStep={15}
                  needConfirm={false}
                />
              </Form.Item>
              <Form.Item
                label="Shift End"
                name="endTime"
                rules={[{ required: true, message: "Select end time" }]}
              >
                <TimePicker
                  format="HH:mm"
                  className="!w-full !rounded-lg"
                  minuteStep={15}
                  needConfirm={false}
                />
              </Form.Item>
            </div>
          )}

          <div className="mt-8 flex justify-end gap-3">
            <Button size="large" onClick={handleCancel} className="!rounded-lg">
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isLoading}
              className="!rounded-lg !bg-[#F75908] hover:!bg-[#F75908]"
            >
              {isAgent ? "Add Agent" : "Add Vendor"}
            </Button>
          </div>
        </Form>
      </Modal>
    </ConfigProvider>
  );
}
