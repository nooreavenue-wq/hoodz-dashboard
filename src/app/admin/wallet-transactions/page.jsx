import React from "react";
import TopUpTransactionContainer from "./_Component/TopUpTransactionContainer";

export const metadata = {
  title: "Wallet Transactions - Admin",
  description: "Wallet Transactions page for Admin",
};

export default function page() {
  return (
    <div>
      <TopUpTransactionContainer />
    </div>
  );
}
