"use client";

import FormWrapper from "@/components/Form/FormWrapper";
import UTextEditor from "@/components/Form/UTextEditor";
import {
  useGetTermsQuery,
  useUpdateVendorTermsMutation,
} from "@/redux/api/settingsApi";
import { Button } from "antd";
import { Edit } from "lucide-react";
import toast from "react-hot-toast";

export default function TermsConditionsContainer() {
  const { data: termsAndConditions, isLoading } = useGetTermsQuery({
    key: "vendorTermsAndConditions",
  });

  const value = termsAndConditions?.data?.value;

  const [updateContent, { isLoading: updating }] =
    useUpdateVendorTermsMutation();

  const handleSubmit = async (values) => {
    try {
      const res = await updateContent(values).unwrap();

      if (res.success) {
        toast.success("Content updated successfully");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update content");
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <section>
      <h3 className="mb-6 text-2xl font-semibold">T & C for User</h3>

      <FormWrapper onSubmit={handleSubmit}>
        <UTextEditor
          name="value"
          placeholder="Note: Enter details about your terms and conditions here."
          value={value}
        />

        <Button
          type="primary"
          size="large"
          htmlType="submit"
          className="w-full rounded-xl"
          icon={<Edit size={18} />}
          loading={updating}
        >
          Save Changes
        </Button>
      </FormWrapper>
    </section>
  );
}
