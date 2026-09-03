import React from "react";
import OrderTableContainer from "./_Component/OrderTableContainer";

export const Metadata = {
  title: "Order Details - Admin",
  description: "Order Details page for Admin",
};

export default function page() {
  return (
    <div>
      <OrderTableContainer />
    </div>
  );
}
