import api from "./api";
import type { AuthResponse, LoginCredentials, User } from "../types";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<{ data: AuthResponse }>(
      "/auth/login",
      credentials
    );
    const authData = response.data.data;

    // Store token and user in localStorage
    localStorage.setItem("accessToken", authData.accessToken);
    localStorage.setItem("user", JSON.stringify(authData.user));

    return authData;
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    window.location.href = "/admin/login";
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<{ data: User }>("/auth/profile");
    return response.data.data;
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken: (): string | null => {
    return localStorage.getItem("accessToken");
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("accessToken");
  },
};
