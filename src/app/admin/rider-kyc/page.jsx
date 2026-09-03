import React from "react";
import RiderKycVerification from "./_Component/RiderKycVerification";

export const metadata = {
  title: "Rider KYC Verification - Admin",
  description: "Rider KYC Verification page for Admin",
};

export default function page() {
  return (
    <div>
      <RiderKycVerification />
    </div>
  );
}
