import Image from "next/image";
import React from "react";
import logo from "@/assets/logos/logoforsideber.png";
import authBackground from "@/assets/images/auth.png";

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${authBackground.src})` }}
      />

      {/* Dark overlay — behind content */}
      <div className="absolute inset-0 z-0 bg-black/80" />

      {/* Content — above overlay */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full justify-between px-4 py-8 md:px-8 lg:px-16">
        {/* Left Section */}
        <div className="hidden flex-col items-center justify-center gap-[70px] lg:flex lg:w-1/2">
          <Image src={logo} alt="HOODZ Logo" priority />

          <div className="space-y-4 text-center">
            <h1 className="text-5xl font-bold text-white">
              Welcome to <span className="text-[#f5642b]">HOODZ</span>
            </h1>

            <p className="max-w-xl text-xl font-bold text-white">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Similique, mollitia?
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex w-full items-center justify-center lg:w-1/2">
          <div className="w-full max-w-xl">{children}</div>
        </div>
      </div>
    </div>
  );
}
