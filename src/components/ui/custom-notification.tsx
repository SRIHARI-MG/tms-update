import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface NotificationProps {
  title?: string;
  message: string;
  type: "success" | "error";
}

export default function CustomNotification({
  title,
  message,
  type,
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const isSuccess = type === "success";
  const Icon = isSuccess ? CheckCircle2 : XCircle;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      //   onClose();
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-100 animate-in slide-in-from-top-3 duration-300">
      <Alert
        className={`max-w-md w-[400px] ${
          isSuccess
            ? "bg-green-100 border-green-500"
            : "bg-red-100 border-red-500"
        } shadow-lg border`}
      >
        <div className="flex items-center gap-3">
          <Icon
            className={`h-8 w-8 ${
              isSuccess ? "text-green-600" : "text-red-600"
            }`}
          />
          <div className="flex flex-col">
            {title && (
              <AlertTitle
                className={`text-2xl ${
                  isSuccess ? "text-green-800" : "text-red-800"
                }`}
              >
                {title}
              </AlertTitle>
            )}

            <AlertDescription
              className={`text-lg ${
                isSuccess ? "text-green-700" : "text-red-700"
              }`}
            >
              {message}
            </AlertDescription>
          </div>
        </div>
      </Alert>
    </div>
  );
}
