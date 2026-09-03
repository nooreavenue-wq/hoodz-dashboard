"use client";

import { useEffect } from "react";
import {
  Form,
  InputNumber,
  Select,
  Switch,
  TimePicker,
  Button,
  message,
  Spin,
  Card,
} from "antd";
import {
  useGetVendorgeneralQuery,
  useUpdateVendorGeneralMutation,
} from "@/redux/api/vendorMetaApi";
import { Save } from "lucide-react";
import dayjs from "dayjs";
import toast from "react-hot-toast";

const unitOptions = [
  { label: "Minute", value: "minute" },
  { label: "Hour", value: "hour" },
  { label: "Day", value: "day" },
];

const weekendOptions = [
  { label: "Sunday", value: "sun" },
  { label: "Monday", value: "mon" },
  { label: "Tuesday", value: "tue" },
  { label: "Wednesday", value: "wed" },
  { label: "Thursday", value: "thu" },
  { label: "Friday", value: "fri" },
  { label: "Saturday", value: "sat" },
];

const timezoneOptions = [
  { label: "Africa/Cairo", value: "Africa/Cairo" },
  { label: "Asia/Dhaka", value: "Asia/Dhaka" },
  { label: "Asia/Riyadh", value: "Asia/Riyadh" },
  { label: "Asia/Dubai", value: "Asia/Dubai" },
  { label: "UTC", value: "UTC" },
];

function TimeUnitField({ timeName, unitName, label }) {
  return (
    <Form.Item label={label} className="mb-0">
      <div className="flex gap-2">
        <Form.Item
          name={timeName}
          noStyle
          rules={[{ required: true, message: "Required" }]}
        >
          <InputNumber min={1} className="!w-24" size="large" />
        </Form.Item>
        <Form.Item
          name={unitName}
          noStyle
          rules={[{ required: true, message: "Required" }]}
        >
          <Select options={unitOptions} className="!w-28" size="large" />
        </Form.Item>
      </div>
    </Form.Item>
  );
}

export default function VendorShopSettings({ vendorId }) {
  const [form] = Form.useForm();

  const { data, isLoading } = useGetVendorgeneralQuery(
    { id: vendorId },
    { skip: !vendorId },
  );

  const [updateGeneral, { isLoading: saving }] =
    useUpdateVendorGeneralMutation();

  const settings = data?.data;

  useEffect(() => {
    if (!settings) return;

    form.setFieldsValue({
      returnPolicyTime: settings.returnPolicyTime?.time,
      returnPolicyUnit: settings.returnPolicyTime?.unit || "day",
      deliveryMinTime: settings.deliveryMinTime?.time,
      deliveryMinUnit: settings.deliveryMinTime?.unit || "day",
      deliveryMaxTime: settings.deliveryMaxTime?.time,
      deliveryMaxUnit: settings.deliveryMaxTime?.unit || "day",
      instantDeliveryMinTime: settings.instantDeliveryMinTime?.time,
      instantDeliveryMinUnit: settings.instantDeliveryMinTime?.unit || "minute",
      instantDeliveryMaxTime: settings.instantDeliveryMaxTime?.time,
      instantDeliveryMaxUnit: settings.instantDeliveryMaxTime?.unit || "hour",
      isInstantDeliveryAvailable: settings.isInstantDeliveryAvailable ?? false,
      openingTime: settings.openingTime
        ? dayjs(settings.openingTime, "HH:mm")
        : null,
      closingTime: settings.closingTime
        ? dayjs(settings.closingTime, "HH:mm")
        : null,
      weekends: settings.weekends || [],
      timezone: settings.timezone || "Asia/Dhaka",
    });
  }, [settings, form]);

  const handleSubmit = async (values) => {
    try {
      const payload = {
        returnPolicyTime: {
          time: values.returnPolicyTime,
          unit: values.returnPolicyUnit,
        },
        deliveryMinTime: {
          time: values.deliveryMinTime,
          unit: values.deliveryMinUnit,
        },
        deliveryMaxTime: {
          time: values.deliveryMaxTime,
          unit: values.deliveryMaxUnit,
        },
        instantDeliveryMinTime: {
          time: values.instantDeliveryMinTime,
          unit: values.instantDeliveryMinUnit,
        },
        instantDeliveryMaxTime: {
          time: values.instantDeliveryMaxTime,
          unit: values.instantDeliveryMaxUnit,
        },
        isInstantDeliveryAvailable: values.isInstantDeliveryAvailable,
        openingTime: values.openingTime?.format("HH:mm"),
        closingTime: values.closingTime?.format("HH:mm"),
        weekends: values.weekends || [],
        timezone: values.timezone,
      };

      const res = await updateGeneral(payload).unwrap();
      toast.success(res?.message || "Shop settings updated");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update settings");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Spin />
      </div>
    );
  }

  return (
    <Card className="max-w-2xl border-slate-200">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TimeUnitField
            timeName="returnPolicyTime"
            unitName="returnPolicyUnit"
            label="Return Policy Time"
          />
          <TimeUnitField
            timeName="deliveryMinTime"
            unitName="deliveryMinUnit"
            label="Delivery Min Time"
          />
          <TimeUnitField
            timeName="deliveryMaxTime"
            unitName="deliveryMaxUnit"
            label="Delivery Max Time"
          />
          <TimeUnitField
            timeName="instantDeliveryMinTime"
            unitName="instantDeliveryMinUnit"
            label="Instant Delivery Min"
          />
          <TimeUnitField
            timeName="instantDeliveryMaxTime"
            unitName="instantDeliveryMaxUnit"
            label="Instant Delivery Max"
          />
        </div>

        {/* <Form.Item
          name="isInstantDeliveryAvailable"
          label="Instant Delivery Available"
          valuePropName="checked"
          className="mt-4"
        >
          <Switch />
        </Form.Item> */}

        <div className="!mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Form.Item
            name="openingTime"
            label="Opening Time"
            rules={[{ required: true }]}
          >
            <TimePicker format="HH:mm" size="large" className="!w-full" />
          </Form.Item>
          <Form.Item
            name="closingTime"
            label="Closing Time"
            rules={[{ required: true }]}
          >
            <TimePicker format="HH:mm" size="large" className="!w-full" />
          </Form.Item>
        </div>

        <Form.Item name="weekends" label="Weekends / Off Days">
          <Select
            mode="multiple"
            options={weekendOptions}
            size="large"
            placeholder="Select off days"
          />
        </Form.Item>

        <Form.Item
          name="timezone"
          label="Timezone"
          rules={[{ required: true }]}
        >
          <Select options={timezoneOptions} size="large" />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          icon={<Save size={16} />}
          loading={saving}
        >
          Save Shop Settings
        </Button>
      </Form>
    </Card>
  );
}
