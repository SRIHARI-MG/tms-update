import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ButtonProps } from "@/components/ui/button";

interface LoadingButtonProps extends ButtonProps {
  onClick?: () => Promise<void>;
  onSubmit?: () => Promise<void>;
  children: React.ReactNode;
}

export default function LoadingButton({
  onClick,
  onSubmit,
  children,
  disabled,
  type,
  ...props
}: LoadingButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = useCallback(
    async (action: (() => Promise<void>) | undefined) => {
      if (!action) return;

      setIsLoading(true);
      try {
        await action();
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleClick = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      if (type === "submit") {
        // If it's a submit button, don't prevent default
        return;
      }
      event.preventDefault();
      await handleAction(onClick);
    },
    [handleAction, onClick, type]
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await handleAction(onSubmit);
    },
    [handleAction, onSubmit]
  );

  React.useEffect(() => {
    const form = document.querySelector("form");
    if (form && type === "submit") {
      form.addEventListener("submit", handleSubmit as any);
      return () => {
        form.removeEventListener("submit", handleSubmit as any);
      };
    }
  }, [handleSubmit, type]);

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || isLoading}
      type={type}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        children
      )}
    </Button>
  );
}
