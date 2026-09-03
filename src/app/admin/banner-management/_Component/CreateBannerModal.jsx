"use client";

import { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Upload,
  Image,
  message,
} from "antd";
import { Upload as UploadIcon } from "lucide-react";
import { useCreateBannerMutation } from "@/redux/api/bannerApi";
import useFileUpload from "@/hooks/useFileUpload";
import toast from "react-hot-toast";

export default function CreateBannerModal({ open, setOpen }) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [preview, setPreview] = useState(null);

  const [createBanner, { isLoading }] = useCreateBannerMutation();
  const { uploadSingle, uploading } = useFileUpload();

  const handleSubmit = async (values) => {
    try {
      if (!fileList.length) {
        toast.warning("Please upload a banner image");
        return;
      }

      const bannerUrl = await uploadSingle(fileList[0]);
      if (!bannerUrl) return;

      const payload = {
        banner: bannerUrl,
        reference: values.reference?.trim() || "",
        section: values.section,
      };

      const res = await createBanner(payload).unwrap();
      toast.success(res?.message || "Banner created successfully");
      form.resetFields();
      setFileList([]);
      setPreview(null);
      setOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create banner");
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
      title="Add Banner"
      open={open}
      onCancel={handleCancel}
      footer={null}
      centered
      destroyOnClose
      width={520}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4"
        initialValues={{ section: "first" }}
      >
        {/* Banner Image */}
        <Form.Item label="Banner Image" required>
          <div className="flex flex-col items-start gap-3">
            {preview ? (
              <Image
                src={preview}
                width="100%"
                height={160}
                alt="banner"
                className="rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-40 w-full items-center justify-center rounded-lg border border-dashed bg-slate-50 text-slate-400">
                No image selected
              </div>
            )}

            <Upload
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
                {preview ? "Change Image" : "Upload Banner"}
              </Button>
            </Upload>
          </div>
        </Form.Item>

        {/* Reference URL */}
        <Form.Item
          name="reference"
          label="Reference URL"
          rules={[
            { required: true, message: "Please enter reference URL" },
            { type: "url", message: "Enter a valid URL" },
          ]}
        >
          <Input
            size="large"
            placeholder="https://example.com"
            className="!rounded-lg"
          />
        </Form.Item>

        {/* Section */}
        <Form.Item
          name="section"
          label="Section"
          rules={[{ required: true, message: "Please select section" }]}
        >
          <Select
            size="large"
            options={[
              { label: "First", value: "first" },
              { label: "Second", value: "second" },
            ]}
          />
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
