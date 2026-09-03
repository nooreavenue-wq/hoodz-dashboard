"use client";

import { useEffect, useState } from "react";
import { Modal, Form, Select, Button, Upload, Image, Radio } from "antd";
import {
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useGetCampainsQuery,
} from "@/redux/api/bannerApi";
import { useGetAllProductsQuery } from "@/redux/api/productApi";
import { useGetAllVendorsQuery } from "@/redux/api/userApi";
import useFileUpload from "@/hooks/useFileUpload";
import toast from "react-hot-toast";
import { Upload as UploadIcon } from "lucide-react";

const TYPE_OPTIONS = [
  { label: "Product", value: "product" },
  { label: "Shop", value: "shop" },
  { label: "Campaign", value: "campain" },
];

const SECTION_OPTIONS = [
  { label: "First", value: "first" },
  { label: "Second", value: "second" },
];

export default function BannerFormModal({ open, setOpen, editData }) {
  const [form] = Form.useForm();
  const isEdit = !!editData;
  const [bannerUrl, setBannerUrl] = useState(null);
  const [fileList, setFileList] = useState([]);
  const typeWatch = Form.useWatch("type", form);

  const { uploadFiles, uploading } = useFileUpload();
  const [createBanner, { isLoading: creating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: updating }] = useUpdateBannerMutation();

  // Load references based on type
  const { data: productsRes, isLoading: loadingProducts } =
    useGetAllProductsQuery(
      { page: 1, limit: 100, searchText: "" },
      { skip: !open || typeWatch !== "product" },
    );
  const { data: vendorsRes, isLoading: loadingVendors } = useGetAllVendorsQuery(
    { page: 1, limit: 100, searchText: "" },
    { skip: !open || typeWatch !== "shop" },
  );
  const { data: campainsRes, isLoading: loadingCampains } = useGetCampainsQuery(
    { page: 1, limit: 100, searchText: "" },
    { skip: !open || typeWatch !== "campain" },
  );

  const products = productsRes?.data || [];
  const vendors = vendorsRes?.data || [];
  const campaigns = campainsRes?.data || [];

  useEffect(() => {
    if (open && editData) {
      form.setFieldsValue({
        type: editData.type,
        section: editData.section,
        reference: editData.reference,
      });
      setBannerUrl(editData.banner);
      setFileList([]);
    } else if (open) {
      form.resetFields();
      form.setFieldsValue({ type: "product", section: "first" });
      setBannerUrl(null);
      setFileList([]);
    }
  }, [open, editData, form]);

  // Clear reference when type changes (create mode)
  useEffect(() => {
    if (!isEdit && typeWatch) {
      form.setFieldValue("reference", undefined);
    }
  }, [typeWatch, isEdit, form]);

  const referenceOptions = () => {
    if (typeWatch === "product") {
      return products.map((p) => ({
        value: p._id,
        label: p.title,
        banner: p.banner,
      }));
    }
    if (typeWatch === "shop") {
      return vendors.map((v) => ({
        value: v._id,
        label: v.name,
        banner: v.profileAvatar,
      }));
    }
    if (typeWatch === "campain") {
      return campaigns.map((c) => ({
        value: c._id,
        label: c.title,
      }));
    }
    return [];
  };

  const handleSubmit = async (values) => {
    try {
      let banner = bannerUrl;

      if (fileList.length) {
        const uploaded = await uploadFiles(fileList);
        const list = Array.isArray(uploaded) ? uploaded : uploaded?.data || [];
        const urls = list
          .map((item) => (typeof item === "string" ? item : item?.url))
          .filter(Boolean);
        if (!urls[0]) {
          toast.error("Image upload failed");
          return;
        }
        banner = urls[0];
      }

      if (!banner) {
        toast.error("Please upload a banner image");
        return;
      }

      const payload = {
        banner,
        type: values.type,
        reference: values.reference,
        section: values.section,
      };

      let res;
      if (isEdit) {
        res = await updateBanner({ id: editData._id, payload }).unwrap();
      } else {
        res = await createBanner(payload).unwrap();
      }

      toast.success(res?.message || `Banner ${isEdit ? "updated" : "created"}`);
      setOpen(false);
    } catch (e) {
      toast.error(e?.data?.message || "Failed to save banner");
    }
  };

  return (
    <Modal
      title={isEdit ? "Edit Banner" : "Add Banner"}
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      centered
      destroyOnClose
      width={560}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        size="large"
        initialValues={{ type: "product", section: "first" }}
      >
        {/* Image */}
        <Form.Item label="Banner Image" required>
          {(bannerUrl || fileList.length > 0) && (
            <div className="mb-2">
              <Image
                src={
                  fileList[0]?.originFileObj
                    ? URL.createObjectURL(fileList[0].originFileObj)
                    : bannerUrl
                }
                width="100%"
                height={140}
                alt="banner"
                className="rounded-xl object-cover"
              />
            </div>
          )}
          <Upload
            maxCount={1}
            accept="image/*"
            fileList={fileList}
            beforeUpload={() => false}
            listType="picture-card"
            showUploadList={false}
            onChange={({ fileList: fl }) => {
              setFileList(fl);
              if (fl[0]?.originFileObj) {
                setBannerUrl(null);
              }
            }}
          >
            <div className="flex flex-col items-center gap-1 text-slate-500">
              <UploadIcon size={18} />
              <span className="text-xs">Upload</span>
            </div>
          </Upload>
        </Form.Item>

        <Form.Item
          name="type"
          label="Type"
          rules={[{ required: true, message: "Select type" }]}
        >
          <Radio.Group
            options={TYPE_OPTIONS}
            optionType="button"
            buttonStyle="solid"
          />
        </Form.Item>

        <Form.Item
          name="section"
          label="Section"
          rules={[{ required: true, message: "Select section" }]}
        >
          <Radio.Group
            options={SECTION_OPTIONS}
            optionType="button"
            buttonStyle="solid"
          />
        </Form.Item>

        <Form.Item
          name="reference"
          label={
            typeWatch === "product"
              ? "Product"
              : typeWatch === "shop"
                ? "Shop / Vendor"
                : "Campaign"
          }
          rules={[{ required: true, message: "Select reference" }]}
        >
          <Select
            showSearch
            allowClear
            placeholder={`Select ${typeWatch || "item"}`}
            optionFilterProp="label"
            loading={loadingProducts || loadingVendors || loadingCampains}
            options={referenceOptions()}
            optionRender={(option) => (
              <div className="flex items-center gap-2 py-1">
                {option.data.banner && (
                  <Image
                    src={option.data.banner}
                    width={28}
                    height={28}
                    preview={false}
                    alt={option.label}
                    className="rounded object-cover"
                  />
                )}
                <span className="truncate text-sm">{option.label}</span>
              </div>
            )}
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          loading={creating || updating || uploading}
        >
          {isEdit ? "Update Banner" : "Create Banner"}
        </Button>
      </Form>
    </Modal>
  );
}
