import React from "react";
import AllTransactionContainer from "./_Component/AllTransactionContainer";

export const metadata = {
  title: "All Transactions - Admin",
  description: "All Transactions page for Admin",
};

export default function page() {
  return (
    <div>
      <AllTransactionContainer />
    </div>
  );
}
