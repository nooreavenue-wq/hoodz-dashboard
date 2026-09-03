import React from "react";
import GeneralSettingContainer from "./_Component/GeneralSettingContainer";

export const metadata = {
  title: "General Settings - Admin",
  description: "General Settings page for Admin",
};

export default function page() {
  return (
    <div>
      <GeneralSettingContainer />
    </div>
  );
}
