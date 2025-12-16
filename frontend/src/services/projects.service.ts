import publicApi from "./api";
import type { Project, ApiResponse, PaginatedResponse } from "../admin/types";

export interface ProjectFilters {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
  search?: string;
}

export const publicProjectsService = {
  // Get all published projects with optional filters
  getAll: async (
    filters?: ProjectFilters
  ): Promise<PaginatedResponse<Project>> => {
    const params = new URLSearchParams();
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.limit) params.append("limit", String(filters.limit));
    if (filters?.category) params.append("category", filters.category);
    if (filters?.featured !== undefined)
      params.append("featured", String(filters.featured));
    if (filters?.search) params.append("search", filters.search);

    const response = await publicApi.get<ApiResponse<Project[]>>(
      `/projects?${params.toString()}`
    );
    return {
      data: response.data.data,
      meta: response.data.meta!,
    };
  },

  // Get featured projects
  getFeatured: async (): Promise<Project[]> => {
    const response = await publicApi.get<ApiResponse<Project[]>>(
      "/projects/featured"
    );
    return response.data.data;
  },

  // Get project by slug
  getBySlug: async (slug: string): Promise<Project> => {
    const response = await publicApi.get<ApiResponse<Project>>(
      `/projects/slug/${slug}`
    );
    return response.data.data;
  },

  // Get project by ID
  getById: async (id: string): Promise<Project> => {
    const response = await publicApi.get<ApiResponse<Project>>(
      `/projects/${id}`
    );
    return response.data.data;
  },

  // Get available categories with counts
  getCategories: async (): Promise<
    { value: string; label: string; count: number }[]
  > => {
    const response = await publicApi.get<
      ApiResponse<{ value: string; label: string; count: number }[]>
    >("/projects/categories");
    return response.data.data;
  },
};
