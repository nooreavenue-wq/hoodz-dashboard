"use client";

import { useEffect } from "react";
import { Modal, Form, Input, Select, Button, Image } from "antd";
import {
  useCreateCampainMutation,
  useUpdateCampainMutation,
} from "@/redux/api/bannerApi";
import { useGetAllProductsQuery } from "@/redux/api/productApi";
import toast from "react-hot-toast";

export default function CampaignFormModal({ open, setOpen, editData }) {
  const [form] = Form.useForm();
  const isEdit = !!editData;

  const { data: productsRes, isLoading: loadingProducts } =
    useGetAllProductsQuery(
      { page: 1, limit: 100, searchText: "" },
      { skip: !open },
    );

  const [createCampain, { isLoading: creating }] = useCreateCampainMutation();
  const [updateCampain, { isLoading: updating }] = useUpdateCampainMutation();

  const products = productsRes?.data || [];

  useEffect(() => {
    if (open && editData) {
      form.setFieldsValue({
        title: editData.title,
        products: (editData.products || []).map((p) => p._id),
      });
    } else if (open) {
      form.resetFields();
    }
  }, [open, editData, form]);

  const handleSubmit = async (values) => {
    try {
      const payload = {
        title: values.title.trim(),
        products: values.products || [],
      };

      let res;
      if (isEdit) {
        res = await updateCampain({
          id: editData._id,
          payload,
        }).unwrap();
      } else {
        res = await createCampain(payload).unwrap();
      }

      toast.success(
        res?.message || `Campaign ${isEdit ? "updated" : "created"}`,
      );
      form.resetFields();
      setOpen(false);
    } catch (e) {
      toast.error(e?.data?.message || "Failed to save campaign");
    }
  };

  return (
    <Modal
      title={isEdit ? "Edit Campaign" : "Add Campaign"}
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      centered
      destroyOnClose
      width={560}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} size="large">
        <Form.Item
          name="title"
          label="Campaign Title"
          rules={[{ required: true, message: "Enter title" }]}
        >
          <Input placeholder="Eid Special Deals" />
        </Form.Item>

        <Form.Item
          name="products"
          label="Products"
          rules={[
            { required: true, message: "Select at least one product" },
            { type: "array", min: 1, message: "Select at least one product" },
          ]}
        >
          <Select
            mode="multiple"
            allowClear
            showSearch
            loading={loadingProducts}
            placeholder="Select products"
            optionFilterProp="label"
            options={products.map((p) => ({
              value: p._id,
              label: p.title,
            }))}
            optionRender={(option) => {
              const p = products.find((x) => x._id === option.value);
              return (
                <div className="flex items-center gap-2 py-1">
                  {p?.banner && (
                    <Image
                      src={p.banner}
                      width={28}
                      height={28}
                      alt={p.title}
                      preview={false}
                      className="rounded object-cover"
                    />
                  )}
                  <span className="truncate text-sm">{option.label}</span>
                </div>
              );
            }}
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          loading={creating || updating}
        >
          {isEdit ? "Update Campaign" : "Create Campaign"}
        </Button>
      </Form>
    </Modal>
  );
}
