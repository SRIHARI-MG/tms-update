import Header, { UserProvider } from "@/layout/Header";
import { ThemeProvider } from "@/hooks/use-theme";
import { useOutlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

interface LayoutProps {
  role?: string | string[];
}

export function LayoutPage({ role }: LayoutProps) {
  const outlet = useOutlet();

  return (
    <>
      <ThemeProvider>
        <UserProvider>
          <div className="h-screen bg-background flex flex-col overflow-hidden">
            <Header />
            <main className="overflow-y-auto pt-[calc(4rem+1.5rem)] md:pt-[calc(5rem+3.5rem+2rem)] px-4 md:px-10 flex-1">
              {outlet}
            </main>
          </div>
          <Toaster />
        </UserProvider>
      </ThemeProvider>
    </>
  );
}
