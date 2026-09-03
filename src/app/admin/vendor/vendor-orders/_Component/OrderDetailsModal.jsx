"use client";

import { useGetSingleOrderDetailsQuery } from "@/redux/api/orderApi";
import {
  Modal,
  Spin,
  Tag,
  Descriptions,
  Avatar,
  Image,
  Divider,
  Steps,
  Empty,
} from "antd";
import dayjs from "dayjs";
import { useMemo } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Polyline,
} from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const statusColors = {
  pending: "orange",
  confirmed: "blue",
  processing: "cyan",
  rider_assigned: "purple",
  picked_up: "geekblue",
  on_the_way: "gold",
  delivered: "green",
  cancelled: "red",
};

const formatStatus = (s) =>
  s?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "N/A";

const formatDate = (d) => (d ? dayjs(d).format("DD MMM YYYY, hh:mm A") : "—");

// Delivery job steps (as you specified)
const DELIVERY_STEPS = [
  { key: "assigned", title: "Assigned / Accepted" },
  { key: "picked_up", title: "Picked Up" },
  { key: "on_the_way", title: "On The Way" },
  { key: "otp_sent", title: "OTP Sent" },
  { key: "delivered", title: "Delivered" },
];

function getDeliveryCurrentStep(order) {
  const status = order?.status;
  if (status === "delivered") return 4;
  if (status === "on_the_way") return 2;
  if (status === "picked_up") return 1;
  if (["rider_assigned", "processing", "confirmed"].includes(status)) return 0;
  if (order?.isOtpVerified) return 3;
  return 0;
}

// Order timeline steps
const ORDER_TIMELINE = [
  { key: "createdAt", title: "Order Placed", field: "createdAt" },
  { key: "confirmedAt", title: "Confirmed", field: "confirmedAt" },
  { key: "processedAt", title: "Processing", field: "processedAt" },
  { key: "riderAssignedAt", title: "Rider Assigned", field: "riderAssignedAt" },
  { key: "pickedUpAt", title: "Picked Up", field: "pickedUpAt" },
  { key: "onTheWayAt", title: "On The Way", field: "onTheWayAt" },
  { key: "deliveredAt", title: "Delivered", field: "deliveredAt" },
];

function MapSection({ pickup, destination }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY || "",
  });

  const pickupPos = useMemo(() => {
    if (!pickup?.coordinates?.length) return null;
    return { lat: pickup.coordinates[1], lng: pickup.coordinates[0] };
  }, [pickup]);

  const destPos = useMemo(() => {
    if (!destination?.coordinates?.length) return null;
    return {
      lat: destination.coordinates[1],
      lng: destination.coordinates[0],
    };
  }, [destination]);

  const center = pickupPos || destPos || { lat: 23.78, lng: 90.4 };

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex h-[280px] items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-500">
        Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-[280px] items-center justify-center rounded-xl bg-slate-50">
        <Spin />
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "280px", borderRadius: 12 }}
      center={center}
      zoom={12}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
      }}
    >
      {pickupPos && (
        <Marker
          position={pickupPos}
          label={{ text: "P", color: "white", fontWeight: "bold" }}
          title={`Pickup: ${pickup?.address || ""}`}
        />
      )}
      {destPos && (
        <Marker
          position={destPos}
          label={{ text: "D", color: "white", fontWeight: "bold" }}
          title={`Destination: ${destination?.address || ""}`}
        />
      )}
      {pickupPos && destPos && (
        <Polyline
          path={[pickupPos, destPos]}
          options={{
            strokeColor: "#1B70A6",
            strokeOpacity: 0.8,
            strokeWeight: 3,
          }}
        />
      )}
    </GoogleMap>
  );
}

export default function OrderDetailsModal({ open, setOpen, orderId }) {
  const { data, isLoading, isFetching } = useGetSingleOrderDetailsQuery(
    orderId,
    { skip: !orderId || !open },
  );

  const order = data?.data;

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold">Order Details</span>
          {order?.id && (
            <Tag color="blue" className="!m-0">
              {order.id}
            </Tag>
          )}
        </div>
      }
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      centered
      width={1200}
      destroyOnClose
      styles={{
        body: { maxHeight: "78vh", overflowY: "auto", paddingTop: 12 },
      }}
    >
      {isLoading || isFetching ? (
        <div className="flex h-72 items-center justify-center">
          <Spin size="large" />
        </div>
      ) : !order ? (
        <Empty description="Order not found" />
      ) : (
        <div className="space-y-6">
          {/* ========== TOP STATUS + AMOUNTS ========== */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4">
            <div className="flex flex-wrap gap-2">
              <Tag
                color={statusColors[order.status] || "default"}
                className="!text-sm"
              >
                {formatStatus(order.status)}
              </Tag>
              <Tag color={order.paymentStatus === "paid" ? "green" : "orange"}>
                Payment: {order.paymentStatus?.toUpperCase()}
              </Tag>
              <Tag>{order.deliveryType || "regular"}</Tag>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-800">
                ${order.totalAmount}
              </p>
              <p className="text-xs text-slate-500">
                Items ${order.amount} + Delivery ${order.deliveryCharge}
              </p>
            </div>
          </div>

          {/* ========== CUSTOMER & VENDOR ========== */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Customer */}
            <div className="rounded-xl border p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Customer
              </p>
              <div className="flex items-center gap-3">
                <Avatar size={48} src={order.user?.profileAvatar}>
                  {order.user?.name?.[0]}
                </Avatar>
                <div>
                  <p className="font-semibold">{order.user?.name || "N/A"}</p>
                  <p className="text-sm text-slate-500">{order.user?.email}</p>
                  <p className="text-sm text-slate-500">
                    {order.user?.phone || "No phone"}
                  </p>
                </div>
              </div>
            </div>

            {/* Vendor / Author */}
            <div className="rounded-xl border p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Vendor
              </p>
              <div className="flex items-center gap-3">
                <Avatar size={48} src={order.author?.profileAvatar}>
                  {order.author?.name?.[0]}
                </Avatar>
                <div>
                  <p className="font-semibold">{order.author?.name || "N/A"}</p>
                  <p className="text-sm text-slate-500">
                    {order.author?.email}
                  </p>
                  <p className="text-sm text-slate-500">
                    {order.author?.phone || "No phone"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ========== ITEMS ========== */}
          <div>
            <h3 className="mb-3 text-base font-semibold">Order Items</h3>
            <div className="space-y-3">
              {order.items?.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 rounded-xl border p-3"
                >
                  <Image
                    src={item.product?.banner}
                    alt={item.product?.title}
                    width={72}
                    height={72}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.product?.title}</p>
                    <div className="mt-1 flex flex-wrap gap-3 text-sm text-slate-500">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && (
                        <span className="flex items-center gap-1">
                          Color:
                          <span
                            className="inline-block h-3 w-3 rounded-full border"
                            style={{ backgroundColor: item.color.code }}
                          />
                          {item.color.name}
                        </span>
                      )}
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${item.totalPrice}</p>
                    {item.product?.discountPrice < item.product?.price && (
                      <p className="text-xs text-slate-400 line-through">
                        ${item.product.price}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ========== BILLING ========== */}
          {order.billingDetails && (
            <div>
              <h3 className="mb-3 text-base font-semibold">
                Billing / Delivery Address
              </h3>
              <Descriptions bordered size="small" column={2}>
                <Descriptions.Item label="Name">
                  {order.billingDetails.name}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  {order.billingDetails.phoneNumber}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {order.billingDetails.email}
                </Descriptions.Item>
                <Descriptions.Item label="City">
                  {order.billingDetails.city}, {order.billingDetails.country}
                </Descriptions.Item>
                <Descriptions.Item label="Address" span={2}>
                  {order.billingDetails.address}
                </Descriptions.Item>
                <Descriptions.Item label="Building">
                  {order.billingDetails.buildingNo || "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Floor / Apt">
                  {order.billingDetails.floorNo || "—"} /{" "}
                  {order.billingDetails.apartment || "—"}
                </Descriptions.Item>
                {order.billingDetails.note && (
                  <Descriptions.Item label="Note" span={2}>
                    {order.billingDetails.note}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </div>
          )}

          {/* ========== PAYMENT & META ========== */}
          <div>
            <h3 className="mb-3 text-base font-semibold">Payment & Meta</h3>
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="Transaction ID">
                {order.transactionId || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Status">
                <Tag
                  color={order.paymentStatus === "paid" ? "green" : "orange"}
                >
                  {order.paymentStatus}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Subtotal">
                ${order.amount}
              </Descriptions.Item>
              <Descriptions.Item label="Delivery Charge">
                ${order.deliveryCharge}
              </Descriptions.Item>
              <Descriptions.Item label="Coin Discount">
                ${order.coinDiscount || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Voucher Discount">
                ${order.voucherDiscount || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Total">
                ${order.totalAmount}
              </Descriptions.Item>
              <Descriptions.Item label="OTP Verified">
                {order.isOtpVerified ? (
                  <Tag color="green">Yes</Tag>
                ) : (
                  <Tag>No</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {formatDate(order.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Updated">
                {formatDate(order.updatedAt)}
              </Descriptions.Item>
            </Descriptions>
          </div>

          {/* ========== RIDER ========== */}
          {order.rider && (
            <div>
              <h3 className="mb-3 text-base font-semibold">Rider</h3>
              <div className="flex items-center gap-4 rounded-xl border p-4">
                <Avatar size={52} src={order.rider.profileAvatar}>
                  {order.rider.name?.[0]}
                </Avatar>
                <div>
                  <p className="font-semibold">{order.rider.name}</p>
                  <p className="text-sm text-slate-500">
                    {order.rider.phone || "No phone"} · Vehicle:{" "}
                    {order.rider.vehicle || "—"}
                  </p>
                  <p className="text-sm text-slate-500">
                    Rating: {order.rider.avgRating ?? 0} (
                    {order.rider.ratingCount ?? 0} reviews)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========== MAP + LOCATIONS ========== */}
          {order.deliveryJob && (
            <div>
              <h3 className="mb-3 text-base font-semibold">
                Delivery Route
                {order.deliveryJob.distance != null && (
                  <span className="ml-2 text-sm font-normal text-slate-500">
                    ({order.deliveryJob.distance} km)
                  </span>
                )}
              </h3>

              <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
                  <p className="text-xs font-semibold uppercase text-blue-600">
                    Pickup
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {order.deliveryJob.pickup?.address || "—"}
                  </p>
                </div>
                <div className="rounded-lg border border-green-100 bg-green-50 p-3">
                  <p className="text-xs font-semibold uppercase text-green-600">
                    Destination
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {order.deliveryJob.destination?.address ||
                      order.billingDetails?.address ||
                      "—"}
                  </p>
                </div>
              </div>

              <MapSection
                pickup={order.deliveryJob.pickup}
                destination={order.deliveryJob.destination}
              />
            </div>
          )}

          {/* ========== DELIVERY STEPPER ========== */}
          <div>
            <h3 className="mb-4 text-base font-semibold">Delivery Progress</h3>
            <Steps
              current={getDeliveryCurrentStep(order)}
              size="small"
              items={DELIVERY_STEPS.map((s) => ({ title: s.title }))}
            />
          </div>

          <Divider className="!my-2" />

          {/* ========== ORDER TIMELINE ========== */}
          <div>
            <h3 className="mb-4 text-base font-semibold">Order Timeline</h3>
            <Steps
              direction="vertical"
              size="small"
              current={
                order.status === "cancelled"
                  ? -1
                  : ORDER_TIMELINE.filter((t) => order[t.field]).length - 1
              }
              items={ORDER_TIMELINE.map((t) => ({
                title: t.title,
                description: formatDate(order[t.field]),
                status: order[t.field]
                  ? "finish"
                  : order.status === "cancelled"
                    ? "error"
                    : "wait",
              }))}
            />
            {order.cancelledAt && (
              <p className="mt-2 text-sm text-red-500">
                Cancelled at: {formatDate(order.cancelledAt)}
              </p>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
