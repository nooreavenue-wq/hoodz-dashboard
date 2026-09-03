import React from "react";
import WithdrawalContainer from "./_Component/WithdrawalContainer";

export const metadata = {
  title: "Withdrawals - Admin",
  description: "Withdrawals page for Admin",
};

export default function page() {
  return (
    <div>
      <WithdrawalContainer />
    </div>
  );
}
