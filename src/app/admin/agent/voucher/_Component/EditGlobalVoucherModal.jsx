"use client";

import { useEffect, useState } from "react";
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
  Spin,
} from "antd";
import {
  useUpdateVoucherMutation,
  useGetSingleVoucherQuery,
} from "@/redux/api/voucherApi";
import useFileUpload from "@/hooks/useFileUpload";
import toast from "react-hot-toast";
import dayjs from "dayjs";

const discountTypeOptions = [
  { label: "Fixed Amount", value: "fixed" },
  { label: "Percentage", value: "percentage" },
  { label: "Gift", value: "gift" },
];

export default function EditGlobalVoucherModal({ open, setOpen, voucherId }) {
  const [form] = Form.useForm();
  const discountType = Form.useWatch("discountType", form);

  const [giftImages, setGiftImages] = useState([]);
  const [giftPreviews, setGiftPreviews] = useState([]);

  const { data: singleRes, isLoading: loadingSingle } =
    useGetSingleVoucherQuery(voucherId, {
      skip: !voucherId || !open,
    });

  const [updateVoucher, { isLoading }] = useUpdateVoucherMutation();
  const { uploadFiles, uploading } = useFileUpload();

  useEffect(() => {
    if (!open || !singleRes?.data) return;
    const v = singleRes.data;

    form.setFieldsValue({
      code: v.code,
      title: v.title,
      description: v.description,
      discountType: v.discountType,
      discountValue: v.discountValue,
      minSpend: v.minSpend,
      expiryDate: v.expiryDate ? dayjs(v.expiryDate) : null,
      giftName: v.giftDetails?.name,
      giftDescription: v.giftDetails?.description,
    });
    setGiftPreviews(v.giftDetails?.bannerImage || []);
    setGiftImages([]);
  }, [open, singleRes, form]);

  const handleCancel = () => {
    form.resetFields();
    setGiftImages([]);
    setGiftPreviews([]);
    setOpen(false);
  };

  const handleSubmit = async (values) => {
    try {
      let bannerImage = [...giftPreviews];
      if (giftImages.length) {
        const urls = await uploadFiles(giftImages);
        bannerImage = [
          ...bannerImage.filter((u) => !String(u).startsWith("blob:")),
          ...urls,
        ];
      }

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

      const res = await updateVoucher({
        id: voucherId,
        payload,
      }).unwrap();
      toast.success(res?.message || "Voucher updated");
      handleCancel();
    } catch (e) {
      toast.error(e?.data?.message || "Failed to update");
    }
  };

  return (
    <Modal
      title="Edit Global Voucher"
      open={open}
      onCancel={handleCancel}
      footer={null}
      centered
      destroyOnClose
      width={560}
    >
      {loadingSingle ? (
        <div className="flex h-40 items-center justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-3"
        >
          <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
            <Form.Item name="code" label="Code" rules={[{ required: true }]}>
              <Input size="large" className="!uppercase" />
            </Form.Item>
            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
              <Input size="large" />
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
                <Input.TextArea rows={2} />
              </Form.Item>
              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <Form.Item
                  name="discountValue"
                  label={
                    discountType === "percentage"
                      ? "Discount (%)"
                      : "Discount Amount"
                  }
                  rules={[{ required: true }]}
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
                rules={[{ required: true }]}
              >
                <Input size="large" />
              </Form.Item>
              <Form.Item name="giftDescription" label="Gift Description">
                <Input.TextArea rows={2} />
              </Form.Item>
              <Form.Item label="Gift Images">
                <div className="mb-2 flex flex-wrap gap-2">
                  {giftPreviews.map((url, i) => (
                    <div key={i} className="relative">
                      <Image
                        alt="gift"
                        src={url}
                        width={72}
                        height={72}
                        className="rounded object-cover"
                      />
                      <button
                        type="button"
                        className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1 text-xs text-white"
                        onClick={() =>
                          setGiftPreviews((p) =>
                            p.filter((_, idx) => idx !== i),
                          )
                        }
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <Upload
                  multiple
                  fileList={giftImages}
                  beforeUpload={() => false}
                  accept="image/*"
                  listType="picture-card"
                  onChange={({ fileList }) => setGiftImages(fileList)}
                >
                  + Add
                </Upload>
              </Form.Item>
            </>
          )}

          <Form.Item
            name="expiryDate"
            label="Expiry Date"
            rules={[{ required: true }]}
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
            Update Global Voucher
          </Button>
        </Form>
      )}
    </Modal>
  );
}
