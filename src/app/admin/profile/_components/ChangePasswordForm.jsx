"use client";

import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import { useChangepasswordMutation } from "@/redux/api/authApi";

import { Button } from "antd";
import toast from "react-hot-toast";

export default function ChangePassForm() {
  const [changePass, { isLoading }] = useChangepasswordMutation();

  const handleSubmit = async (data) => {
    try {
      const res = await changePass(data).unwrap();
      if (res.success) {
        toast.success("Password Change Successfully");
      }
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <section className="mt-5 w-full px-10">
      {/* <h4></h4> */}
      <FormWrapper onSubmit={handleSubmit}>
        <UInput
          name="currentPassword"
          label="Old Password"
          type="password"
          placeholder="***********"
        />
        <UInput
          name="password"
          label="New Password"
          type="password"
          placeholder="***********"
        />
        <UInput
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="***********"
        />

        <Button
          loading={isLoading}
          htmlType="submit"
          className="w-full"
          size="large"
          type="primary"
        >
          Save
        </Button>
      </FormWrapper>
    </section>
  );
}
