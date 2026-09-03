import React from "react";
import DepositContainer from "./_Component/DepositContainer";

export const metadata = {
  title: "Deposits - Admin",
  description: "Deposits page for Admin",
};

export default function page() {
  return (
    <div>
      <DepositContainer />
    </div>
  );
}
