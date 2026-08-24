import axios from "axios";
import { API_BASE_URL } from "@/config/api";
import { localeFromPath } from "@/i18n";

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config) => {
  const isPublicSite = /^\/(ar|en)(?:\/|$)/.test(window.location.pathname);
  const locale = localeFromPath();
  const token =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("admin_token") ||
    localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (isPublicSite) {
    config.headers["Accept-Language"] = locale;
    if (config.method?.toLowerCase() === "get") {
      config.params = { ...(config.params ?? {}), lang: locale };
    }
    if (
      config.data &&
      typeof config.data === "object" &&
      /\/(leads|newsletter)(?:\/|$)|\/select$/.test(config.url ?? "")
    ) {
      config.data = { ...config.data, locale };
    }
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
