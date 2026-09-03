"use client";

import { Image, Button } from "antd";
import { Trash2, X, Delete } from "lucide-react";

const KEYS = ["7", "8", "9", "4", "5", "6", "1", "2", "3", ".", "0", "C"];

export default function PosCartPanel({
  cart,
  activeCartIndex,
  setActiveCartIndex,
  removeCartItem,
  clearCart,
  subTotal,
  discountPercent,
  discountAmount,
  taxPercent,
  taxAmount,
  totalCost,
  keypadMode,
  keypadValue,
  onModeClick,
  onKeyPress,
  onEnter,
  onPayment,
  paying,
}) {
  return (
    <div className="flex w-[380px] shrink-0 flex-col rounded-2xl bg-white p-4 shadow-lg">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-semibold text-slate-700">
          Order ({cart.length} items)
        </p>
        <button
          onClick={clearCart}
          className="text-slate-400 hover:text-red-500"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="mb-3 max-h-[180px] space-y-2 overflow-y-auto">
        {cart.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">
            No items yet
          </p>
        ) : (
          cart.map((item, index) => (
            <div
              key={item.key}
              onClick={() => setActiveCartIndex(index)}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-2 transition ${
                activeCartIndex === index
                  ? "border-[#F75908] bg-orange-50"
                  : "border-slate-100 hover:bg-slate-50"
              }`}
            >
              <Image
                src={item.banner}
                alt={item.title}
                width={48}
                height={48}
                className="rounded-lg object-cover"
                preview={false}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.title}</p>
                <p className="text-xs text-slate-400">
                  {item.size && `Size: ${item.size} `}
                  {item.color && `· ${item.color.name} `}· Qty: {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  ${(item.unitPrice * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCartItem(index);
                  }}
                  className="text-slate-300 hover:text-red-500"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Totals — show % and calculated amount */}
      <div className="mb-3 space-y-1 border-t border-slate-100 pt-3 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">Sub-Total</span>
          <span className="font-medium">${subTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">
            Discount ({discountPercent || 0}%)
          </span>
          <span className="font-medium text-red-500">
            -${Number(discountAmount || 0).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Tax ({taxPercent || 0}%)</span>
          <span className="font-medium">
            ${Number(taxAmount || 0).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-base font-bold">
          <span>Total cost</span>
          <span className="text-[#F75908]">${totalCost.toFixed(2)}</span>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-4 gap-2">
        {["quantity", "tax", "discount", "coupon"].map((m) => (
          <button
            key={m}
            onClick={() => onModeClick(m)}
            className={`rounded-lg py-2 text-xs font-semibold capitalize transition ${
              keypadMode === m
                ? "bg-[#F75908] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {m}
            {(m === "tax" || m === "discount") && " %"}
          </button>
        ))}
      </div>

      <div className="mb-2 rounded-lg bg-slate-50 px-3 py-2 text-right font-mono text-lg">
        {keypadValue || "0"}
        <span className="ml-2 text-xs text-slate-400">
          ({keypadMode}
          {keypadMode === "tax" || keypadMode === "discount" ? " %" : ""})
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {KEYS.map((k) => (
          <button
            key={k}
            onClick={() => onKeyPress(k)}
            className="rounded-xl bg-slate-50 py-3 text-lg font-semibold text-slate-700 transition hover:bg-slate-100 active:scale-95"
          >
            {k}
          </button>
        ))}
      </div>

      {/* −  +  ⌫  Enter */}
      <div className="mt-2 grid grid-cols-4 gap-2">
        <button
          onClick={() => onKeyPress("-")}
          className="rounded-xl bg-slate-50 py-3 text-lg font-semibold hover:bg-slate-100"
        >
          −
        </button>
        <button
          onClick={() => onKeyPress("+")}
          className="rounded-xl bg-slate-50 py-3 text-lg font-semibold hover:bg-slate-100"
        >
          +
        </button>
        <button
          onClick={() => onKeyPress("⌫")}
          className="flex items-center justify-center rounded-xl bg-slate-50 py-3 hover:bg-red-50 hover:text-red-500"
          title="Backspace"
        >
          <Delete size={18} />
        </button>
        <button
          onClick={onEnter}
          className="rounded-xl bg-slate-200 py-3 text-sm font-semibold hover:bg-slate-300"
        >
          Enter
        </button>
      </div>

      <Button
        type="primary"
        size="large"
        loading={paying}
        onClick={onPayment}
        className="mt-3 !h-12 !rounded-xl !border-none !bg-[#F75908] text-base font-bold hover:!bg-[#e04e00]"
        block
      >
        Payment
      </Button>
    </div>
  );
}
