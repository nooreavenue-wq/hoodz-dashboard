"use client";

import { Tabs, Spin } from "antd";
import { useGetPrivecyQuery } from "@/redux/api/settingsApi";
import DeliveryChargeSettings from "./DeliveryChargeSettings";
import FawryAccountSettings from "./FawryAccountSettings";
import GeneralRiderSettings from "./GeneralRiderSettings";

export default function GeneralSettingContainer() {
  const { data: deliveryRes, isLoading: loadingDelivery } = useGetPrivecyQuery({
    key: "deliveryCharge",
  });
  const { data: fawryRes, isLoading: loadingFawry } = useGetPrivecyQuery({
    key: "fawryAccount",
  });
  const { data: generalRes, isLoading: loadingGeneral } = useGetPrivecyQuery({
    key: "generals",
  });

  if (loadingDelivery || loadingFawry || loadingGeneral) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const items = [
    {
      key: "delivery",
      label: "Delivery Charges",
      children: (
        <DeliveryChargeSettings initialData={deliveryRes?.data?.value || {}} />
      ),
    },
    {
      key: "fawry",
      label: "Fawry Account",
      children: (
        <FawryAccountSettings initialData={fawryRes?.data?.value || {}} />
      ),
    },
    {
      key: "general",
      label: "Rider Matching",
      children: (
        <GeneralRiderSettings initialData={generalRes?.data?.value || {}} />
      ),
    },
  ];

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">General Settings</h2>
      <Tabs items={items} size="large" />
    </div>
  );
}
