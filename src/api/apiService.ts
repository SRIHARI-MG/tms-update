import axios from "axios";
import { setupAuthInterceptor } from "@/utils/authHandler";
import { NavigateFunction } from "react-router-dom";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_KEY,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const initializeApi = (
  navigate: NavigateFunction,
  showToast: (message: string) => void
) => {
  setupAuthInterceptor(api, navigate, showToast);
};

export default api;
