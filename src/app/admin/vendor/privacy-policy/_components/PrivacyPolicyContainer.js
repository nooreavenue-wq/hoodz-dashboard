"use client";

import { Spin, Empty, Card } from "antd";
import { Shield } from "lucide-react";
import { useGetPrivecyQuery } from "@/redux/api/settingsApi";

export default function PrivacyPolicyContainer() {
  const { data, isLoading } = useGetPrivecyQuery({
    key: "vendorPrivacyAndPolicy",
  });

  const value = data?.data?.value;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
          <Shield className="text-emerald-600" size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-slate-800">
            Privacy Policy
          </h3>
          <p className="text-sm text-slate-500">
            How we handle your data and privacy
          </p>
        </div>
      </div>

      <Card className="border-0 shadow-md">
        {!value ? (
          <Empty description="No privacy policy available" />
        ) : (
          <div
            className="prose prose-slate prose-headings:font-semibold prose-headings:text-slate-800 prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-a:text-blue-600 max-w-none"
            dangerouslySetInnerHTML={{ __html: value }}
          />
        )}
      </Card>
    </section>
  );
}
