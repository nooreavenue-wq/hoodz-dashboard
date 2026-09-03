"use client";

import { useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { useSetFawryAccountMutation } from "@/redux/api/settingsApi";
import { Save } from "lucide-react";
import toast from "react-hot-toast";

const { TextArea } = Input;

export default function FawryAccountSettings({ initialData = {} }) {
  const [form] = Form.useForm();
  const [setFawryAccount, { isLoading }] = useSetFawryAccountMutation();

  useEffect(() => {
    form.setFieldsValue({
      fawryRefCode: initialData.fawryRefCode || "",
      fawryMerchantCode: initialData.fawryMerchantCode || "",
      fawryAccountNumber: initialData.fawryAccountNumber || "",
      fawryAccountName: initialData.fawryAccountName || "",
      fawryInstructions: initialData.fawryInstructions || "",
    });
  }, [initialData, form]);

  const handleSubmit = async (values) => {
    try {
      // Body exactly as API expects
      const payload = {
        fawryRefCode: values.fawryRefCode?.trim(),
        fawryMerchantCode: values.fawryMerchantCode?.trim(),
        fawryAccountNumber: values.fawryAccountNumber?.trim(),
        fawryAccountName: values.fawryAccountName?.trim(),
        fawryInstructions: values.fawryInstructions?.trim(),
      };

      const res = await setFawryAccount(payload).unwrap();
      toast.success(res?.message || "Fawry account updated");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update Fawry account");
    }
  };

  return (
    <div className="max-w-xl">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
      >
        <Form.Item
          name="fawryRefCode"
          label="Fawry Ref Code"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input size="large" placeholder="XXXX" className="!rounded-lg" />
        </Form.Item>

        <Form.Item
          name="fawryMerchantCode"
          label="Fawry Merchant Code"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input size="large" placeholder="XXXX" className="!rounded-lg" />
        </Form.Item>

        <Form.Item
          name="fawryAccountNumber"
          label="Fawry Account Number"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input
            size="large"
            placeholder="01XXXXXXXXX"
            className="!rounded-lg"
          />
        </Form.Item>

        <Form.Item
          name="fawryAccountName"
          label="Fawry Account Name"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input size="large" placeholder="Hoodz" className="!rounded-lg" />
        </Form.Item>

        <Form.Item
          name="fawryInstructions"
          label="Instructions"
          rules={[{ required: true, message: "Required" }]}
        >
          <TextArea
            rows={3}
            placeholder="Pay via Fawry using this ref code"
            className="!rounded-lg"
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          icon={<Save size={16} />}
          loading={isLoading}
        >
          Save Fawry Settings
        </Button>
      </Form>
    </div>
  );
}
