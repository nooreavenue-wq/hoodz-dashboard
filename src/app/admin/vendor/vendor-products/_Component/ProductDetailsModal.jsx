"use client";

import { Modal, Spin, Tag, Image, Descriptions, Empty } from "antd";
import { useGetSingleProductQuery } from "@/redux/api/productApi";

export default function ProductDetailsModal({ open, setOpen, productId }) {
  const { data, isLoading } = useGetSingleProductQuery(productId, {
    skip: !productId || !open,
  });

  const p = data?.data?.product;
  const category = data?.data?.category;
  const vendor = data?.data?.vendor;

  return (
    <Modal
      title="Product Details"
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      width={720}
      centered
      destroyOnClose
      styles={{ body: { maxHeight: "75vh", overflowY: "auto" } }}
    >
      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Spin size="large" />
        </div>
      ) : !p ? (
        <Empty />
      ) : (
        <div className="space-y-4">
          <div className="flex gap-4">
            <Image
              src={p.banner}
              alt={p.title}
              width={140}
              height={140}
              className="rounded-lg object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold">{p.title}</h3>
              <p className="text-sm text-slate-500">
                {category?.title} · {p.brand} ({p.brandType})
              </p>
              <div className="mt-2 flex gap-2">
                <Tag>{p.inventoryType}</Tag>
                <Tag color="blue">{p.collectionType}</Tag>
                <Tag color="green">${p.discountPrice}</Tag>
              </div>
              <p className="mt-1 text-sm">SKU: {p.sku}</p>
              <p className="text-sm">Stock: {p.stock ?? "—"}</p>
            </div>
          </div>

          {p.images?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {p.images.map((img, i) => (
                <Image
                  key={i}
                  src={img}
                  width={64}
                  alt={p.title}
                  height={64}
                  className="rounded object-cover"
                />
              ))}
            </div>
          )}

          <Descriptions bordered size="small" column={2}>
            <Descriptions.Item label="Price">${p.price}</Descriptions.Item>
            <Descriptions.Item label="Discount">
              {p.discount}%
            </Descriptions.Item>
            <Descriptions.Item label="Vendor">
              {vendor?.name || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Rating">
              {p.avgRating} ({p.ratingCount})
            </Descriptions.Item>
          </Descriptions>

          {p.variants?.length > 0 && (
            <div>
              <h4 className="mb-2 font-medium">Variants</h4>
              <div className="space-y-1">
                {p.variants.map((v, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded border px-3 py-2 text-sm"
                  >
                    {v.size && <Tag>{v.size}</Tag>}
                    {v.color && (
                      <span className="flex items-center gap-1">
                        <span
                          className="inline-block h-3 w-3 rounded-full border"
                          style={{ background: v.color.code }}
                        />
                        {v.color.name}
                      </span>
                    )}
                    <span className="ml-auto">Qty: {v.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="mb-2 font-medium">Description</h4>
            <div
              className="prose prose-sm max-w-none rounded-lg bg-slate-50 p-3"
              dangerouslySetInnerHTML={{ __html: p.description || "" }}
            />
          </div>
        </div>
      )}
    </Modal>
  );
}
