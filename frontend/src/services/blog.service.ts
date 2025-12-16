import publicApi from "./api";
import type { Blog, ApiResponse, PaginatedResponse } from "../admin/types";

export interface BlogFilters {
  page?: number;
  limit?: number;
  tag?: string;
  search?: string;
}

export const publicBlogService = {
  // Get all published blogs with optional filters
  getAll: async (filters?: BlogFilters): Promise<PaginatedResponse<Blog>> => {
    const params = new URLSearchParams();
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.limit) params.append("limit", String(filters.limit));
    if (filters?.tag) params.append("tag", filters.tag);
    if (filters?.search) params.append("search", filters.search);

    const response = await publicApi.get<ApiResponse<Blog[]>>(
      `/blog?${params.toString()}`
    );
    return {
      data: response.data.data,
      meta: response.data.meta!,
    };
  },

  // Get blog by slug
  getBySlug: async (slug: string): Promise<Blog> => {
    const response = await publicApi.get<ApiResponse<Blog>>(
      `/blog/slug/${slug}`
    );
    return response.data.data;
  },

  // Get blog by ID
  getById: async (id: string): Promise<Blog> => {
    const response = await publicApi.get<ApiResponse<Blog>>(`/blog/${id}`);
    return response.data.data;
  },

  // Get available tags with counts
  getTags: async (): Promise<
    { value: string; label: string; count: number }[]
  > => {
    const response = await publicApi.get<
      ApiResponse<{ value: string; label: string; count: number }[]>
    >("/blog/tags");
    return response.data.data;
  },
};
