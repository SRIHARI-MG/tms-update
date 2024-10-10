import { BrowserRouter, useNavigate } from "react-router-dom";
import React, { useCallback } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeApi } from "@/api/apiService";
import { useToast } from "./hooks/use-toast.ts";

function AppWithRouter() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const showToast = useCallback(
    (message: string) => {
      toast({
        title: "Notification",
        description: message,
        variant: "default",
      });
    },
    [toast]
  );

  React.useEffect(() => {
    initializeApi(navigate, showToast);
  }, [navigate, showToast]);

  return <App />;
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AppWithRouter />
  </BrowserRouter>
);
