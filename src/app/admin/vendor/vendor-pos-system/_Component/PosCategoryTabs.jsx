"use client";

export default function PosCategoryTabs({
  categories,
  products,
  totalProducts,
  activeCategory,
  onChange,
}) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <button
        onClick={() => onChange("all")}
        className={`rounded-xl px-5 py-3 text-left transition ${
          activeCategory === "all"
            ? "bg-[#F75908] text-white shadow-md"
            : "bg-white text-slate-600 shadow-sm hover:bg-slate-50"
        }`}
      >
        <p className="text-xs font-medium opacity-80">ALL PRODUCTS</p>
        <p className="text-xl font-bold">{totalProducts}</p>
      </button>

      {categories.map((cat) => {
        const count = products.filter(
          (p) => p.category?._id === cat._id,
        ).length;
        return (
          <button
            key={cat._id}
            onClick={() => onChange(cat._id)}
            className={`rounded-xl px-5 py-3 text-left transition ${
              activeCategory === cat._id
                ? "bg-[#F75908] text-white shadow-md"
                : "bg-white text-slate-600 shadow-sm hover:bg-slate-50"
            }`}
          >
            <p className="max-w-[110px] truncate text-xs font-medium uppercase opacity-80">
              {cat.title}
            </p>
            <p className="text-xl font-bold">{count}</p>
          </button>
        );
      })}
    </div>
  );
}
