import React, { useEffect } from "react";
import companyLogo from "@/assets/CompanyLogo.png";

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
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            <p className="text-lg">{description}</p>
          </div>
          <div className="w-full">
            <img src={companyLogo} alt="Company Logo" className="w-full" />
          </div>
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
    </div>
  );
}
