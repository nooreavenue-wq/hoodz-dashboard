import React from "react";
import BannerContainer from "./_Component/BannerContainer";

export const metadata = {
  title: "Banner Management",
  description: "Banner Management page for Admin",
};

export default function page() {
  return (
    <div>
      <BannerContainer />
    </div>
  );
}
