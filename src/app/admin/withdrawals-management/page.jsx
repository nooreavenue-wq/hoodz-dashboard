import React from "react";
import WithdrawalRequestTables from "./_Component/WithdrawalRequestTable";
export const metadata = {
  title: "Withdrawals Management",
  description: "Withdrawals Management page for Admin",
};
function page() {
  return (
    <div>
      <WithdrawalRequestTables />
    </div>
  );
}

export default page;
