"use client";

import { useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Button,
  Upload,
  Image,
} from "antd";
import { useAddVoucherMutation } from "@/redux/api/voucherApi";
import useFileUpload from "@/hooks/useFileUpload";
import toast from "react-hot-toast";

const discountTypeOptions = [
  { label: "Fixed Amount", value: "fixed" },
  { label: "Percentage", value: "percentage" },
  { label: "Gift", value: "gift" },
];

export default function AddGlobalVoucherModal({ open, setOpen }) {
  const [form] = Form.useForm();
  const discountType = Form.useWatch("discountType", form);

  const [giftImages, setGiftImages] = useState([]);
  const [giftPreviews, setGiftPreviews] = useState([]);

  const [addVoucher, { isLoading }] = useAddVoucherMutation();
  const { uploadFiles, uploading } = useFileUpload();

  const handleCancel = () => {
    form.resetFields();
    setGiftImages([]);
    setGiftPreviews([]);
    setOpen(false);
  };

  const handleSubmit = async (values) => {
    try {
      let bannerImage = [];
      if (giftImages.length) {
        bannerImage = await uploadFiles(giftImages);
      }

      // NO shop field — global only
      const payload = {
        code: values.code?.trim()?.toUpperCase(),
        title: values.title?.trim(),
        voucherType: "global",
        discountType: values.discountType,
        expiryDate: values.expiryDate
          ? values.expiryDate.endOf("day").toISOString()
          : null,
      };

      if (values.discountType === "gift") {
        payload.discountValue = 0;
        payload.giftDetails = {
          name: values.giftName?.trim() || "",
          bannerImage,
          description: values.giftDescription?.trim() || "",
        };
      } else {
        payload.description = values.description?.trim() || "";
        payload.discountValue = Number(values.discountValue) || 0;
        payload.minSpend = Number(values.minSpend) || 0;
      }

      const res = await addVoucher(payload).unwrap();
      toast.success(res?.message || "Global voucher created");
      handleCancel();
    } catch (e) {
      toast.error(e?.data?.message || "Failed to create voucher");
    }
  };

  return (
    <Modal
      title="Add Global Voucher"
      open={open}
      onCancel={handleCancel}
      footer={null}
      centered
      destroyOnClose
      width={560}
      afterOpenChange={(v) => {
        if (v) {
          form.setFieldsValue({
            discountType: "fixed",
            discountValue: 0,
            minSpend: 0,
          });
        }
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-3"
      >
        <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
          <Form.Item
            name="code"
            label="Code"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input size="large" placeholder="HOODZ10" className="!uppercase" />
          </Form.Item>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input size="large" placeholder="The Hoodz Voucher" />
          </Form.Item>
        </div>

        <Form.Item
          name="discountType"
          label="Discount Type"
          rules={[{ required: true }]}
        >
          <Select size="large" options={discountTypeOptions} />
        </Form.Item>

        {discountType !== "gift" && (
          <>
            <Form.Item name="description" label="Description">
              <Input.TextArea rows={2} placeholder="10 Percent off" />
            </Form.Item>
            <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
              <Form.Item
                name="discountValue"
                label={
                  discountType === "percentage"
                    ? "Discount (%)"
                    : "Discount Amount"
                }
                rules={[{ required: true, message: "Required" }]}
              >
                <InputNumber
                  min={0}
                  max={discountType === "percentage" ? 100 : undefined}
                  size="large"
                  className="!w-full"
                />
              </Form.Item>
              <Form.Item name="minSpend" label="Min Spend">
                <InputNumber min={0} size="large" className="!w-full" />
              </Form.Item>
            </div>
          </>
        )}

        {discountType === "gift" && (
          <>
            <Form.Item
              name="giftName"
              label="Gift Name"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input size="large" placeholder="Free Hoodie" />
            </Form.Item>
            <Form.Item name="giftDescription" label="Gift Description">
              <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item label="Gift Images">
              <Upload
                multiple
                fileList={giftImages}
                beforeUpload={() => false}
                accept="image/*"
                listType="picture-card"
                onChange={({ fileList }) => {
                  setGiftImages(fileList);
                  setGiftPreviews(
                    fileList
                      .filter((f) => f.originFileObj)
                      .map((f) => URL.createObjectURL(f.originFileObj)),
                  );
                }}
              >
                {giftImages.length < 5 && "+ Upload"}
              </Upload>
            </Form.Item>
          </>
        )}

        <Form.Item
          name="expiryDate"
          label="Expiry Date"
          rules={[{ required: true, message: "Required" }]}
        >
          <DatePicker size="large" className="!w-full" />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={uploading || isLoading}
        >
          Create Global Voucher
        </Button>
      </Form>
    </Modal>
  );
}
