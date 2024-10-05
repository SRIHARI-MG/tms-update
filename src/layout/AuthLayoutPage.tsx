import React, { useEffect } from "react";
import companyLogo from "@/assets/CompanyLogo.png";
import LP1 from "@/assets/lp1.svg";
import LP2 from "@/assets/lp2.svg";
import LP3 from "@/assets/lp3.svg";
import LP4 from "@/assets/lp4.svg";
import LP5 from "@/assets/lp5.svg";
import LP6 from "@/assets/lp6.svg";
import LP7 from "@/assets/lp7.svg";
import LP8 from "@/assets/lp8.svg";
import LP9 from "@/assets/lp9.svg";
import LP10 from "@/assets/lp10.svg";
import InteractiveIconCloud from "@/components/ui/orbiting-images";
import { Toaster } from "@/components/ui/toaster";
// import IconCloud from "@/components/ui/icon-cloud";

type AuthLayoutProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function AuthLayout({
  children,
  title,
  description,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Gradient background */}
      <div className="hidden w-1/2 lg:block bg-gradient-to-br from-primary to-primary p-12">
        <div className="h-full flex flex-col justify-between">
          <img src={companyLogo} alt="Company Logo" className="w-1/3" />

          <div className="text-white">
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            <p className="text-lg">{description}</p>
          </div>

          <InteractiveIconCloud
            images={[
              LP3,
              LP4,
              LP5,
              LP6,
              LP7,
              LP8,
              LP9,
              LP10,
              LP1,
              LP2,
              LP5,
              LP6,
              LP7,
              LP3,
              LP4,
              LP5,
              LP6,
              LP7,
              LP8,
              LP9,
              LP10,
              LP1,
              LP2,
              LP3,
              LP4,
              LP7,
              LP8,
              LP9,
              LP1,
              LP2,
              LP8,
              LP9,
              LP10,
            ]}
          />
          <div className="text-white/60 text-sm">
            © 2024 Mindgraph. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col gap-5 items-center justify-center p-8 bg-background">
        <div className="max-w-md lg:hidden">
          <img src={companyLogo} alt="Company Logo" className="w-full" />
        </div>
        {children}
      </div>
      <Toaster />
    </div>
  );
}
