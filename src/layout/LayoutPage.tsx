import React from "react";
import Header from "@/layout/Header";
import { ThemeProvider } from "@/hooks/use-theme";
import { useOutlet } from "react-router-dom";

interface LayoutProps {
  role?: string | string[];
}

export function LayoutPage({ role }: LayoutProps) {
  const outlet = useOutlet();
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto py-6 px-4">{outlet}</main>
      </div>
    </ThemeProvider>
  );
}
