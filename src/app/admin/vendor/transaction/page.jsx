import React from "react";
import VendorOwnTransactionContainer from "./_Component/VendorOwnTransactionContainer";

export const metadata = {
  title: "Transactions - Admin",
  description: "Transactions page for Admin",
};

export default function page() {
  return (
    <div>
      <VendorOwnTransactionContainer />
    </div>
  );
}
