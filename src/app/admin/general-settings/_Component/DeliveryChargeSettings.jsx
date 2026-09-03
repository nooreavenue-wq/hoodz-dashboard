"use client";

import { useEffect } from "react";
import { Form, InputNumber, Button, Card } from "antd";
import { useSetDeliveryFeeMutation } from "@/redux/api/settingsApi";
import { Save, Truck, Zap } from "lucide-react";
import toast from "react-hot-toast";

export default function DeliveryChargeSettings({ initialData = {} }) {
  const [form] = Form.useForm();
  const [setDeliveryFee, { isLoading }] = useSetDeliveryFeeMutation();

  useEffect(() => {
    form.setFieldsValue({
      regularDeliveryChargePerKm: initialData?.regularDeliveryChargePerKm ?? 0,
      instantDeliveryChargePerKm: initialData?.instantDeliveryChargePerKm ?? 0,
    });
  }, [initialData, form]);

  const handleSave = async (values) => {
    try {
      const body = {
        value: {
          regularDeliveryChargePerKm:
            Number(values.regularDeliveryChargePerKm) || 0,
          instantDeliveryChargePerKm:
            Number(values.instantDeliveryChargePerKm) || 0,
        },
      };

      const res = await setDeliveryFee(body).unwrap();
      toast.success(res?.message || "Delivery charges updated");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update delivery charges");
    }
  };

  return (
    <div className="max-w-xl">
      <p className="mb-6 text-sm text-slate-500">
        Set delivery charge per kilometer for regular and instant delivery
      </p>

      <Form form={form} layout="vertical" onFinish={handleSave} size="large">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card className="!border-slate-100 !bg-slate-50/50 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-slate-700">
              <Truck size={18} className="text-[#1B70A6]" />
              <span className="font-medium">Regular Delivery</span>
            </div>
            <Form.Item
              name="regularDeliveryChargePerKm"
              label="Charge per km ($)"
              rules={[{ required: true, message: "Required" }]}
              className="!mb-0"
            >
              <InputNumber
                min={0}
                step={0.5}
                className="!w-full"
                prefix="$"
                placeholder="10"
              />
            </Form.Item>
          </Card>

          <Card className="!border-slate-100 !bg-orange-50/40 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-slate-700">
              <Zap size={18} className="text-[#F75908]" />
              <span className="font-medium">Instant Delivery</span>
            </div>
            <Form.Item
              name="instantDeliveryChargePerKm"
              label="Charge per km ($)"
              rules={[{ required: true, message: "Required" }]}
              className="!mb-0"
            >
              <InputNumber
                min={0}
                step={0.5}
                className="!w-full"
                prefix="$"
                placeholder="18"
              />
            </Form.Item>
          </Card>
        </div>

        <Button
          type="primary"
          htmlType="submit"
          icon={<Save size={16} />}
          loading={isLoading}
          className="mt-6"
          size="large"
        >
          Save Changes
        </Button>
      </Form>
    </div>
  );
}
