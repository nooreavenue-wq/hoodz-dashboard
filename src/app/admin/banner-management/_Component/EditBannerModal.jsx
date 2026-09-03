"use client";

import { useEffect, useState } from "react";
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
import { useUpdateBannerMutation } from "@/redux/api/bannerApi";
import useFileUpload from "@/hooks/useFileUpload";
import toast from "react-hot-toast";

export default function EditBannerModal({ open, setOpen, banner }) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [preview, setPreview] = useState(null);

  const [updateBanner, { isLoading }] = useUpdateBannerMutation();
  const { uploadSingle, uploading } = useFileUpload();

  useEffect(() => {
    if (open && banner) {
      form.setFieldsValue({
        reference: banner.reference,
        section: banner.section,
      });
      setPreview(banner.banner || null);
      setFileList([]);
    }
  }, [open, banner, form]);

  const handleSubmit = async (values) => {
    try {
      let bannerUrl = banner?.banner || null;

      if (fileList.length > 0) {
        bannerUrl = await uploadSingle(fileList[0]);
      }

      if (!bannerUrl) {
        toast.warning("Banner image is required");
        return;
      }

      const payload = {
        banner: bannerUrl,
        reference: values.reference?.trim() || "",
        section: values.section,
      };

      const res = await updateBanner({
        id: banner._id,
        payload,
      }).unwrap();

      toast.success(res?.message || "Banner updated successfully");
      setOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update banner");
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
      title="Edit Banner"
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
                No image
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
                }
              }}
            >
              <Button icon={<UploadIcon size={16} />}>Change Image</Button>
            </Upload>
          </div>
        </Form.Item>

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
          Update
        </Button>
      </Form>
    </Modal>
  );
}
