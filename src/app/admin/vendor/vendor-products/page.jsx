import React from "react";
import ProductContainer from "./_Component/ProductContainer";

export const metadata = {
  title: "Vendor Products - Admin",
  description: "Vendor Products page for Admin",
};

export default function page() {
  return (
    <div>
      <ProductContainer />
    </div>
  );
}
