import publicApi from "./api";
import type { Project } from "../admin/types";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

export interface ProjectFilters {
  page?: number;
  limit?: number;
  categoryIds?: string[];
  industry?: string;
  featured?: boolean;
  isFeatured?: boolean;
  search?: string;
  tech?: string;
}

export const publicProjectsService = {
  // Get all published projects with optional filters
  getAll: async (
    filters?: ProjectFilters
  ): Promise<PaginatedResponse<Project>> => {
    const params = new URLSearchParams();
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.limit) params.append("limit", String(filters.limit));
    if (filters?.categoryIds?.length) params.append("categoryIds", filters.categoryIds.join(","));
    if (filters?.industry) params.append("industry", filters.industry);
    if (filters?.featured !== undefined)
      params.append("featured", String(filters.featured));
    if (filters?.isFeatured !== undefined)
      params.append("isFeatured", String(filters.isFeatured));
    if (filters?.search) params.append("search", filters.search);
    if (filters?.tech) params.append("tech", filters.tech);

    const response = await publicApi.get<ApiResponse<Project[]>>(
      `/projects?${params.toString()}`
    );
    return {
      data: response.data.data ?? [],
      meta: response.data.meta ?? { total: 0, page: 1, limit: 10, totalPages: 0 },
    };
  },

  // Get featured projects
  getFeatured: async (): Promise<Project[]> => {
    const response = await publicApi.get<ApiResponse<Project[]>>(
      "/projects/featured"
    );
    return response.data.data ?? [];
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
    { _id?: string; value: string; label: string; count: number }[]
  > => {
    const response = await publicApi.get<
      ApiResponse<{ _id?: string; value: string; label: string; count: number }[]>
    >("/projects/categories");
    return response.data.data ?? [];
  },

  getProjects(filters?: ProjectFilters) {
    return this.getAll(filters);
  },

  getFeaturedProjects() {
    return this.getFeatured();
  },

  getProjectBySlug(slug: string) {
    return this.getBySlug(slug);
  },

  getRelatedProjects: async (project: Project): Promise<Project[]> => {
    const categoryIds = Array.isArray(project.categoryIds)
      ? project.categoryIds
          .map((c) => (typeof c === 'object' && c !== null ? (c as { _id: string })._id : c))
          .filter(Boolean)
      : [];

    const primaryCategoryId = categoryIds.length > 0 ? categoryIds[0] : undefined;

    const response = await publicProjectsService.getAll({
      limit: 4,
      categoryIds: primaryCategoryId ? [primaryCategoryId] : undefined,
    });

    return response.data.filter((item) => item._id !== project._id);
  },
};
