import publicApi from "./api";
import type { Blog } from "../admin/types";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

export interface BlogFilters {
  page?: number;
  limit?: number;
  tag?: string;
  category?: string;
  contentType?: string;
  search?: string;
  isFeatured?: boolean;
  sort?: "latest" | "popular" | "featured";
}

export type BlogTaxonomyItem = { value: string; label: string; count: number };

export const publicBlogService = {
  // Get all published blogs with optional filters
  getAll: async (filters?: BlogFilters): Promise<PaginatedResponse<Blog>> => {
    const params = new URLSearchParams();
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.limit) params.append("limit", String(filters.limit));
    if (filters?.tag) params.append("tag", filters.tag);
    if (filters?.category) params.append("category", filters.category);
    if (filters?.contentType) params.append("contentType", filters.contentType);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.isFeatured !== undefined) params.append("isFeatured", String(filters.isFeatured));
    if (filters?.sort) params.append("sort", filters.sort);

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
  getTags: async (): Promise<BlogTaxonomyItem[]> => {
    const response = await publicApi.get<
      ApiResponse<BlogTaxonomyItem[]>
    >("/blog/tags");
    return response.data.data;
  },

  getCategories: async (): Promise<BlogTaxonomyItem[]> => {
    const response = await publicApi.get<ApiResponse<BlogTaxonomyItem[]>>(
      "/blog/categories"
    );
    return response.data.data;
  },

  getFeatured: async (limit = 3): Promise<Blog[]> => {
    const response = await publicApi.get<ApiResponse<Blog[]>>(
      `/blog/featured?limit=${limit}`
    );
    return response.data.data;
  },

  getPopular: async (limit = 5): Promise<Blog[]> => {
    const response = await publicApi.get<ApiResponse<Blog[]>>(
      `/blog/popular?limit=${limit}`
    );
    return response.data.data;
  },

  getRelated: async (slug: string, limit = 3): Promise<Blog[]> => {
    const response = await publicApi.get<ApiResponse<Blog[]>>(
      `/blog/related/${slug}?limit=${limit}`
    );
    return response.data.data;
  },
};
