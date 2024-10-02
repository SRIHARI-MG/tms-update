import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState<number>(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      navigate("/");
    }
  }, [countdown, navigate]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg mx-auto text-center overflow-hidden">
        <CardContent className="p-6 sm:p-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <h1 className="text-4xl sm:text-6xl font-bold mb-4 sm:mb-6">
              Oops! 404
            </h1>
          </motion.div>
          <p className="text-lg sm:text-xl mb-4 sm:mb-6">
            Looks like you've ventured into the void!
          </p>
          <div className="space-y-3 sm:space-y-4">
            <p className="text-base sm:text-lg">
              Don't worry, we'll get you back home in{" "}
              <span className="font-bold text-xl sm:text-2xl text-primary">
                {countdown}
              </span>{" "}
              seconds.
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 dark:bg-gray-700">
              <motion.div
                className="bg-primary h-2 sm:h-2.5 rounded-full"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 3, ease: "linear" }}
              />
            </div>
          </div>
          <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
            <p className="text-base sm:text-lg">Or choose your escape route:</p>
            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Button
                onClick={() => navigate("/")}
                variant="default"
                className="w-full sm:w-auto"
              >
                Go to Home
              </Button>
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Back to the future
              </Button>
            </div>
          </div>
          <div className="mt-6 sm:mt-8">
            <div className="flex justify-center space-x-3 sm:space-x-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-primary/20"
                >
                  <div className="w-full h-full rounded-full bg-primary animate-ping" />
                </Skeleton>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
