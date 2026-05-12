import api from './api';
import type { Project, ApiResponse, PaginatedResponse, DisplayVariant } from '../types';

export interface ProjectFilters {
  page?: number;
  limit?: number;
  category?: string;
  categoryId?: string;
  industry?: string;
  displayVariant?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  featured?: boolean;
  search?: string;
}

export interface ProjectStatDto {
  label: string;
  value: string;
  description?: string;
}

export interface CreateProjectDto {
  title: string;
  slug: string;
  summary: string;
  challenge?: string;
  solution?: string;
  results?: { label: string; value: string }[];
  features?: string[];
  technologies?: string[];
  images?: { cover?: string; gallery?: string[] };
  projectUrl?: string | null;
  clientName?: string;
  category?: string;
  categoryId?: string;
  industry?: string;
  duration?: string;
  year?: string;
  clientLogo?: string;
  accentColor?: string;
  sortOrder?: number;
  featuredOrder?: number;
  displayVariant?: DisplayVariant;
  previewScreens?: string[];
  videoUrl?: string;
  stats?: ProjectStatDto[];
  isFeatured?: boolean;
  seo?: { metaTitle?: string; metaDescription?: string; keywords?: string[] };
  isPublished?: boolean;
}

export type UpdateProjectDto = Partial<CreateProjectDto>;

export const projectsService = {
  getAll: async (filters?: ProjectFilters): Promise<PaginatedResponse<Project>> => {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.category) params.append('category', filters.category);
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.industry) params.append('industry', filters.industry);
    if (filters?.displayVariant) params.append('displayVariant', filters.displayVariant);
    if (filters?.isPublished !== undefined) params.append('isPublished', String(filters.isPublished));
    if (filters?.isFeatured !== undefined) params.append('isFeatured', String(filters.isFeatured));
    if (filters?.featured !== undefined) params.append('featured', String(filters.featured));
    if (filters?.search) params.append('search', filters.search);

    // Use admin endpoint to get all projects including unpublished
    const response = await api.get<ApiResponse<Project[]>>(`/projects/admin?${params.toString()}`);
    return {
      data: response.data.data,
      meta: response.data.meta!,
    };
  },

  getById: async (id: string): Promise<Project> => {
    const response = await api.get<ApiResponse<Project>>(`/projects/admin/${id}`);
    return response.data.data;
  },

  getBySlug: async (slug: string): Promise<Project> => {
    const response = await api.get<ApiResponse<Project>>(`/projects/slug/${slug}`);
    return response.data.data;
  },

  create: async (data: CreateProjectDto): Promise<Project> => {
    const response = await api.post<ApiResponse<Project>>('/projects', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateProjectDto): Promise<Project> => {
    const response = await api.patch<ApiResponse<Project>>(`/projects/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },

  toggleFeatured: async (id: string, isFeatured: boolean): Promise<Project> => {
    const response = await api.patch<ApiResponse<Project>>(`/projects/${id}`, { isFeatured });
    return response.data.data;
  },

  togglePublished: async (id: string, isPublished: boolean): Promise<Project> => {
    const response = await api.patch<ApiResponse<Project>>(`/projects/${id}`, { isPublished });
    return response.data.data;
  },
};

