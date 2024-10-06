// src/utils/authHandler.ts

import { AxiosError, AxiosInstance } from "axios";
import { NavigateFunction } from "react-router-dom";

export const setupAuthInterceptor = (
  api: AxiosInstance,
  navigate: NavigateFunction,
  showToast: (message: string) => void
) => {
  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 403) {
        handleLogout(navigate, showToast);
      }
      return Promise.reject(error);
    }
  );
};

export const handleLogout = (
  navigate: NavigateFunction,
  showToast: (message: string) => void
) => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("role");
  showToast("You have been successfully logged out.");
  navigate("/login", { replace: true });
};
