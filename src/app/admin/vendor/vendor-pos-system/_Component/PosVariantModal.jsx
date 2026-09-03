"use client";

import { useMemo, useState, useEffect } from "react";
import { Modal, Image, Tag, Button } from "antd";
import toast from "react-hot-toast";

export default function PosVariantModal({ open, product, onCancel, onAdd }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [qty, setQty] = useState(1);

  const variants = product?.variants || [];
  const type = product?.inventoryType;

  // Unique sizes (size_color only)
  const sizes = useMemo(() => {
    const set = new Set();
    variants.forEach((v) => {
      if (v.size) set.add(v.size);
    });
    return [...set];
  }, [variants]);

  // Colors filtered by selected size (if size_color)
  const colors = useMemo(() => {
    let list = variants;
    if (type === "size_color" && selectedSize) {
      list = variants.filter((v) => v.size === selectedSize);
    }
    const map = new Map();
    list.forEach((v) => {
      if (v.color?.code && !map.has(v.color.code)) {
        map.set(v.color.code, {
          code: v.color.code,
          name: v.color.name,
          quantity: v.quantity,
        });
      }
    });
    return [...map.values()];
  }, [variants, type, selectedSize]);

  // Available qty for current selection
  const availableQty = useMemo(() => {
    if (type === "color_only" && selectedColor) {
      const v = variants.find((x) => x.color?.code === selectedColor.code);
      return v?.quantity ?? 0;
    }
    if (type === "size_color" && selectedSize && selectedColor) {
      const v = variants.find(
        (x) => x.size === selectedSize && x.color?.code === selectedColor.code,
      );
      return v?.quantity ?? 0;
    }
    return 0;
  }, [type, variants, selectedSize, selectedColor]);

  useEffect(() => {
    if (!open) return;
    setSelectedSize(null);
    setSelectedColor(null);
    setQty(1);
  }, [open, product?._id]);

  // When size changes, reset color if invalid
  useEffect(() => {
    if (selectedColor && !colors.find((c) => c.code === selectedColor.code)) {
      setSelectedColor(null);
    }
  }, [selectedSize]); // eslint-disable-line

  const handleAdd = () => {
    if (type === "size_color") {
      if (!selectedSize || !selectedColor) {
        toast.error("Select size and color");
        return;
      }
    }
    if (type === "color_only" && !selectedColor) {
      toast.error("Select color");
      return;
    }
    if (availableQty <= 0) {
      toast.error("This variant is out of stock");
      return;
    }
    if (qty > availableQty) {
      toast.error(`Only ${availableQty} available`);
      return;
    }

    onAdd({
      product,
      size: type === "size_color" ? selectedSize : null,
      color: selectedColor,
      quantity: qty,
      unitPrice: product.discountPrice ?? product.price,
      maxQty: availableQty,
    });
  };

  if (!product) return null;

  return (
    <Modal
      title={product.title}
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      width={420}
      destroyOnClose
    >
      <div className="space-y-4">
        <div className="flex gap-3">
          <Image
            alt={product.title}
            src={product.banner}
            width={80}
            height={80}
            className="rounded-lg object-cover"
          />
          <div>
            <p className="font-semibold">{product.title}</p>
            <p className="text-lg font-bold text-[#F75908]">
              ${product.discountPrice ?? product.price}
            </p>
            <Tag className="mt-1 capitalize">{type?.replace("_", " ")}</Tag>
          </div>
        </div>

        {/* Sizes */}
        {type === "size_color" && sizes.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-medium">Select Size</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => {
                const hasStock = variants.some(
                  (v) => v.size === s && (v.quantity || 0) > 0,
                );
                return (
                  <button
                    key={s}
                    disabled={!hasStock}
                    onClick={() => setSelectedSize(s)}
                    className={`h-10 min-w-[40px] rounded-full px-2 text-sm font-semibold transition ${
                      selectedSize === s
                        ? "bg-[#F75908] text-white"
                        : hasStock
                          ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          : "cursor-not-allowed bg-slate-50 text-slate-300 line-through"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Colors */}
        {(type === "color_only" || type === "size_color") && (
          <div>
            <p className="mb-2 text-sm font-medium">Select Color</p>
            {type === "size_color" && !selectedSize ? (
              <p className="text-xs text-slate-400">Select a size first</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {colors.map((c) => {
                  const disabled = (c.quantity || 0) <= 0;
                  return (
                    <button
                      key={c.code}
                      disabled={disabled}
                      title={`${c.name} (${c.quantity})`}
                      onClick={() => setSelectedColor(c)}
                      className={`relative h-9 w-9 rounded-full border-2 transition ${
                        selectedColor?.code === c.code
                          ? "scale-110 border-[#F75908]"
                          : "border-slate-200"
                      } ${disabled ? "opacity-30" : ""}`}
                      style={{ backgroundColor: c.code }}
                    />
                  );
                })}
              </div>
            )}
            {selectedColor && (
              <p className="mt-1 text-xs text-slate-500">
                {selectedColor.name} · Available: {availableQty}
              </p>
            )}
          </div>
        )}

        {/* Qty */}
        <div>
          <p className="mb-2 text-sm font-medium">Quantity</p>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1}
            >
              −
            </Button>
            <span className="w-8 text-center text-lg font-semibold">{qty}</span>
            <Button
              onClick={() => setQty((q) => Math.min(availableQty || 1, q + 1))}
              disabled={qty >= availableQty}
            >
              +
            </Button>
          </div>
        </div>

        <Button
          type="primary"
          size="large"
          block
          className="!bg-[#F75908] hover:!bg-[#e04e00]"
          onClick={handleAdd}
        >
          Add to Cart
        </Button>
      </div>
    </Modal>
  );
}
