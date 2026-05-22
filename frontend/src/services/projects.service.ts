import publicApi from "./api";
import type { Project } from "../admin/types";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

export interface ProjectFilters {
  page?: number;
  limit?: number;
  category?: string;
  projectType?: string;
  projectTypes?: string[];
  categoryId?: string;
  categoryIds?: string[];
  industry?: string;
  displayVariant?: string;
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
    if (filters?.category) params.append("category", filters.category);
    if (filters?.projectType) params.append("projectType", filters.projectType);
    if (filters?.projectTypes?.length) params.append("projectTypes", filters.projectTypes.join(","));
    if (filters?.categoryId) params.append("categoryId", filters.categoryId);
    if (filters?.categoryIds?.length) params.append("categoryIds", filters.categoryIds.join(","));
    if (filters?.industry) params.append("industry", filters.industry);
    if (filters?.displayVariant)
      params.append("displayVariant", filters.displayVariant);
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

    const categoryId =
      typeof project.categoryId === "object" && project.categoryId !== null
        ? project.categoryId._id
        : project.categoryId;

    const primaryCategoryId = categoryIds.length > 0 ? categoryIds[0] : categoryId;

    const response = await publicProjectsService.getAll({
      limit: 4,
      categoryId: primaryCategoryId,
      category: primaryCategoryId ? undefined : project.category,
    });

    return response.data.filter((item) => item._id !== project._id);
  },
};
