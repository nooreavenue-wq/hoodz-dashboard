"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  Form,
  InputNumber,
  Input,
  Button,
  Avatar,
  Tag,
  Upload,
  Image,
} from "antd";
import { useSubmitVendorPaymentMutation } from "@/redux/api/transactionApi";
import useFileUpload from "@/hooks/useFileUpload";
import toast from "react-hot-toast";
import { Wallet, X } from "lucide-react";

const { TextArea } = Input;

export default function VendorPaymentModal({ open, setOpen, vendor }) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [submitPayment, { isLoading }] = useSubmitVendorPaymentMutation();
  const { uploadFiles, uploading } = useFileUpload();

  const balance = Number(vendor?.balance ?? 0);

  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue({ amount: balance > 0 ? balance : undefined });
      setFileList([]);
      setPreviews([]);
    }
  }, [open, vendor, balance, form]);

  const handleSubmit = async (values) => {
    if (!vendor?._id) return;

    if (values.amount > balance) {
      toast.error(`Amount cannot exceed balance ($${balance})`);
      return;
    }

    try {
      let files = [];
      if (fileList.length) {
        files = await uploadFiles(fileList);
      }

      const body = {
        amount: Number(values.amount),
        note: values.note?.trim() || undefined,
      };

      if (files.length) {
        body.files = files;
      }

      const res = await submitPayment({
        id: vendor._id,
        data: body,
      }).unwrap();

      toast.success(res?.message || "Vendor paid successfully");

      if (res?.data?.remainingBalance != null) {
        toast.success(`Remaining balance: $${res.data.remainingBalance}`, {
          duration: 4000,
        });
      }

      form.resetFields();
      setFileList([]);
      setPreviews([]);
      setOpen(false);
    } catch (e) {
      toast.error(e?.data?.message || "Payment failed");
    }
  };

  return (
    <Modal
      title={
        <span className="flex items-center gap-2">
          <Wallet size={18} /> Pay Vendor
        </span>
      }
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      centered
      destroyOnClose
      width={480}
    >
      {vendor && (
        <div className="mb-4 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <Avatar size={44} src={vendor.profileAvatar}>
            {vendor.name?.[0]}
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold">{vendor.name}</p>
            <p className="text-xs text-slate-500">{vendor.email}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Balance</p>
            <Tag color="green" className="!m-0 !text-sm font-semibold">
              ${balance.toFixed(2)}
            </Tag>
          </div>
        </div>
      )}

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="amount"
          label="Amount"
          rules={[
            { required: true, message: "Enter amount" },
            {
              type: "number",
              min: 1,
              message: "Amount must be at least 1",
            },
          ]}
        >
          <InputNumber
            min={1}
            max={balance}
            size="large"
            className="!w-full"
            prefix="$"
            placeholder="150"
          />
        </Form.Item>

        <Form.Item name="note" label="Note (optional)">
          <TextArea
            rows={3}
            placeholder="March settlement"
            maxLength={200}
            showCount
          />
        </Form.Item>

        <Form.Item label="Receipt / Files (optional)">
          {previews.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {previews.map((url, i) => (
                <div key={i} className="relative">
                  <Image
                    src={url}
                    width={72}
                    height={72}
                    alt="file"
                    className="rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    className="absolute -right-1 -top-1 rounded-full bg-red-500 p-0.5 text-white"
                    onClick={() => {
                      setFileList((p) => p.filter((_, idx) => idx !== i));
                      setPreviews((p) => p.filter((_, idx) => idx !== i));
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Upload
            multiple
            fileList={fileList}
            beforeUpload={() => false}
            accept="image/*,.pdf"
            listType="picture-card"
            showUploadList={false}
            onChange={({ fileList: fl }) => {
              setFileList(fl);
              setPreviews(
                fl
                  .filter((f) => f.originFileObj)
                  .map((f) =>
                    f.originFileObj.type?.startsWith("image/")
                      ? URL.createObjectURL(f.originFileObj)
                      : null,
                  )
                  .filter(Boolean),
              );
            }}
          >
            {fileList.length < 5 && "+ Upload"}
          </Upload>
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={isLoading || uploading}
          disabled={balance <= 0}
          className="!h-11"
        >
          Confirm Payment
        </Button>
      </Form>
    </Modal>
  );
}
