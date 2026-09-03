"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  InputNumber,
  Button,
  Avatar,
  Tag,
  Empty,
  Spin,
  Rate,
} from "antd";
import { MapPin, UserPlus, Search } from "lucide-react";
import toast from "react-hot-toast";
import { useSocket } from "@/context/SocketContextApi";

export default function FindRiderModal({ open, setOpen, order, onAssigned }) {
  const { socket } = useSocket();
  const [radiusKm, setRadiusKm] = useState(10);
  const [riders, setRiders] = useState([]);
  const [searching, setSearching] = useState(false);
  const [assigningId, setAssigningId] = useState(null);

  // reset when modal opens
  useEffect(() => {
    if (open) {
      setRiders([]);
      setRadiusKm(10);
      setSearching(false);
      setAssigningId(null);
    }
  }, [open, order?._id]);

  const handleFind = () => {
    if (!socket) {
      toast.error("Socket not connected");
      return;
    }
    if (!order?._id) {
      toast.error("Order not found");
      return;
    }

    setSearching(true);
    setRiders([]);

    socket.emit(
      "rider:find-online",
      {
        orderId: order._id,
        radiusKm: Number(radiusKm) || 10,
      },
      (ack) => {
        console.log("🚀 ~ handleFind ~ ack:", ack);
        setSearching(false);

        if (!ack) {
          toast.error("No response from server");
          return;
        }

        if (ack.success === false) {
          toast.error(ack.message || "Failed to find riders");
          return;
        }

        const list = ack.data || [];
        console.log("🚀 ~ handleFind ~ list:", list);
        setRiders(list);

        if (!list.length) {
          toast("No online riders in this radius", { icon: "ℹ️" });
        } else {
          toast.success(ack.message || `Found ${list.length} rider(s)`);
        }
      },
    );
  };

  const handleAssign = (riderId) => {
    if (!socket || !order?._id || !riderId) return;

    setAssigningId(riderId);

    socket.emit(
      "job:assign",
      {
        orderId: order._id,
        riderId,
      },
      (ack) => {
        setAssigningId(null);

        if (!ack) {
          toast.error("No response from server");
          return;
        }

        if (ack.success === false) {
          toast.error(ack.message || "Failed to assign rider");
          return;
        }

        toast.success(ack.message || "Rider assigned successfully");
        onAssigned?.();
      },
    );
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-[#1B70A6]" />
          <span>Find Nearby Rider</span>
        </div>
      }
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      centered
      width={560}
      destroyOnClose
    >
      {/* Order summary */}
      {order && (
        <div className="mb-4 rounded-xl bg-slate-50 p-3 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono font-semibold text-[#1B70A6]">
              {order.id}
            </span>
            <Tag className="capitalize">{order.status}</Tag>
          </div>
          <p className="mt-1 text-slate-600">
            Total:{" "}
            <span className="font-semibold">
              ${Number(order.totalAmount ?? 0).toFixed(2)}
            </span>
            {" · "}
            Items: {order.totalItem}
            {" · "}
            <span className="capitalize">{order.deliveryType}</span>
          </p>
        </div>
      )}

      {/* Radius + search */}
      <div className="mb-4 flex items-end gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-slate-600">
            Radius (km)
          </label>
          <InputNumber
            min={1}
            max={100}
            value={radiusKm}
            onChange={(v) => setRadiusKm(v || 1)}
            size="large"
            className="!w-full"
            addonAfter="km"
          />
        </div>
        <Button
          type="primary"
          size="large"
          icon={<Search size={16} />}
          loading={searching}
          onClick={handleFind}
          className="!h-10"
        >
          Search Riders
        </Button>
      </div>

      {/* Rider list */}
      <div className="max-h-[360px] overflow-y-auto">
        {searching ? (
          <div className="flex h-32 items-center justify-center">
            <Spin tip="Searching nearby riders..." />
          </div>
        ) : riders.length === 0 ? (
          <Empty
            description="Search to find online riders near this order"
            className="py-10"
          />
        ) : (
          <div className="space-y-2">
            {riders.map((rider) => (
              <div
                key={rider._id}
                className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-[#1B70A6]/30 hover:bg-slate-50"
              >
                <Avatar size={48} src={rider.profileAvatar}>
                  {rider.name?.[0]}
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800">{rider.name}</p>
                  <p className="truncate text-xs text-slate-400">
                    {rider.email || rider.phone || "—"}
                  </p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2">
                    <Rate
                      disabled
                      allowHalf
                      value={rider.avgRating || 0}
                      className="!text-[12px]"
                      style={{ fontSize: 12 }}
                    />
                    <span className="text-xs text-slate-400">
                      ({rider.ratingCount || 0})
                    </span>
                    <Tag color="cyan" className="!m-0">
                      {Number(rider.distance ?? 0).toFixed(2)} km
                    </Tag>
                  </div>
                </div>

                <Button
                  type="primary"
                  icon={<UserPlus size={14} />}
                  loading={assigningId === rider._id}
                  disabled={!!assigningId && assigningId !== rider._id}
                  onClick={() => handleAssign(rider._id)}
                >
                  Assign
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
