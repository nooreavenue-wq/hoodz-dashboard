import React from "react";
import UnassignedOrdersContainer from "./_Component/UnassignedOrdersTable";

export const metadata = {
  title: "Unassigned Orders - Admin",
  description: "Unassigned Orders page for Admin",
};

export default function page() {
  return (
    <div>
      <UnassignedOrdersContainer />
    </div>
  );
}
