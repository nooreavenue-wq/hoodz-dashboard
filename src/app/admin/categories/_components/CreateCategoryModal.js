"use client";

import { useState } from "react";
import { Button, Modal, Form, Input, Upload, message, Image } from "antd";
import { Plus, Upload as UploadIcon } from "lucide-react";
import { useCreateCategoryMutation } from "@/redux/api/categoriesApi";
import useFileUpload from "@/hooks/useFileUpload";
import toast from "react-hot-toast";

export default function CreateCategoryModal({ open, setOpen }) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [preview, setPreview] = useState(null);

  const [createCategory, { isLoading }] = useCreateCategoryMutation();
  const { uploadSingle, uploading } = useFileUpload();

  const handleSubmit = async (values) => {
    try {
      let iconUrl = null;

      if (fileList.length > 0) {
        iconUrl = await uploadSingle(fileList[0]);
      }

      if (!iconUrl) {
        message.warning("Please upload a category icon");
        return;
      }

      const payload = {
        title: values.title.trim(),
        icon: iconUrl,
      };

      const res = await createCategory(payload).unwrap();
      toast.success(res?.message || "Category created successfully");
      form.resetFields();
      setFileList([]);
      setPreview(null);
      setOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create category");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setPreview(null);
    setOpen(false);
  };

  return (
    <Modal
      centered
      open={open}
      onCancel={handleCancel}
      footer={null}
      title="Create Category"
      destroyOnClose
      width={480}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4"
      >
        <Form.Item
          name="title"
          label="Category Name"
          rules={[
            { required: true, message: "Please enter category name" },
            { min: 2, message: "Name must be at least 2 characters" },
          ]}
        >
          <Input
            size="large"
            placeholder="Enter category name"
            className="!rounded-lg"
          />
        </Form.Item>

        <Form.Item label="Category Icon" required>
          <div className="flex items-center gap-4">
            {preview ? (
              <Image
                src={preview}
                width={80}
                height={80}
                alt="category icon"
                className="rounded-lg object-contain"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-dashed bg-slate-50 text-slate-400">
                No image
              </div>
            )}

            <Upload
              listType="text"
              maxCount={1}
              fileList={fileList}
              beforeUpload={() => false}
              accept="image/*"
              showUploadList={false}
              onChange={({ fileList: fl }) => {
                setFileList(fl);
                if (fl[0]?.originFileObj) {
                  setPreview(URL.createObjectURL(fl[0].originFileObj));
                } else {
                  setPreview(null);
                }
              }}
            >
              <Button icon={<UploadIcon size={16} />}>
                {preview ? "Change Icon" : "Upload Icon"}
              </Button>
            </Upload>
          </div>
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          className="mt-2 w-full"
          loading={uploading || isLoading}
        >
          Submit
        </Button>
      </Form>
    </Modal>
  );
}
