"use client";

import { useMemo, useState } from "react";
import { Input, Spin, Empty, Tabs } from "antd";
import { Search } from "lucide-react";
import { useGetProductsQuery } from "@/redux/api/productApi";
import { useGetCategoriesQuery } from "@/redux/api/categoriesApi";
import { useAddPosOrderMutation } from "@/redux/api/posApi";
import toast from "react-hot-toast";
import PosCategoryTabs from "./PosCategoryTabs";
import PosProductGrid from "./PosProductGrid";
import PosCartPanel from "./PosCartPanel";
import PosVariantModal from "./PosVariantModal";
import PosOrdersTab from "./PosOrdersTab";

export default function PosContainer() {
  const [mainTab, setMainTab] = useState("sell");

  const [searchText, setSearchText] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [variantOpen, setVariantOpen] = useState(false);

  const [keypadMode, setKeypadMode] = useState("quantity");
  const [keypadValue, setKeypadValue] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0); // %
  const [taxPercent, setTaxPercent] = useState(0); // %
  const [activeCartIndex, setActiveCartIndex] = useState(null);

  const { data: productRes, isLoading } = useGetProductsQuery({
    page: 1,
    limit: 100,
    searchText,
  });
  const { data: catRes } = useGetCategoriesQuery({
    page: 1,
    limit: 50,
    searchText: "",
  });
  const [addPosOrder, { isLoading: paying }] = useAddPosOrderMutation();

  const products = productRes?.data?.products || [];
  const categories = catRes?.data || [];
  const totalProducts = productRes?.meta?.total || products.length;

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((p) => p.category?._id === activeCategory);
  }, [products, activeCategory]);

  const subTotal = cart.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  // % based
  const discountAmount = (subTotal * (Number(discountPercent) || 0)) / 100;
  const taxable = Math.max(0, subTotal - discountAmount);
  const taxAmount = (taxable * (Number(taxPercent) || 0)) / 100;
  const totalCost = Math.max(0, taxable + taxAmount);

  const openProduct = (product) => {
    if (!product.inStock || (product.stock ?? 0) <= 0) {
      toast.error("Out of stock");
      return;
    }
    if (product.inventoryType === "single") {
      addToCart({
        product,
        size: null,
        color: null,
        quantity: 1,
        unitPrice: product.discountPrice ?? product.price,
        maxQty: product.stock,
      });
      return;
    }
    setSelectedProduct(product);
    setVariantOpen(true);
  };

  const addToCart = ({ product, size, color, quantity, unitPrice, maxQty }) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (c) =>
          c.productId === product._id &&
          c.size === size &&
          c.color?.code === (color?.code || null),
      );
      if (idx >= 0) {
        const next = [...prev];
        const newQty = Math.min(
          next[idx].quantity + quantity,
          next[idx].maxQty || 999,
        );
        next[idx] = { ...next[idx], quantity: newQty };
        return next;
      }
      return [
        ...prev,
        {
          key: `${product._id}-${size || ""}-${color?.code || ""}-${Date.now()}`,
          productId: product._id,
          title: product.title,
          banner: product.banner,
          size,
          color,
          quantity,
          unitPrice,
          maxQty: maxQty ?? 999,
        },
      ];
    });
    setVariantOpen(false);
    setSelectedProduct(null);
  };

  const removeCartItem = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
    if (activeCartIndex === index) setActiveCartIndex(null);
  };

  const clearCart = () => {
    setCart([]);
    setDiscountPercent(0);
    setTaxPercent(0);
    setKeypadValue("");
    setActiveCartIndex(null);
  };

  const applyKeypadValue = (direction = 0) => {
    const num = parseFloat(keypadValue);

    if (keypadMode === "quantity") {
      if (activeCartIndex == null) {
        toast.error("Select a cart item first");
        return;
      }
      setCart((prev) => {
        const next = [...prev];
        const item = next[activeCartIndex];
        let q = item.quantity;
        if (direction === 1) q += 1;
        else if (direction === -1) q = Math.max(1, q - 1);
        else if (!isNaN(num)) q = Math.floor(num);
        q = Math.max(1, Math.min(q, item.maxQty || 999));
        next[activeCartIndex] = { ...item, quantity: q };
        return next;
      });
    } else if (keypadMode === "tax" && !isNaN(num)) {
      setTaxPercent(Math.min(100, Math.max(0, num)));
    } else if (keypadMode === "discount" && !isNaN(num)) {
      setDiscountPercent(Math.min(100, Math.max(0, num)));
    }
    setKeypadValue("");
  };

  const onKeyPress = (key) => {
    if (key === "C") {
      setKeypadValue("");
      return;
    }
    // Backspace / remove last digit
    if (key === "⌫") {
      setKeypadValue((prev) => prev.slice(0, -1));
      return;
    }
    if (key === "+") {
      applyKeypadValue(1);
      return;
    }
    if (key === "-") {
      applyKeypadValue(-1);
      return;
    }
    setKeypadValue((prev) => {
      if (key === "." && prev.includes(".")) return prev;
      return prev + key;
    });
  };

  const onModeClick = (mode) => {
    if (keypadValue) applyKeypadValue(0);
    setKeypadMode(mode);
    setKeypadValue("");
  };

  const handlePayment = async () => {
    if (!cart.length) {
      toast.error("Cart is empty");
      return;
    }
    if (keypadValue) applyKeypadValue(0);

    // API body — discount & tax as % values (as you requested)
    const payload = {
      items: cart.map((item) => {
        const entry = {
          product: item.productId,
          quantity: item.quantity,
        };
        if (item.size || item.color) {
          entry.variant = {};
          if (item.size) entry.variant.size = item.size;
          if (item.color) {
            entry.variant.color = {
              code: item.color.code,
              name: item.color.name,
            };
          }
        }
        return entry;
      }),
      discount: Number(discountPercent) || 0,
      tax: Number(taxPercent) || 0,
    };

    try {
      const res = await addPosOrder(payload).unwrap();
      toast.success(res?.message || "Order placed successfully");
      clearCart();
    } catch (e) {
      toast.error(e?.data?.message || "Payment failed");
    }
  };

  const sellContent = (
    <div className="flex h-[calc(100vh-180px)] gap-4 overflow-hidden">
      <div className="flex min-w-0 flex-1 flex-col">
        <PosCategoryTabs
          categories={categories}
          products={products}
          totalProducts={totalProducts}
          activeCategory={activeCategory}
          onChange={setActiveCategory}
        />

        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">
            Choose Products
          </h3>
          <Input
            placeholder="Search product"
            prefix={<Search size={16} className="text-slate-400" />}
            className="h-10 max-w-xs !rounded-full"
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <Spin size="large" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <Empty description="No products" />
        ) : (
          <PosProductGrid products={filteredProducts} onSelect={openProduct} />
        )}
      </div>

      <PosCartPanel
        cart={cart}
        activeCartIndex={activeCartIndex}
        setActiveCartIndex={setActiveCartIndex}
        removeCartItem={removeCartItem}
        clearCart={clearCart}
        subTotal={subTotal}
        discountPercent={discountPercent}
        discountAmount={discountAmount}
        taxPercent={taxPercent}
        taxAmount={taxAmount}
        totalCost={totalCost}
        keypadMode={keypadMode}
        keypadValue={keypadValue}
        onModeClick={onModeClick}
        onKeyPress={onKeyPress}
        onEnter={() => applyKeypadValue(0)}
        onPayment={handlePayment}
        paying={paying}
      />

      <PosVariantModal
        open={variantOpen}
        product={selectedProduct}
        onCancel={() => {
          setVariantOpen(false);
          setSelectedProduct(null);
        }}
        onAdd={addToCart}
      />
    </div>
  );

  return (
    <div>
      <Tabs
        activeKey={mainTab}
        onChange={setMainTab}
        size="large"
        items={[
          { key: "sell", label: "POS Sell", children: sellContent },
          { key: "orders", label: "POS Orders", children: <PosOrdersTab /> },
        ]}
      />
    </div>
  );
}
