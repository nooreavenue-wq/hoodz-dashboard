"use client";

import { Spin, Tabs, Empty } from "antd";
import { useGetProfileQuery } from "@/redux/api/profileApi";
import ProfileInfoForm from "./ProfileInfoForm";
import VendorShopSettings from "./VendorShopSettings";
import ChangePassForm from "./ChangePasswordForm";

export default function ProfileContainer() {
  const { data, isLoading } = useGetProfileQuery();
  const profile = data?.data;

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="py-20">
        <Empty description="Profile not found" />
      </div>
    );
  }

  const isVendor = profile.role === "vendor";

  const items = [
    {
      key: "profile",
      label: "Profile Info",
      children: <ProfileInfoForm profile={profile} />,
    },
    {
      key: "change-password",
      label: "Change Password",
      children: <ChangePassForm />,
    },
  ];

  if (isVendor) {
    items.push({
      key: "shop",
      label: "Shop Settings",
      children: <VendorShopSettings vendorId={profile._id} />,
    });
  }

  return (
    <div className="!max-w-2/3 mx-auto flex w-2/3 flex-col justify-center rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">My Profile</h2>
      <Tabs items={items} size="large" />
    </div>
  );
}
