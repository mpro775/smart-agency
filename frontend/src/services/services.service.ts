import publicApi from "./api";
import type { ApiResponse } from "../admin/types";

export interface Service {
  _id: string;
  title: string;
  description?: string;
  icon?: string;
  iconType?: string;
  gradient?: string;
  features?: string[];
  isActive: boolean;
  sortOrder: number;
  slug?: string;
  shortDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const publicServicesService = {
  // Get all active services
  getAll: async (): Promise<Service[]> => {
    const response = await publicApi.get<ApiResponse<Service[]>>(
      "/services/active"
    );
    return response.data.data;
  },

  // Get a service by slug
  getBySlug: async (slug: string): Promise<Service> => {
    const response = await publicApi.get<ApiResponse<Service>>(
      `/services/slug/${slug}`
    );
    return response.data.data;
  },

  // Get a service by ID
  getById: async (id: string): Promise<Service> => {
    const response = await publicApi.get<ApiResponse<Service>>(
      `/services/${id}`
    );
    return response.data.data;
  },
};
