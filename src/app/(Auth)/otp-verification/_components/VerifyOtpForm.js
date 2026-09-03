"use client";

import { LogoSvg } from "@/assets/logos/LogoSvg";
import FormWrapper from "@/components/Form/FormWrapper";
import UOtpInput from "@/components/Form/UOtpInput";
import { otpSchema } from "@/schema/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "antd";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "@/assets/images/logo.png";
import { useRouter } from "next/navigation";
import { useVerifyEmailMutation } from "@/redux/api/authApi";
import toast from "react-hot-toast";

export default function VerifyOtpForm() {
  const router = useRouter();
  const [verifyOtp, { isLoading }] = useVerifyEmailMutation();

  const onSubmit = async (data) => {
    try {
      const res = await verifyOtp(data).unwrap();
      if (res?.success == true) {
        toast.success(res?.message || "OTP verified successfully");
        router.push("/set-new-password");
      } else {
        throw new Error(res?.message || "Verification failed");
      }
    } catch (error) {
      if (error?.data?.message) {
        toast.error(error?.data?.message);
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
        <h4 className="text-3xl font-semibold text-white">Verify OTP</h4>
        <p className="text-center text-white/90">
          Enter the otp that we&apos;ve sent to your email
        </p>
      </section>

      <FormWrapper onSubmit={onSubmit} resolver={zodResolver(otpSchema)}>
        <UOtpInput name="otp" />

        <Button
          type="primary"
          loading={isLoading}
          size="large"
          className="!h-10 w-full !font-semibold"
          style={{
            background: "linear-gradient(90deg, #F75908 0%, #F75908 100%)",
          }}
          htmlType="submit"
        >
          Submit
        </Button>
      </FormWrapper>
    </div>
  );
}
