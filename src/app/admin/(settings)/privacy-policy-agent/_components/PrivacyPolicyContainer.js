"use client";

import FormWrapper from "@/components/Form/FormWrapper";
import UTextEditor from "@/components/Form/UTextEditor";
import { useGetContentsPrivacyPolicyQuery } from "@/redux/api/contentApi";
import {
  useGetPrivecyQuery,
  useUpdateAgentPrivecyMutation,
} from "@/redux/api/settingsApi";
import { Button } from "antd";
import { Edit } from "lucide-react";
import toast from "react-hot-toast";

export default function PrivacyPolicyContainer() {
  // get privacy policy
  const { data: privacyPolicy, isLoading } = useGetPrivecyQuery({
    key: "agentPrivacyAndPolicy",
  });
  const value = privacyPolicy?.data?.value;

  // update contetnt api handeller

  const [updateContent, { isLoading: updating }] =
    useUpdateAgentPrivecyMutation();

  const handleSubmit = async (values) => {
    try {
      const res = await updateContent(values).unwrap();
      if (res.success) {
        toast.success("Content Update Successfully");
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
      <h3 className="mb-6 text-2xl font-semibold">Privacy Policy</h3>

      <FormWrapper onSubmit={handleSubmit}>
        <UTextEditor
          value={value}
          name="value"
          placeholder="Note: Enter details about your privacy policy here."
        />

        <Button
          type="primary"
          size="large"
          className="w-full rounded-xl"
          htmlType="submit"
          icon={<Edit size={18} />}
          loading={updating}
        >
          Save Changes
        </Button>
      </FormWrapper>
    </section>
  );
}
