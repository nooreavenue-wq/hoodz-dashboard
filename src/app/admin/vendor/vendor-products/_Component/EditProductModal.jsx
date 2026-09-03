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
  message,
  Divider,
  Spin,
} from "antd";
import { Plus, Trash2, Upload as UploadIcon } from "lucide-react";
import {
  useUpdateProductMutation,
  useGetSingleProductQuery,
} from "@/redux/api/productApi";
import { useGetCategoriesQuery } from "@/redux/api/categoriesApi";
import useFileUpload from "@/hooks/useFileUpload";
import JoditEditor from "jodit-react";

// const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
// import "react-quill-new/dist/quill.snow.css";

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

export default function EditProductModal({ open, setOpen, productId }) {
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
    useGetSingleProductQuery(productId, {
      skip: !productId || !open,
    });

  const [updateProduct, { isLoading }] = useUpdateProductMutation();
  const { uploadFiles, uploadSingle, uploading } = useFileUpload();

  useEffect(() => {
    if (!open || !singleRes?.data) return;

    const p = singleRes.data.product;
    const cat = singleRes.data.category;
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
      variants: (p.variants || []).map((v) => ({
        size: v.size,
        colorName: v.color?.name,
        colorCode: v.color?.code || "#000000",
        quantity: v.quantity,
      })),
      metaTitle: p.seo?.metaTitle,
      metaDescription: p.seo?.metaDescription,
      metaKeywords: p.seo?.metaKeywords || [],
    });
    setDescription(p.description || "");
    setBannerPreview(p.banner);
    setImagesPreview(p.images || []);
    setBannerList([]);
    setImagesList([]);
  }, [open, singleRes, form]);

  const handleCancel = () => {
    form.resetFields();
    setBannerList([]);
    setImagesList([]);
    setOpen(false);
  };

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
          ...imageUrls.filter(
            (u) => typeof u === "string" && !u.startsWith("blob:"),
          ),
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

      const res = await updateProduct({ id: productId, payload }).unwrap();
      message.success(res?.message || "Product updated");
      handleCancel();
    } catch (e) {
      message.error(e?.data?.message || "Failed to update product");
    }
  };

  return (
    <Modal
      title="Edit Product"
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={1020}
      centered
      destroyOnClose
      styles={{ body: { maxHeight: "78vh", overflowY: "auto" } }}
    >
      {loadingProduct ? (
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
          {/* Same fields as Create — title, category, sku, etc. */}
          <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
              <Input size="large" />
            </Form.Item>
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true }]}
            >
              <Select
                size="large"
                options={categories}
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

          <Form.Item label="Description" required>
            <div className="overflow-hidden rounded-lg border">
              <JoditEditor
                value={description}
                onChange={(value) => setDescription(value)}
                placeholder="Product description"
                height={500}
              />
            </div>
          </Form.Item>

          <Form.Item label="Banner Image" required>
            <div className="flex items-center gap-4">
              {bannerPreview && (
                <Image
                  alt="banner"
                  src={bannerPreview}
                  width={100}
                  height={100}
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
                <Button icon={<UploadIcon size={16} />}>Change Banner</Button>
              </Upload>
            </div>
          </Form.Item>

          <Form.Item label="Gallery Images">
            <div className="mb-2 flex flex-wrap gap-2">
              {imagesPreview.map((url, i) => (
                <div key={i} className="relative">
                  <Image
                    alt="gallery"
                    src={url}
                    width={72}
                    height={72}
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
              listType="picture-card"
              onChange={({ fileList }) => setImagesList(fileList)}
            >
              + Add
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

          {inventoryType === "single" && (
            <Form.Item
              name="stock"
              label="Stock Quantity"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} size="large" className="!w-full max-w-xs" />
            </Form.Item>
          )}

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
                          <Select options={sizeOptions} className="!w-24" />
                        </Form.Item>
                      )}
                      <Form.Item
                        {...field}
                        name={[field.name, "colorName"]}
                        label="Color"
                        rules={[{ required: true }]}
                        className="mb-0"
                      >
                        <Input className="!w-28" />
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
                    block
                    icon={<Plus size={16} />}
                    onClick={() =>
                      add({
                        size: "M",
                        colorName: "Black",
                        colorCode: "#000000",
                        quantity: 1,
                      })
                    }
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
            <Select mode="tags" size="large" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            className="mt-4"
            loading={uploading || isLoading}
          >
            Update Product
          </Button>
        </Form>
      )}
    </Modal>
  );
}
