import React from "react";
import Header from "@/layout/Header";
import { ThemeProvider } from "@/hooks/use-theme";

interface LayoutProps {
  role?: string | string[];
  children?: React.ReactNode;
}

export function LayoutPage({ role, children }: LayoutProps) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto py-6 px-4"></main>
      </div>
    </ThemeProvider>
  );
}
