import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_KEY,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      toast.warning("Session expired. Redirecting to login page...", {
        duration: 2000,
        onDismiss: () => {
          localStorage.clear();
          window.location.pathname = "/login";
        },
      });
    }
    return Promise.reject(error);
  }
);

export default api;