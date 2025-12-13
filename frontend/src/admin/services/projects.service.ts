import api from './api';
import type { Project, ApiResponse, PaginatedResponse } from '../types';

export interface ProjectFilters {
  page?: number;
  limit?: number;
  category?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  search?: string;
}

export interface CreateProjectDto {
  title: string;
  slug: string;
  summary: string;
  challenge?: string;
  solution?: string;
  results?: { label: string; value: string }[];
  technologies?: string[];
  images?: { cover?: string; gallery?: string[] };
  projectUrl?: string;
  clientName?: string;
  category?: string;
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
    if (filters?.isPublished !== undefined) params.append('isPublished', String(filters.isPublished));
    if (filters?.isFeatured !== undefined) params.append('isFeatured', String(filters.isFeatured));
    if (filters?.search) params.append('search', filters.search);

    const response = await api.get<ApiResponse<Project[]>>(`/projects?${params.toString()}`);
    return {
      data: response.data.data,
      meta: response.data.meta!,
    };
  },

  getById: async (id: string): Promise<Project> => {
    const response = await api.get<ApiResponse<Project>>(`/projects/${id}`);
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
};

