// src/api/apiService.ts

import axios from "axios";
import { setupAuthInterceptor } from "@/utils/authHandler";

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

setupAuthInterceptor(api);

export default api;
