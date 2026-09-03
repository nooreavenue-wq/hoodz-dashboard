"use client";

import { Image } from "antd";

export default function PosProductGrid({ products, onSelect }) {
  return (
    <div className="flex-1 overflow-y-auto pr-1">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-8">
        {products.map((p) => (
          <button
            key={p._id}
            onClick={() => onSelect(p)}
            className="rounded-2xl border border-slate-100 bg-white p-3 text-left shadow-sm transition hover:border-[#F75908]/40 hover:shadow-md"
          >
            <div className="relative mb-2 aspect-square overflow-hidden rounded-xl bg-slate-50">
              <Image
                src={p.banner}
                alt={p.title}
                className="!h-full !w-full object-cover"
                preview={false}
              />
              {p.collectionType && (
                <span className="absolute right-2 top-2 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold capitalize text-white">
                  {p.collectionType}
                </span>
              )}
            </div>
            <p className="truncate text-sm font-semibold text-slate-800">
              {p.title}
            </p>
            <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
              <span>Stock: {p.stock ?? 0}</span>
              <span className="capitalize">
                {p.inventoryType?.replace("_", " ")}
              </span>
            </div>
            <p className="mt-1 text-base font-bold text-slate-900">
              ${p.discountPrice ?? p.price}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
