"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Upload,
  Image,
  Space,
  message,
  Spin,
  Divider,
} from "antd";
import { Plus, Trash2, Upload as UploadIcon } from "lucide-react";
import dynamic from "next/dynamic";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetSingleProductQuery,
} from "@/redux/api/productApi";
import { useGetCategoriesQuery } from "@/redux/api/categoriesApi";
import useFileUpload from "@/hooks/useFileUpload";

// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
// import "react-quill/dist/quill.snow.css";

const collectionOptions = [
  { label: "Men", value: "men" },
  { label: "Women", value: "women" },
  { label: "Unisex", value: "unisex" },
  { label: "Kids", value: "kids" },
  { label: "Baby", value: "baby" },
  { label: "All", value: "all" },
];

const brandTypeOptions = [
  { label: "New", value: "new" },
  { label: "Local", value: "local" },
  { label: "International", value: "international" },
  { label: "Trending", value: "trending" },
];

const inventoryOptions = [
  { label: "Single (no variants)", value: "single" },
  { label: "Color Only", value: "color_only" },
  { label: "Size + Color", value: "size_color" },
];

const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"].map((s) => ({
  label: s,
  value: s,
}));

function genSku() {
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  const n = Math.floor(Math.random() * 1e6)
    .toString(16)
    .toUpperCase()
    .padStart(6, "0");
  return `HDZ-${r}-${n}`;
}

export default function ProductFormModal({ open, setOpen, productId }) {
  const isEdit = !!productId;
  const [form] = Form.useForm();
  const inventoryType = Form.useWatch("inventoryType", form);

  const [bannerList, setBannerList] = useState([]);
  const [imagesList, setImagesList] = useState([]);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [description, setDescription] = useState("");

  const { data: catRes } = useGetCategoriesQuery({
    page: 1,
    limit: 50,
    searchText: "",
  });
  const categories = (catRes?.data || []).map((c) => ({
    label: c.title,
    value: c._id,
  }));

  const { data: singleRes, isLoading: loadingProduct } =
    useGetSingleProductQuery(productId, { skip: !productId || !open });

  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
  const { uploadFiles, uploadSingle, uploading } = useFileUpload();

  // Prefill on edit
  useEffect(() => {
    if (!open) return;
    if (!isEdit) {
      form.resetFields();
      form.setFieldsValue({
        inventoryType: "single",
        collectionType: "all",
        brandType: "local",
        sku: genSku(),
        discount: 0,
        variants: [],
      });
      setDescription("");
      setBannerList([]);
      setImagesList([]);
      setBannerPreview(null);
      setImagesPreview([]);
      return;
    }

    const p = singleRes?.data?.product;
    const cat = singleRes?.data?.category;
    if (!p) return;

    form.setFieldsValue({
      category: cat?._id,
      sku: p.sku,
      collectionType: p.collectionType,
      brand: p.brand,
      brandType: p.brandType,
      title: p.title,
      price: p.price,
      discount: p.discount,
      inventoryType: p.inventoryType,
      stock: p.stock,
      variants: p.variants || [],
      metaTitle: p.seo?.metaTitle,
      metaDescription: p.seo?.metaDescription,
      metaKeywords: p.seo?.metaKeywords || [],
    });
    setDescription(p.description || "");
    setBannerPreview(p.banner);
    setImagesPreview(p.images || []);
    setBannerList([]);
    setImagesList([]);
  }, [open, isEdit, singleRes, form]);

  const handleSubmit = async (values) => {
    try {
      let bannerUrl = bannerPreview;
      let imageUrls = [...imagesPreview];

      if (bannerList.length) {
        bannerUrl = await uploadSingle(bannerList[0]);
      }
      if (imagesList.length) {
        const uploaded = await uploadFiles(imagesList);
        imageUrls = [
          ...imageUrls.filter((u) => !u.startsWith("blob:")),
          ...uploaded,
        ];
      }

      if (!bannerUrl) {
        message.warning("Banner image is required");
        return;
      }

      const payload = {
        category: values.category,
        sku: values.sku,
        collectionType: values.collectionType,
        brand: values.brand,
        brandType: values.brandType,
        title: values.title,
        description: description || "",
        banner: bannerUrl,
        images: imageUrls.length ? imageUrls : [bannerUrl],
        price: Number(values.price),
        discount: Number(values.discount) || 0,
        inventoryType: values.inventoryType,
        seo: {
          metaTitle: values.metaTitle || values.title,
          metaDescription: values.metaDescription || "",
          metaKeywords: values.metaKeywords || [],
          ratingValue: 0,
        },
      };

      if (values.inventoryType === "single") {
        payload.stock = Number(values.stock) || 0;
      } else {
        payload.variants = (values.variants || []).map((v) => {
          const item = { quantity: Number(v.quantity) || 0 };
          if (values.inventoryType === "size_color") item.size = v.size;
          item.color = {
            code: v.colorCode || "#000000",
            name: v.colorName || "Default",
          };
          return item;
        });
      }

      if (isEdit) {
        const res = await updateProduct({
          id: productId,
          payload,
        }).unwrap();
        message.success(res?.message || "Product updated");
      } else {
        const res = await createProduct(payload).unwrap();
        message.success(res?.message || "Product created");
      }
      setOpen(false);
    } catch (e) {
      message.error(e?.data?.message || "Failed to save product");
    }
  };

  return (
    <Modal
      title={isEdit ? "Edit Product" : "Add Product"}
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      width={820}
      centered
      destroyOnClose
      styles={{ body: { maxHeight: "78vh", overflowY: "auto" } }}
    >
      {isEdit && loadingProduct ? (
        <div className="flex h-48 items-center justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-2"
        >
          {/* Basic */}
          <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
              <Input size="large" placeholder="Product title" />
            </Form.Item>
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true }]}
            >
              <Select
                size="large"
                options={categories}
                placeholder="Select category"
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>
            <Form.Item name="sku" label="SKU" rules={[{ required: true }]}>
              <Input size="large" />
            </Form.Item>
            <Form.Item
              name="collectionType"
              label="Collection"
              rules={[{ required: true }]}
            >
              <Select size="large" options={collectionOptions} />
            </Form.Item>
            <Form.Item name="brand" label="Brand" rules={[{ required: true }]}>
              <Input size="large" />
            </Form.Item>
            <Form.Item
              name="brandType"
              label="Brand Type"
              rules={[{ required: true }]}
            >
              <Select size="large" options={brandTypeOptions} />
            </Form.Item>
            <Form.Item name="price" label="Price" rules={[{ required: true }]}>
              <InputNumber min={0} size="large" className="!w-full" />
            </Form.Item>
            <Form.Item name="discount" label="Discount (%)">
              <InputNumber min={0} max={100} size="large" className="!w-full" />
            </Form.Item>
          </div>

          {/* Description */}
          <Form.Item label="Description" required>
            <div className="rounded-lg border">
              {/* <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
                style={{ minHeight: 160 }}
              /> */}
            </div>
          </Form.Item>

          {/* Banner */}
          <Form.Item label="Banner Image" required>
            <div className="flex items-center gap-4">
              {bannerPreview && (
                <Image
                  src={bannerPreview}
                  width={100}
                  height={100}
                  alt="banner"
                  className="rounded object-cover"
                />
              )}
              <Upload
                maxCount={1}
                fileList={bannerList}
                beforeUpload={() => false}
                accept="image/*"
                showUploadList={false}
                onChange={({ fileList }) => {
                  setBannerList(fileList);
                  if (fileList[0]?.originFileObj) {
                    setBannerPreview(
                      URL.createObjectURL(fileList[0].originFileObj),
                    );
                  }
                }}
              >
                <Button icon={<UploadIcon size={16} />}>
                  {bannerPreview ? "Change Banner" : "Upload Banner"}
                </Button>
              </Upload>
            </div>
          </Form.Item>

          {/* Gallery */}
          <Form.Item label="Gallery Images">
            <div className="mb-2 flex flex-wrap gap-2">
              {imagesPreview.map((url, i) => (
                <div key={i} className="relative">
                  <Image
                    src={url}
                    width={72}
                    height={72}
                    alt="gallery"
                    className="rounded object-cover"
                  />
                  <button
                    type="button"
                    className="absolute -right-1 -top-1 rounded-full bg-red-500 p-0.5 text-white"
                    onClick={() =>
                      setImagesPreview((prev) =>
                        prev.filter((_, idx) => idx !== i),
                      )
                    }
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
            <Upload
              multiple
              fileList={imagesList}
              beforeUpload={() => false}
              accept="image/*"
              showUploadList
              onChange={({ fileList }) => setImagesList(fileList)}
            >
              <Button icon={<UploadIcon size={16} />}>Add Images</Button>
            </Upload>
          </Form.Item>

          <Divider>Inventory</Divider>

          <Form.Item
            name="inventoryType"
            label="Inventory Type"
            rules={[{ required: true }]}
          >
            <Select size="large" options={inventoryOptions} />
          </Form.Item>

          {/* Single stock */}
          {inventoryType === "single" && (
            <Form.Item
              name="stock"
              label="Stock Quantity"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} size="large" className="!w-full max-w-xs" />
            </Form.Item>
          )}

          {/* Variants */}
          {(inventoryType === "color_only" ||
            inventoryType === "size_color") && (
            <Form.List name="variants">
              {(fields, { add, remove }) => (
                <div className="space-y-3">
                  {fields.map((field) => (
                    <div
                      key={field.key}
                      className="flex flex-wrap items-end gap-2 rounded-lg border bg-slate-50 p-3"
                    >
                      {inventoryType === "size_color" && (
                        <Form.Item
                          {...field}
                          name={[field.name, "size"]}
                          label="Size"
                          rules={[{ required: true }]}
                          className="mb-0"
                        >
                          <Select
                            options={sizeOptions}
                            className="!w-24"
                            placeholder="Size"
                          />
                        </Form.Item>
                      )}
                      <Form.Item
                        {...field}
                        name={[field.name, "colorName"]}
                        label="Color Name"
                        rules={[{ required: true }]}
                        className="mb-0"
                      >
                        <Input placeholder="Black" className="!w-28" />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, "colorCode"]}
                        label="Code"
                        rules={[{ required: true }]}
                        className="mb-0"
                      >
                        <Input type="color" className="!w-14 !p-1" />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, "quantity"]}
                        label="Qty"
                        rules={[{ required: true }]}
                        className="mb-0"
                      >
                        <InputNumber min={0} className="!w-20" />
                      </Form.Item>
                      <Button
                        danger
                        type="text"
                        icon={<Trash2 size={16} />}
                        onClick={() => remove(field.name)}
                      />
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() =>
                      add({
                        size: "M",
                        colorName: "Black",
                        colorCode: "#000000",
                        quantity: 1,
                      })
                    }
                    icon={<Plus size={16} />}
                    block
                  >
                    Add Variant
                  </Button>
                </div>
              )}
            </Form.List>
          )}

          <Divider>SEO</Divider>
          <Form.Item name="metaTitle" label="Meta Title">
            <Input size="large" />
          </Form.Item>
          <Form.Item name="metaDescription" label="Meta Description">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="metaKeywords" label="Meta Keywords">
            <Select
              mode="tags"
              placeholder="Type and press enter"
              size="large"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            className="mt-4"
            loading={uploading || creating || updating}
          >
            {isEdit ? "Update Product" : "Create Product"}
          </Button>
        </Form>
      )}
    </Modal>
  );
}
