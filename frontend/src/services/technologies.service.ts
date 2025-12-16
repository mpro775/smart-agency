import publicApi from "./api";
import type { ApiResponse } from "../admin/types";

export interface Technology {
  _id: string;
  name: string;
  icon?: string;
  category?: string;
  description?: string;
  tooltip?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TechnologyFilters {
  category?: string;
}

export const publicTechnologiesService = {
  // Get all technologies
  getAll: async (filters?: TechnologyFilters): Promise<Technology[]> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);

    const response = await publicApi.get<ApiResponse<Technology[]>>(
      `/technologies?${params.toString()}`
    );
    return response.data.data;
  },

  // Get technology by ID
  getById: async (id: string): Promise<Technology> => {
    const response = await publicApi.get<ApiResponse<Technology>>(
      `/technologies/${id}`
    );
    return response.data.data;
  },
};
