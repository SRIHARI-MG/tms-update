// src/utils/authHandler.ts

import { AxiosError, AxiosInstance } from "axios";

export const logoutEvent = new Event("logout");

export const setupAuthInterceptor = (api: AxiosInstance) => {
  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 403) {
        // Token has expired
        alert("Your session has expired. Please login again.");
        localStorage.removeItem("authToken");
        window.dispatchEvent(logoutEvent); // Dispatch event to notify logout
      }
      return Promise.reject(error);
    }
  );
};
