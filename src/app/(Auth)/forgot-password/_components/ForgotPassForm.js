"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPassSchema } from "@/schema/authSchema";
import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import { Button } from "antd";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import logo from "@/assets/images/logo.png";
import { useRouter } from "next/navigation";
import { useForgetPasswordMutation } from "@/redux/api/authApi";
import toast from "react-hot-toast";

export default function ForgotPassForm() {
  const router = useRouter();
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();
  const onSubmit = async (data) => {
    try {
      const res = await forgetPassword(data).unwrap();
      if (res?.success) {
        toast.success(res?.message);
        localStorage.setItem("forgetPasswordToken", res?.data?.verifyToken);
        router.push("/otp-verification");
      }
    } catch (error) {
      if (error?.data?.message) {
        toast.error(error?.data?.message || "Failed to send OTP");
      } else {
        toast.error("Something went wrong");
      }
    }
  };
  return (
    <div className="w-full rounded-md border bg-[#9CA2AE]/30 px-6 py-8">
      <Link
        href="/login"
        className="flex-center-start mb-4 gap-x-2 font-medium text-white hover:text-primary-blue/85"
      >
        <ArrowLeft size={18} /> Back to login
      </Link>

      <section className="mb-8 flex flex-col items-center justify-center space-y-2">
        <Image src={logo} alt="logo" width={100} height={100} />
        <h4 className="text-3xl font-semibold text-white">Forgot Password</h4>
        <p className="text-center text-white/90">
          Enter your email and we&apos;ll send you an otp for verification
        </p>
      </section>

      <FormWrapper onSubmit={onSubmit} resolver={zodResolver(forgotPassSchema)}>
        <UInput
          name="email"
          type="email"
          label="Email"
          labelStyles={{ fontWeight: "500", color: "white" }}
          placeholder="Enter your email"
          size="large"
          className="!h-10"
        />

        <Button
          type="primary"
          size="large"
          className="!h-10 w-full !font-semibold"
          htmlType="submit"
          style={{
            background: "linear-gradient(90deg, #F75908 0%, #F75908 100%)",
          }}
          loading={isLoading}
        >
          Submit
        </Button>
      </FormWrapper>
    </div>
  );
}
