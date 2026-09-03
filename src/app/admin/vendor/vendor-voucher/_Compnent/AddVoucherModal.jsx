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
import { useSelector } from "react-redux";
import { selectToken } from "@/redux/features/authSlice"; // adjust path
import { jwtDecode } from "jwt-decode";
import { useAddVoucherMutation } from "@/redux/api/voucherApi";
import useFileUpload from "@/hooks/useFileUpload";
import toast from "react-hot-toast";

const discountTypeOptions = [
  { label: "Fixed Amount", value: "fixed" },
  { label: "Percentage", value: "percentage" },
  { label: "Gift", value: "gift" },
];

export default function AddVoucherModal({ open, setOpen }) {
  const [form] = Form.useForm();
  const discountType = Form.useWatch("discountType", form);

  const [giftImages, setGiftImages] = useState([]);
  const [giftPreviews, setGiftPreviews] = useState([]);

  const token = useSelector(selectToken);
  let userId = null;
  try {
    userId = token ? jwtDecode(token)?.userId : null;
  } catch {
    userId = null;
  }

  const [addVoucher, { isLoading }] = useAddVoucherMutation();
  const { uploadFiles, uploading } = useFileUpload();

  const handleCancel = () => {
    form.resetFields();
    setGiftImages([]);
    setGiftPreviews([]);
    setOpen(false);
  };

  const handleSubmit = async (values) => {
    if (!userId) {
      toast.error("User not found. Please login again.");
      return;
    }

    try {
      let bannerImage = [];
      if (giftImages.length) {
        bannerImage = await uploadFiles(giftImages);
      }

      // Base payload
      const payload = {
        code: values.code?.trim()?.toUpperCase(),
        title: values.title?.trim(),
        voucherType: "shop",
        shop: userId, // vendor/shop id from JWT
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
        // fixed | percentage
        payload.description = values.description?.trim() || "";
        payload.discountValue = Number(values.discountValue) || 0;
        payload.minSpend = Number(values.minSpend) || 0;
      }

      const res = await addVoucher(payload).unwrap();
      toast.success(res?.message || "Voucher created");
      handleCancel();
    } catch (e) {
      toast.error(e?.data?.message || "Failed to create voucher");
    }
  };

  return (
    <Modal
      title="Add Voucher"
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
            <Input size="large" placeholder="HOODZ50" className="!uppercase" />
          </Form.Item>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input size="large" placeholder="Voucher title" />
          </Form.Item>
        </div>

        <Form.Item
          name="discountType"
          label="Discount Type"
          rules={[{ required: true }]}
        >
          <Select size="large" options={discountTypeOptions} />
        </Form.Item>

        {/* Fixed / Percentage */}
        {discountType !== "gift" && (
          <>
            <Form.Item name="description" label="Description">
              <Input.TextArea rows={2} placeholder="50 EGP off" />
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

        {/* Gift */}
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
              <div className="mb-2 flex flex-wrap gap-2">
                {giftPreviews.map((url, i) => (
                  <Image
                    alt="gift"
                    key={i}
                    src={url}
                    width={72}
                    height={72}
                    className="rounded object-cover"
                  />
                ))}
              </div>
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
          Create Voucher
        </Button>
      </Form>
    </Modal>
  );
}
