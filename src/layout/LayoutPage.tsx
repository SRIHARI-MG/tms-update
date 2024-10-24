import Header, { UserProvider } from "@/layout/Header";
import { ThemeProvider } from "@/hooks/use-theme";
import { useLocation, useOutlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { DrawerProvider, useDrawer } from "@/hooks/use-drawer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import React from "react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  role?: string | string[];
}

function Layout() {
  const outlet = useOutlet();
  const { isDrawerOpen, closeDrawer, drawerContent } = useDrawer();
  const navigate = useNavigate();
  const location = useLocation();

  const hasChildren =
    drawerContent &&
    React.Children.count(drawerContent?.content?.props.children) > 0;

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden pt-[calc(4rem+2.5rem)] md:pt-[calc(5rem+4.5rem)]">
        {isDrawerOpen && drawerContent && hasChildren && (
          // Sidebar div
          <div className="w-64 bg-background  shadow-xl shadow-primary/10 overflow-y-auto fixed left-0 top-[calc(4rem+1.5rem)] md:top-[calc(5rem+3.5rem)] bottom-0">
            <div className="p-4 m-2">
              <h2 className="text-lg font-semibold mb-4">
                {drawerContent.title}
              </h2>
              <div className="space-y-2">
                {React.Children.map(
                  drawerContent?.content?.props.children,
                  (child) => (
                    <Button
                      variant={isActive(child.props.path) ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        isActive(child.props.path) &&
                          "bg-primary text-primary-foreground"
                      )}
                      onClick={() => {
                        if (typeof child.props.onClick === "function") {
                          const path = child.props.onClick();
                          navigate(path);
                        } else if (child.props.path) {
                          navigate(child.props.path);
                        }
                      }}
                    >
                      {child.props.children}
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>
        )}
        <main
          className={`flex-1 overflow-y-auto px-4 md:px-10 transition-all duration-300 ${
            isDrawerOpen && hasChildren ? "ml-64" : ""
          }`}
        >
          {outlet}
        </main>
      </div>
    </div>
  );
}

export function LayoutPage({ role }: LayoutProps) {
  return (
    <ThemeProvider>
      <UserProvider>
        <DrawerProvider>
          <Layout />
          <Toaster />
        </DrawerProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
