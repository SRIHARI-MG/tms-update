import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LockIcon, KeyIcon, ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
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
      navigate("/login");
    }
  }, [countdown, navigate]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-950">
      <Card className="w-full max-w-lg mx-auto text-center overflow-hidden shadow-lg">
        <CardContent className="p-6 sm:p-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <LockIcon className="w-16 h-16 sm:w-24 sm:h-24 mx-auto text-red-500 dark:text-red-400" />
          </motion.div>
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-6xl font-bold mt-4 mb-2 sm:mb-4 text-red-700 dark:text-red-300"
          >
            401 Unauthorized
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg sm:text-xl mb-6 sm:mb-8 text-gray-600 dark:text-gray-300"
          >
            Oops! Looks like you don't have the key to this area.
          </motion.p>
          <div className="space-y-4 sm:space-y-6">
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
              Redirecting to login in{" "}
              <span className="font-bold text-xl sm:text-2xl text-red-600 dark:text-red-400">
                {countdown}
              </span>{" "}
              seconds.
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 dark:bg-gray-700">
              <motion.div
                className="bg-red-600 h-2 sm:h-2.5 rounded-full"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 3, ease: "linear" }}
              />
            </div>
          </div>
          <div className="mt-8 sm:mt-10 space-y-4 sm:space-y-6">
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
              Or choose your next move:
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Button
                onClick={() => navigate("/login")}
                variant="default"
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
              >
                <KeyIcon className="mr-2 h-4 w-4" /> Go to Login
              </Button>
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="w-full sm:w-auto border-red-600 text-red-600 hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-950"
              >
                <ArrowLeftIcon className="mr-2 h-4 w-4" /> Go Back
              </Button>
            </div>
          </div>
          <div className="mt-8 sm:mt-10">
            <div className="flex justify-center space-x-3 sm:space-x-4">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-red-500 dark:bg-red-400"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.6, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
