import React from "react";
import VendorPaymentContainer from "./_Component/VendorPaymentContainer";

export const metadata = {
  title: "Vendor Payment - Admin",
  description: "Vendor Payment page for Admin",
};

export default function page() {
  return (
    <div>
      <VendorPaymentContainer />
    </div>
  );
}
