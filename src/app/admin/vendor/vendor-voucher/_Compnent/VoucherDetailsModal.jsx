"use client";

import { Modal, Spin, Tag, Image, Descriptions, Empty } from "antd";
import { useGetSingleVoucherQuery } from "@/redux/api/voucherApi";
import dayjs from "dayjs";

export default function VoucherDetailsModal({ open, setOpen, voucherId }) {
  const { data, isLoading } = useGetSingleVoucherQuery(voucherId, {
    skip: !voucherId || !open,
  });
  const v = data?.data;

  return (
    <Modal
      title="Voucher Details"
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      centered
      width={600}
      destroyOnClose
    >
      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Spin size="large" />
        </div>
      ) : !v ? (
        <Empty />
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Tag color="blue" className="font-mono">
              {v.code}
            </Tag>
            <Tag
              color={v.status === "active" ? "green" : "default"}
              className="capitalize"
            >
              {v.status}
            </Tag>
            <Tag className="capitalize">{v.discountType}</Tag>
            <Tag className="capitalize">{v.voucherType}</Tag>
          </div>

          <Descriptions bordered size="small" column={2}>
            <Descriptions.Item label="Title" span={2}>
              {v.title}
            </Descriptions.Item>
            <Descriptions.Item label="Description" span={2}>
              {v.description || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Discount Value">
              {v.discountType === "percentage"
                ? `${v.discountValue}%`
                : v.discountType === "gift"
                  ? "Gift"
                  : `$${v.discountValue}`}
            </Descriptions.Item>
            <Descriptions.Item label="Min Spend">
              ${v.minSpend ?? 0}
            </Descriptions.Item>
            <Descriptions.Item label="Expiry">
              {v.expiryDate ? dayjs(v.expiryDate).format("DD MMM YYYY") : "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Used">
              {v.hasUsed ? "Yes" : "No"}
            </Descriptions.Item>
            {v.shop && (
              <Descriptions.Item label="Shop" span={2}>
                {v.shop.name} · {v.shop.email}
              </Descriptions.Item>
            )}
          </Descriptions>

          {v.discountType === "gift" && v.giftDetails && (
            <div>
              <h4 className="mb-2 font-semibold">Gift Details</h4>
              <p className="font-medium">{v.giftDetails.name}</p>
              <p className="text-sm text-slate-500">
                {v.giftDetails.description}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(v.giftDetails.bannerImage || []).map((img, i) => (
                  <Image
                    key={i}
                    src={img}
                    width={100}
                    alt="image"
                    height={80}
                    className="rounded object-cover"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
