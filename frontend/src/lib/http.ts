import axios from "axios";
import { API_BASE_URL } from "@/config/api";

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("admin_token") ||
    localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

http.interceptors.response.use(
  (response) => {
    if (
      response.data &&
      typeof response.data === "object" &&
      "data" in response.data &&
      response.data.data === undefined
    ) {
      response.data.data = Array.isArray(response.data.items)
        ? response.data.items
        : null;
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("admin_token");
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  },
);
