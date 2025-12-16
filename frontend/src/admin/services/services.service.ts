import api from "./api";
import type { ApiResponse, PaginatedResponse } from "../types";

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
  createdAt: string;
  updatedAt: string;
}

export interface ServiceFilters {
  page?: number;
  limit?: number;
  isActive?: boolean;
  search?: string;
}

export interface CreateServiceDto {
  title: string;
  description?: string;
  icon?: string;
  iconType?: string;
  gradient?: string;
  features?: string[];
  isActive?: boolean;
  sortOrder?: number;
  slug?: string;
  shortDescription?: string;
}

export type UpdateServiceDto = Partial<CreateServiceDto>;

export const servicesService = {
  getAll: async (
    filters?: ServiceFilters
  ): Promise<PaginatedResponse<Service>> => {
    const params = new URLSearchParams();
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.limit) params.append("limit", String(filters.limit));
    if (filters?.isActive !== undefined)
      params.append("isActive", String(filters.isActive));
    if (filters?.search) params.append("search", filters.search);

    const response = await api.get<ApiResponse<Service[]>>(
      `/services?${params.toString()}`
    );
    return {
      data: response.data.data,
      meta: response.data.meta!,
    };
  },

  getById: async (id: string): Promise<Service> => {
    const response = await api.get<ApiResponse<Service>>(`/services/${id}`);
    return response.data.data;
  },

  create: async (data: CreateServiceDto): Promise<Service> => {
    const response = await api.post<ApiResponse<Service>>("/services", data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateServiceDto): Promise<Service> => {
    const response = await api.patch<ApiResponse<Service>>(
      `/services/${id}`,
      data
    );
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/services/${id}`);
  },
};
