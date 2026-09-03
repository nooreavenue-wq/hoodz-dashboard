import React from "react";
import GlobalVoucherContainer from "./_Component/GlobalVoucherContainer";

export const metadata = {
  title: "Vouchers - Admin",
  description: "Vouchers page for Admin",
};

export default function page() {
  return (
    <div>
      <GlobalVoucherContainer />
    </div>
  );
}
