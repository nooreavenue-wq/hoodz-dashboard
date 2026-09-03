"use client";

import { useEffect } from "react";
import { Form, InputNumber, Button, message, Card } from "antd";
import { useUpdateGeneralSettingsMutation } from "@/redux/api/settingsApi";
import { Save } from "lucide-react";
import toast from "react-hot-toast";

export default function GeneralRiderSettings({ initialData = {} }) {
  const [form] = Form.useForm();
  const [updateGeneral, { isLoading }] = useUpdateGeneralSettingsMutation();

  useEffect(() => {
    form.setFieldsValue({
      riderMatchIntervalSeconds: initialData.riderMatchIntervalSeconds ?? 180,
      riderMatchMaxAttempts: initialData.riderMatchMaxAttempts ?? 5,
    });
  }, [initialData, form]);

  const handleSubmit = async (values) => {
    try {
      // Body: { riderMatchIntervalSeconds, riderMatchMaxAttempts }
      const payload = {
        riderMatchIntervalSeconds: Number(values.riderMatchIntervalSeconds),
        riderMatchMaxAttempts: Number(values.riderMatchMaxAttempts),
      };

      const res = await updateGeneral(payload).unwrap();
      toast.success(res?.message || "General settings updated");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update settings");
    }
  };

  return (
    <div className="max-w-md">
      <Card className="border-slate-200">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Form.Item
            name="riderMatchIntervalSeconds"
            label="Rider Match Interval (seconds)"
            rules={[
              { required: true, message: "Required" },
              { type: "number", min: 10, message: "Min 10 seconds" },
            ]}
            extra="How often the system tries to match a rider"
          >
            <InputNumber
              size="large"
              min={10}
              className="!w-full !rounded-lg"
              placeholder="180"
            />
          </Form.Item>

          <Form.Item
            name="riderMatchMaxAttempts"
            label="Max Match Attempts"
            rules={[
              { required: true, message: "Required" },
              { type: "number", min: 1, message: "Min 1 attempt" },
            ]}
            extra="Maximum times to retry finding a rider"
          >
            <InputNumber
              size="large"
              min={1}
              max={50}
              className="!w-full !rounded-lg"
              placeholder="5"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            icon={<Save size={16} />}
            loading={isLoading}
            className="w-full"
          >
            Save Rider Settings
          </Button>
        </Form>
      </Card>
    </div>
  );
}
