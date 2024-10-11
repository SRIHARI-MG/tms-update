import React, { lazy, Suspense, useMemo } from "react";
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
import Loading from "@/components/ui/loading";

const MindgraphNetwork = lazy(
  () => import("@/components/ui/mindgraph-network-animation")
);

type AuthLayoutProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

// Memoized company logo component
const CompanyLogo = React.memo(({ className }: { className?: string }) => (
  <img src={companyLogo} alt="Company Logo" className={className} />
));

// Memoized interactive cloud component
const MemoizedInteractiveCloud = React.memo(() => {
  const images = useMemo(
    () => [
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
    ],
    []
  );

  return <InteractiveIconCloud images={images} />;
});

// Memoized background network component
const BackgroundNetwork = React.memo(() => (
  <div className="absolute inset-0 z-0 overflow-hidden">
    <div className="absolute -inset-3/4 lg:-top-1/4 -top-full -left-1/2 lg:-left-1/4 rotate-45">
      <MindgraphNetwork width={2000} height={1300} />
    </div>
    <div className="hidden lg:block absolute -inset-1/4 lg:-top-full -right-full rotate-45">
      <MindgraphNetwork width={1200} height={800} />
    </div>
  </div>
));

// Memoized left side component
const LeftSide = React.memo(
  ({ title, description }: Omit<AuthLayoutProps, "children">) => (
    <div className="hidden w-1/2 lg:block bg-gradient-to-br from-primary to-primary p-12 z-20">
      <div className="h-full flex flex-col justify-between">
        <CompanyLogo className="w-1/3" />

        <div className="text-white">
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          <p className="text-lg">{description}</p>
        </div>

        <MemoizedInteractiveCloud />

        <div className="text-white/60 text-sm">
          © 2024 Mindgraph. All rights reserved.
        </div>
      </div>
    </div>
  )
);

// Memoized right side component
const RightSide = React.memo(
  ({ children }: Pick<AuthLayoutProps, "children">) => (
    <div className=" w-full lg:w-1/2 flex flex-col gap-5 items-center justify-center p-8 bg-background">
      <div className="max-w-md z-20 lg:hidden">
        <CompanyLogo className="w-full" />
      </div>
      <BackgroundNetwork />
      <div className="z-20">{children}</div>
    </div>
  )
);

export default function AuthLayout({
  children,
  title,
  description,
}: AuthLayoutProps) {
  return (
    <Suspense fallback={<Loading />}>
      <div className="!auth-layout flex min-h-screen z-10 !overflow-hidden">
        <LeftSide title={title} description={description} />
        <RightSide>{children}</RightSide>
        <Toaster />
      </div>
    </Suspense>
  );
}
